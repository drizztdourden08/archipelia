/* @layer tests @kind helper */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { LaunchedApp } from './launched-app.type';

const proof = async ({ page, proofDir }: LaunchedApp, name: string) => {
  const file = join(proofDir, `${name}.png`);
  await writeFile(file, await page.screenshot());
  return file;
};

export { proof };
