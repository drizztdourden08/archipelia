/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createEnricher } from '../src/enrich/create-enricher';
import { pickDocName } from '../src/enrich/pick-doc-name';
import { readWorldDocs } from '../src/enrich/read-world-docs';
import { ALTTP_DOC, cacheFiles, engineFolder } from './enrich.fixtures';

let dir = '';

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-enrich-engine-'));
});

afterEach(() => rm(dir, { recursive: true, force: true }));

const DOCS = { 'en_A Link to the Past.md': ALTTP_DOC, 'setup_en.md': '# Setup\n\nInstall the thing.', 'fr_A Link to the Past.md': '# Fr' };

describe('pickDocName', () => {
  test('takes the English page of the game and never a setup guide', () => {
    expect(pickDocName(['setup_en.md', 'en_Other.md', 'en_A Link to the Past.md'], 'A Link to the Past')).toBe('en_A Link to the Past.md');
    expect(pickDocName(['setup_en.md', 'fr_Game.md'], 'Game')).toBeUndefined();
    expect(pickDocName(['en_Renamed.md'], 'Game')).toBe('en_Renamed.md');
  });
});

describe('an official world', () => {
  test('reads its docs out of the official folder with no network', async () => {
    await engineFolder(dir, { alttp: { game: 'A Link to the Past', docs: DOCS } });
    const text = await readWorldDocs({ engineDir: dir, apworld: 'alttp', game: 'A Link to the Past', file: 'alttp.apworld' });
    expect(text).toContain('Where is the options page?');
  });

  test('reads the docs of a world already placed as a folder', async () => {
    await engineFolder(dir, { alttp: { game: 'A Link to the Past', docs: DOCS } }, 'folder');
    expect(await readWorldDocs({ engineDir: dir, apworld: 'alttp', game: 'A Link to the Past' })).toContain('What does randomization do');
  });

  test('the docs are kept as markdown, headings and all', async () => {
    await engineFolder(dir, { alttp: { game: 'A Link to the Past', docs: DOCS } });
    const noNetwork: typeof fetch = () => Promise.reject(new Error('no network for an official world'));
    const enricher = createEnricher({
      cache: cacheFiles(), engineDir: () => Promise.resolve(dir), fetch: noNetwork,
      entryOf: () => Promise.resolve({ game: 'A Link to the Past', file: 'alttp.apworld', home: 'https://github.com/ignored/ignored' }),
    });
    const found = await enricher.enrich({ apworld: 'alttp', source: 'official' });
    expect(found?.origin).toBe('engine');
    expect(found?.markdown).toContain('## What items and locations get shuffled?');
    expect(found?.markdown).toContain('[player options page for this game](../player-options)');
    expect(found?.art).toBeUndefined();
  });

  test('a world with no docs has no description', async () => {
    await engineFolder(dir, { bare: { game: 'Bare', docs: {} } });
    const enricher = createEnricher({
      cache: cacheFiles(), engineDir: () => Promise.resolve(dir), entryOf: () => Promise.resolve({ game: 'Bare', file: 'bare.apworld' }),
    });
    expect(await enricher.enrich({ apworld: 'bare', source: 'official' })).toBeUndefined();
  });
});
