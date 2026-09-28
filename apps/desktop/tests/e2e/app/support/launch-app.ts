/* @layer tests @kind helper */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { _electron as electron } from 'playwright-core';
import type { ElectronApplication, Page } from 'playwright-core';
import { ENGINE_DIR } from '../../support/e2e-inputs';
import { tempDataRoot } from '../../support/temp-file-store';
import { assertLaunchable } from './preflight';

const APP_DIR = join(import.meta.dirname, '../../../..');
const MAIN = join(APP_DIR, 'dist', 'electron', 'main.js');
const HEADLESS = ['--no-focus', '--muted'];

type LaunchedApp = { app: ElectronApplication; page: Page; userData: string; proofDir: string };

const electronBinary = (): string => {
  const resolved: unknown = createRequire(join(APP_DIR, 'package.json'))('electron');
  if (typeof resolved !== 'string') throw new Error('the electron package did not resolve to a binary path');
  return resolved;
};

const launchApp = async (proofDir: string): Promise<LaunchedApp> => {
  await assertLaunchable(MAIN);
  const userData = await tempDataRoot();
  await mkdir(proofDir, { recursive: true });
  const app = await electron.launch({
    executablePath: electronBinary(),
    args: [MAIN, ...HEADLESS, `--user-data=${userData}`],
    env: { ...process.env, ARCHIPELIA_ENGINE_DIR: ENGINE_DIR },
  });
  const output: string[] = [];
  app.process().stdout?.on('data', (chunk: Buffer) => output.push(chunk.toString()));
  app.process().stderr?.on('data', (chunk: Buffer) => output.push(chunk.toString()));
  try {
    const page = await app.firstWindow({ timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    return { app, page, userData, proofDir };
  } catch (err) {
    await app.close();
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${message}\nmain output:\n${output.join('').slice(-4000)}`, { cause: err });
  }
};

const proof = async ({ page, proofDir }: LaunchedApp, name: string) => {
  const file = join(proofDir, `${name}.png`);
  await writeFile(file, await page.screenshot());
  return file;
};

export { launchApp, proof };
export type { LaunchedApp };
