/* @layer tests @kind helper */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { launchAppForTest } from '@drizztdourden08/brock-build/testing';
import { ENGINE_DIR } from '../../support/e2e-inputs';
import type { LaunchedApp } from './launched-app.type';

const APP_DIR = join(import.meta.dirname, '../../../..');

const launchApp = async (proofDir: string): Promise<LaunchedApp> => {
  await mkdir(proofDir, { recursive: true });
  const launched = await launchAppForTest({ appDir: APP_DIR, env: { ARCHIPELIA_ENGINE_DIR: ENGINE_DIR } });
  return { ...launched, proofDir };
};

export { launchApp };
