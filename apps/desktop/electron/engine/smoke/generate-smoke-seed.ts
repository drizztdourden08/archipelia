/* @layer electron-main @kind logic */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { generate } from '@archipelia/engine';
import { ENGINE_TEXT } from '../engine-text.constants';
import { SMOKE_PLAYER, SMOKE_SEED } from './smoke.constants';
import { smokePlayer } from './smoke-player';
import type { SeedRequest, SeedResult } from './smoke.type';

const generateSmokeSeed = async ({ runtime, dir, game, signal, log }: SeedRequest): Promise<SeedResult> => {
  const playersDir = join(dir, 'players');
  const outDir = join(dir, 'output');
  await rm(dir, { recursive: true, force: true });
  await mkdir(playersDir, { recursive: true });
  await mkdir(outDir, { recursive: true });
  await writeFile(join(playersDir, `${SMOKE_PLAYER}.yaml`), smokePlayer(game), 'utf8');
  const seen = { stage: false };
  const result = await generate({
    runtime, playersDir, outDir, spoiler: 1, race: false, skipBalancing: false, seed: SMOKE_SEED, signal,
    onLine: log, onProgress: () => { seen.stage = true; },
  });
  signal.throwIfAborted();
  const zip = result.zip ?? (await readdir(outDir)).find((name) => name.endsWith('.zip'));
  if (!zip) throw new Error(`Generate made no seed: ${result.lines.slice(-5).join(' | ')}`);
  return { seedFile: join(outDir, basename(zip)), warnings: seen.stage && result.zip ? [] : [ENGINE_TEXT.coarse] };
};

export { generateSmokeSeed };
