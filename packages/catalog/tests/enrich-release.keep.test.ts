/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createEnricher } from '../src/enrich/create-enricher';
import { sniffImage } from '../src/enrich/sniff-image';
import { cacheFiles, pngBytes, textResponse, webpBytes } from './enrich.fixtures';

const REPO = 'someone/ts-world';
const DOWNLOAD = `https://github.com/${REPO}/releases/latest/download`;
const README_URL = `https://raw.githubusercontent.com/${REPO}/HEAD/README.md`;
const SOCIAL_URL = `https://opengraph.githubassets.com/1/${REPO}`;
const PNG_URL = `${DOWNLOAD}/archipelia-thumbnail.png`;
const WEBP_URL = `${DOWNLOAD}/archipelia-thumbnail.webp`;
const TEXT_URL = `${DOWNLOAD}/archipelia-description.md`;
const DESCRIPTION = '# Timespinner\n\nA world with its own words, see [the guide](docs/guide.md).\n';
const social = () => new Response(Buffer.alloc(64, 7), { status: 200, headers: { 'content-type': 'image/png' } });

type Route = () => Response;

const served = (routes: Record<string, Route>) => {
  const seen: string[] = [];
  const net: typeof fetch = (input) => {
    seen.push(String(input));
    const route = routes[String(input)];
    return Promise.resolve(route ? route() : new Response('', { status: 404 }));
  };
  return { net, seen };
};

const enricherOf = (net: typeof fetch, listed: boolean, version: () => string | undefined = () => undefined) =>
  createEnricher({
    cache: cacheFiles(),
    engineDir: () => Promise.resolve('engine'),
    fetch: net,
    entryOf: () => {
      const releaseVersion = version();
      const release = listed ? { release: { owner: 'someone', repo: 'ts-world' }, ...(releaseVersion ? { releaseVersion } : {}) } : {};
      return Promise.resolve({ game: 'Timespinner', home: `https://github.com/${REPO}`, ...release });
    },
  });

const asked = (routes: Record<string, Route>, source: 'first-party' | 'index' = 'first-party') => {
  const { net, seen } = served({ [README_URL]: () => textResponse('# Readme\n\nThe README text of the repository.'), [SOCIAL_URL]: social, ...routes });
  return { seen, found: enricherOf(net, source === 'first-party').enrich({ apworld: 'ts_world', source }) };
};

const bytesOf = (bytes: Uint8Array, headers: Record<string, string> = {}) => new Response(Buffer.from(bytes), { status: 200, headers });

