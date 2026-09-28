/* @layer tests @kind helper */
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { ElectronApplication } from 'playwright-core';

const answerSaveDialogWith = async (app: ElectronApplication, filePath: string) => {
  await mkdir(dirname(filePath), { recursive: true });
  await app.evaluate(({ dialog }, target) => {
    dialog.showSaveDialog = () => Promise.resolve({ canceled: false, filePath: target });
    dialog.showOpenDialog = () => Promise.resolve({ canceled: true, filePaths: [] });
  }, filePath);
};

export { answerSaveDialogWith };
