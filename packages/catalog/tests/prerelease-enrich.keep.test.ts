/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createEnricher } from '../src/enrich/create-enricher';
import { cacheFiles, pngBytes, textResponse } from './enrich.fixtures';

const REPO = 'someone/ts-world';
const TAGGED = `https://github.com/${REPO}/releases/download/v0.21.2`;

describe('the standard files of a world with only a pre-release', () => {
  test('the thumbnail and the description are read from the tag, never from latest', async () => {
    const png = pngBytes(1280, 640);
    const seen: string[] = [];
    const net: typeof fetch = (input) => {
      seen.push(String(input));
      if (String(input) === `${TAGGED}/archipelia-thumbnail.png`) return Promise.resolve(new Response(Buffer.from(png), { status: 200 }));
      if (String(input) === `${TAGGED}/archipelia-description.md`) return Promise.resolve(textResponse('# Timespinner\n\nWords of the pre-release.\n'));
      return Promise.resolve(new Response('', { status: 404 }));
    };
    const found = await createEnricher({
      cache: cacheFiles(),
      engineDir: () => Promise.resolve('engine'),
      fetch: net,
      entryOf: () => Promise.resolve({
        game: 'Timespinner', home: `https://github.com/${REPO}`, release: { owner: 'someone', repo: 'ts-world' }, releaseVersion: '0.21.2', releaseTag: 'v0.21.2',
      }),
    }).enrich({ apworld: 'ts_world', source: 'first-party' });
    expect(found?.art).toBe(`data:image/png;base64,${png.toString('base64')}`);
    expect(found?.markdown).toContain('Words of the pre-release');
    expect(seen.some((url) => url.includes('latest/download'))).toBe(false);
  });
});
