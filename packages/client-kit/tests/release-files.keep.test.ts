/* @layer tests @kind test */
import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { checkDescription, inspectThumbnail, parseReleaseManifest } from '../src';
import { buildApworldSet, writeReleaseFiles } from '../src/node';
import { ascii, pngBytes, webpExtended, webpLossless, webpLossy } from './helpers/image-bytes';
import { ROTP_DATA, ROTP_GAME, ROTP_MODULE, ROTP_WORLD_FILES } from './helpers/rotp-world.constants';
import { cleanTempDirs, makeTempDir } from './helpers/temp-dirs';
import { writeFiles } from './helpers/write-files';

afterEach(cleanTempDirs);

const messages = (issues: readonly { message: string }[]): string => issues.map((issue) => issue.message).join('\n');

describe('the thumbnail check', () => {
  test.each([
    ['png', pngBytes(512, 512), 512],
    ['png at the limit', pngBytes(1024, 1024), 1024],
    ['lossy webp', webpLossy(640, 640), 640],
    ['lossless webp', webpLossless(300, 300), 300],
    ['extended webp', webpExtended(1024, 1024), 1024],
    ['a large lossless webp side', webpLossless(16383, 16383), 16383],
  ])('reads the size of a %s', (name, bytes, side) => {
    const { header } = inspectThumbnail(bytes);
    expect(header).toMatchObject({ width: side, height: side, animated: false });
    expect(header?.format).toBe(name.includes('webp') ? 'webp' : 'png');
  });

  test('accepts a square image up to 1024 by 1024', () => {
    for (const bytes of [pngBytes(256, 256), pngBytes(1024, 1024), webpLossy(1024, 1024), webpExtended(64, 64)]) {
      expect(inspectThumbnail(bytes).issues).toEqual([]);
    }
  });

  test.each([
    [pngBytes(1280, 640), 'must be square, not 1280 by 640'],
    [webpLossy(800, 600), 'must be square, not 800 by 600'],
    [pngBytes(1025, 1025), 'at most 1024 by 1024'],
    [webpExtended(2048, 2048), 'at most 1024 by 1024'],
    [pngBytes(0, 0), 'no pixels'],
    [webpExtended(512, 512, true), 'animated'],
  ])('refuses an image that breaks the size rules %#', (bytes, part) => {
    expect(messages(inspectThumbnail(bytes).issues)).toContain(part);
  });

  test('refuses an image over 1 MB, and counts the limit in bytes', () => {
    const atLimit = new Uint8Array(1024 * 1024);
    atLimit.set(pngBytes(512, 512));
    expect(inspectThumbnail(atLimit).issues).toEqual([]);
    const over = new Uint8Array(1024 * 1024 + 1);
    over.set(pngBytes(512, 512));
    expect(messages(inspectThumbnail(over).issues)).toContain('over the 1048576 byte limit');
  });

  test('checks the magic bytes, not a file name or a type', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, ...new Array<number>(60).fill(0)]);
    const gif = new Uint8Array([...ascii('GIF89a'), ...new Array<number>(60).fill(0)]);
    const brokenPng = pngBytes(512, 512);
    brokenPng.set(ascii('IHDX'), 12);
    const brokenWebp = webpLossy(512, 512);
    brokenWebp.set(ascii('WEBX'), 8);
    const noStartCode = webpLossy(512, 512);
    noStartCode[24] = 0;
    for (const bytes of [jpeg, gif, brokenPng, brokenWebp, noStartCode, new Uint8Array(0), pngBytes(512, 512).slice(0, 20), webpLossy(8, 8).slice(0, 29)]) {
      const check = inspectThumbnail(bytes);
      expect(check.header).toBeUndefined();
      expect(messages(check.issues)).toContain('not a PNG or a WebP image');
    }
  });
});

describe('the description check', () => {
  const encode = (text: string): Uint8Array => new TextEncoder().encode(text);

  test('accepts Markdown, links and autolinks without a warning', () => {
    const text = '# Relic\n\nA **world** with [a link](https://example.com) and <https://example.com/x>.\n\n- 1 < 2 and 3 > 2\n\n```\nlet a = b<c>d;\n```\n';
    expect(checkDescription(encode(text))).toEqual({ issues: [], warnings: [] });
    expect(checkDescription(encode('Café ü 日本語'))).toEqual({ issues: [], warnings: [] });
  });

  test.each([
    ['<div class="x">hi</div>'],
    ['text <img src="a.png"> text'],
    ['<br/>'],
    ['<!-- hidden -->'],
    ['<script>alert(1)</script>'],
  ])('flags raw HTML as a warning, not an error: %s', (text) => {
    const check = checkDescription(encode(text));
    expect(check.issues).toEqual([]);
    expect(messages(check.warnings)).toContain('raw HTML');
  });

  test('the size limit is 64 KB in bytes', () => {
    expect(checkDescription(encode('a'.repeat(64 * 1024))).issues).toEqual([]);
    expect(messages(checkDescription(encode('a'.repeat(64 * 1024 + 1))).issues)).toContain('over the 65536 byte limit');
    expect(messages(checkDescription(encode('é'.repeat(33 * 1024))).issues)).toContain('65536 byte limit');
  });

  test('refuses text that is not UTF-8', () => {
    expect(messages(checkDescription(new Uint8Array([0x68, 0xff, 0xfe, 0x69])).issues)).toContain('not valid UTF-8');
    expect(messages(checkDescription(new Uint8Array([0xc3, 0x28])).issues)).toContain('not valid UTF-8');
  });
});

