/* @layer tests @kind helper */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from './launch-app';

const proofText = async ({ proofDir }: LaunchedApp, name: string, found: Locator) => {
  const lines = (await found.allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim());
  await writeFile(join(proofDir, `${name}.txt`), `${lines.join('\n')}\n`);
  return lines;
};

export { proofText };