describe('the standard files of a listed world', () => {
  test('the thumbnail is the card art and the description replaces the README', async () => {
    const png = pngBytes(1280, 640);
    const { seen, found } = asked({ [PNG_URL]: () => bytesOf(png), [TEXT_URL]: () => textResponse(DESCRIPTION) });
    const result = await found;
    expect(result?.art).toBe(`data:image/png;base64,${png.toString('base64')}`);
    expect(result?.markdown).toContain('A world with its own words');
    expect(result?.markdown).toContain('https://github.com/someone/ts-world/blob/HEAD/docs/guide.md');
    expect(seen).not.toContain(README_URL);
    expect(seen).not.toContain(SOCIAL_URL);
  });

  test('a WebP thumbnail is found by its second name', async () => {
    const webp = webpBytes('VP8L', 1024, 512);
    const result = await asked({ [WEBP_URL]: () => bytesOf(webp) }).found;
    expect(result?.art?.startsWith('data:image/webp;base64,')).toBe(true);
    expect(result?.markdown).toContain('README text');
  });

  test('the type comes from the bytes, not from the content type', async () => {
    const png = pngBytes(640, 320);
    const result = await asked({ [PNG_URL]: () => bytesOf(png, { 'content-type': 'application/octet-stream' }) }).found;
    expect(result?.art?.startsWith('data:image/png;base64,')).toBe(true);
  });

  test('a thumbnail that fails a check falls back to the repository image', async () => {
    const refused: Route[] = [
      () => new Response(Buffer.alloc(32, 1), { status: 200 }),
      () => bytesOf(pngBytes(4000, 600)),
      () => bytesOf(pngBytes(800, 3000)),
      () => bytesOf(pngBytes(0, 0)),
      () => bytesOf(pngBytes(800, 400, true)),
      () => bytesOf(webpBytes('VP8X', 800, 400, true)),
      () => new Response(Buffer.alloc(8), { status: 200, headers: { 'content-length': String(2 * 1024 * 1024) } }),
    ];
    for (const response of refused) {
      const result = await asked({ [PNG_URL]: response }).found;
      expect(result?.art).toBe(`data:image/png;base64,${Buffer.alloc(64, 7).toString('base64')}`);
    }
  });

  test('a file served from a host that is not GitHub is refused', async () => {
    const stray = bytesOf(pngBytes(640, 320));
    Object.defineProperty(stray, 'url', { value: 'https://evil.example/archipelia-thumbnail.png' });
    const result = await asked({ [PNG_URL]: () => stray }).found;
    expect(result?.art).toBe(`data:image/png;base64,${Buffer.alloc(64, 7).toString('base64')}`);
  });

  test('a description that is not UTF-8 or is over 64 KB falls back to the README', async () => {
    const latin: Route = () => new Response(Buffer.from([0x23, 0x20, 0xe9, 0xe9, 0xe9, 0xe9, 0xe9, 0x0a]), { status: 200 });
    const huge: Route = () => textResponse(`# Big

${'word '.repeat(20_000)}`);
    for (const response of [latin, huge]) {
      const result = await asked({ [TEXT_URL]: response }).found;
      expect(result?.markdown).toContain('README text');
    }
  });

  test('a world that is not listed never reads the release files', async () => {
    const { seen, found } = asked({ [PNG_URL]: () => bytesOf(pngBytes(640, 320)), [TEXT_URL]: () => textResponse(DESCRIPTION) }, 'index');
    const result = await found;
    expect(seen.some((url) => url.includes('/releases/'))).toBe(false);
    expect(result?.markdown).toContain('README text');
  });
});

describe('the cache of a listed world', () => {
  test('a new release refreshes the art at once, the same release keeps the cache', async () => {
    let png = pngBytes(640, 320);
    let version = '1.0.0';
    const { net } = served({ [PNG_URL]: () => bytesOf(png), [TEXT_URL]: () => textResponse(DESCRIPTION) });
    const enricher = enricherOf(net, true, () => version);
    const first = await enricher.enrich({ apworld: 'ts_world', source: 'first-party' });
    png = pngBytes(800, 400);
    expect((await enricher.enrich({ apworld: 'ts_world', source: 'first-party' }))?.art).toBe(first?.art);
    version = '1.1.0';
    expect((await enricher.enrich({ apworld: 'ts_world', source: 'first-party' }))?.art).toBe(`data:image/png;base64,${png.toString('base64')}`);
  });
});

describe('sniffImage', () => {
  test('reads the size of a PNG and of the three WebP kinds from the header', () => {
    expect(sniffImage(pngBytes(300, 200))).toEqual({ type: 'image/png', width: 300, height: 200, animated: false });
    expect(sniffImage(webpBytes('VP8X', 300, 200))).toEqual({ type: 'image/webp', width: 300, height: 200, animated: false });
    expect(sniffImage(webpBytes('VP8L', 300, 200))).toEqual({ type: 'image/webp', width: 300, height: 200, animated: false });
  });

  test('refuses anything that is not a PNG or a WebP', () => {
    expect(sniffImage(Buffer.from('GIF89a'.padEnd(40, ' ')))).toBeUndefined();
    expect(sniffImage(Buffer.alloc(40))).toBeUndefined();
    expect(sniffImage(new Uint8Array(3))).toBeUndefined();
  });
});