const release = async (): Promise<{ root: string; outDir: string }> => {
  const root = await makeTempDir();
  await writeFiles(join(root, ROTP_MODULE), ROTP_WORLD_FILES);
  const outDir = join(root, 'out');
  await buildApworldSet({
    game: ROTP_GAME,
    worldVersion: '0.1.0',
    appVersion: '0.22.0',
    minimumAp: '0.6.4',
    worldDir: join(root, ROTP_MODULE),
    outDir,
    data: ROTP_DATA as never,
    builds: [{ archipelagoVersion: '0.6.7' }, { archipelagoVersion: '0.6.8' }],
  });
  return { root, outDir };
};

const exists = async (path: string): Promise<boolean> => access(path).then(() => true, () => false);

describe('writing the release files', () => {
  test('writes archipelia.json, the thumbnail named by its real format, and the description', async () => {
    const { root, outDir } = await release();
    await writeFile(join(root, 'art.bin'), webpLossy(512, 512));
    await writeFile(join(root, 'about.txt'), '# About\n');
    const result = await writeReleaseFiles({ dir: outDir, direct: true, thumbnail: join(root, 'art.bin'), description: join(root, 'about.txt') });
    expect(result.thumbnailPath).toBe(join(outDir, 'archipelia-thumbnail.webp'));
    expect(result.descriptionPath).toBe(join(outDir, 'archipelia-description.md'));
    expect(await readFile(join(outDir, 'archipelia-description.md'), 'utf8')).toBe('# About\n');
    expect(new Uint8Array(await readFile(join(outDir, 'archipelia-thumbnail.webp')))).toEqual(webpLossy(512, 512));
    const manifest = parseReleaseManifest(await readFile(join(outDir, 'archipelia.json'), 'utf8'));
    expect(manifest).toEqual(result.manifest);
    expect(manifest).toMatchObject({ direct: true, appVersion: '0.22.0', module: ROTP_MODULE });
    expect(manifest.builds?.map((build) => build.archipelagoVersion)).toEqual(['0.6.7', '0.6.8']);
    expect(await exists(join(outDir, 'relic_of_the_past.apworld.json'))).toBe(true);
  });

  test('writes only the manifest when no image or text is given, and a new format replaces the old thumbnail', async () => {
    const { root, outDir } = await release();
    const bare = await writeReleaseFiles({ dir: outDir, direct: false });
    expect(bare.thumbnailPath).toBeUndefined();
    expect(bare.manifest.direct).toBe(false);
    await writeFile(join(root, 'a.png'), pngBytes(256, 256));
    await writeFile(join(root, 'b.webp'), webpLossless(256, 256));
    await writeReleaseFiles({ dir: outDir, direct: false, thumbnail: join(root, 'a.png') });
    await writeReleaseFiles({ dir: outDir, direct: false, thumbnail: join(root, 'b.webp') });
    expect(await exists(join(outDir, 'archipelia-thumbnail.png'))).toBe(false);
    expect(await exists(join(outDir, 'archipelia-thumbnail.webp'))).toBe(true);
  });

  test('returns the HTML warning and still writes the description', async () => {
    const { root, outDir } = await release();
    await writeFile(join(root, 'about.md'), '<b>bold</b>');
    const result = await writeReleaseFiles({ dir: outDir, direct: false, description: join(root, 'about.md') });
    expect(messages(result.warnings)).toContain('raw HTML');
    expect(await exists(join(outDir, 'archipelia-description.md'))).toBe(true);
  });

  test('writes nothing when an image or the text is refused', async () => {
    const { root, outDir } = await release();
    await writeFile(join(root, 'wide.png'), pngBytes(1280, 640));
    await writeFile(join(root, 'bad.md'), new Uint8Array([0xff, 0xfe]));
    await expect(writeReleaseFiles({ dir: outDir, direct: true, thumbnail: join(root, 'wide.png'), description: join(root, 'bad.md') })).rejects.toThrow(/must be square[\s\S]*not valid UTF-8/);
    for (const name of ['archipelia.json', 'archipelia-thumbnail.png', 'archipelia-description.md']) expect(await exists(join(outDir, name))).toBe(false);
  });

  test('needs one index in the folder, or the module name', async () => {
    const empty = await makeTempDir();
    await expect(writeReleaseFiles({ dir: empty, direct: true })).rejects.toThrow('found 0');
    await expect(writeReleaseFiles({ dir: empty, direct: true, module: 'missing' })).rejects.toThrow();
    const { outDir } = await release();
    const named = await writeReleaseFiles({ dir: outDir, direct: true, module: ROTP_MODULE });
    expect(named.manifest.module).toBe(ROTP_MODULE);
  });
});
