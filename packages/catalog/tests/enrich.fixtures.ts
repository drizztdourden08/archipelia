/* @layer tests @kind test */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import type { DataFiles } from '@archipelia/model';

const cacheFiles = (): DataFiles & { store: Map<string, string> } => {
  const store = new Map<string, string>();
  const unused = () => Promise.reject(new Error('not used by this test'));
  return {
    store,
    path: (rel = '') => rel,
    exists: (rel) => Promise.resolve(store.has(rel)),
    readJson: <T,>(rel: string, fallback: T) => Promise.resolve(store.has(rel) ? (JSON.parse(store.get(rel) ?? 'null') as T) : fallback),
    writeJson: (rel, value) => { store.set(rel, JSON.stringify(value)); return Promise.resolve(); },
    readText: (rel) => Promise.resolve(store.get(rel) ?? null),
    writeText: (rel, text) => { store.set(rel, text); return Promise.resolve(); },
    readBytes: unused,
    writeBytes: unused,
    list: unused,
    remove: (rel) => { store.delete(rel); return Promise.resolve(); },
  };
};

const ALTTP_DOC = `# A Link to the Past

## Where is the options page?

The [player options page for this game](../player-options) contains all the options you need to configure and export a
config file.

## What does randomization do to this game?

Items which the player would normally acquire throughout the game have been moved around. Logic remains, so the game is
always able to be completed, but because of the item shuffle the player may need to access certain areas first.

## What items and locations get shuffled?

All main inventory items can be shuffled.
`;

const engineFolder = async (dir: string, worlds: Record<string, { game: string; docs: Record<string, string> }>, layout: 'zip' | 'folder' = 'zip') => {
  await mkdir(join(dir, 'official'), { recursive: true });
  await mkdir(join(dir, 'ap', 'worlds'), { recursive: true });
  const meta = { id: 'test', apVersion: '0.6.7', apCommit: 'x', pythonVersion: '3', root: '.', python: 'p', generate: 'g', multiServer: 'm', schemaScript: 's', official: 'official' };
  await writeFile(join(dir, 'engine.json'), JSON.stringify(meta));
  const index = Object.entries(worlds).map(([apworld, { game }]) => ({
    apworld, game, file: `${apworld}.apworld`, sha256: '', layout: 'apworld', requires: [], optional: [],
  }));
  await writeFile(join(dir, 'official', 'index.json'), JSON.stringify(index));
  for (const [apworld, { docs }] of Object.entries(worlds)) {
    if (layout === 'folder') {
      await mkdir(join(dir, 'ap', 'worlds', apworld, 'docs'), { recursive: true });
      for (const [name, text] of Object.entries(docs)) await writeFile(join(dir, 'ap', 'worlds', apworld, 'docs', name), text);
    } else {
      const entries: Record<string, Uint8Array> = { [`${apworld}/__init__.py`]: strToU8('') };
      for (const [name, text] of Object.entries(docs)) entries[`${apworld}/docs/${name}`] = strToU8(text);
      await writeFile(join(dir, 'official', `${apworld}.apworld`), zipSync(entries));
    }
  }
};

const textResponse = (body: string, headers: Record<string, string> = {}) => new Response(body, { status: 200, headers });

const imageResponse = (size = 64, type = 'image/png') => new Response(Buffer.alloc(size, 7), { status: 200, headers: { 'content-type': type } });

export { ALTTP_DOC, cacheFiles, engineFolder, imageResponse, textResponse };
