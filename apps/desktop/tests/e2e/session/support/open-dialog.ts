/* @layer tests @kind helper */
import type { ElectronApplication } from 'playwright-core';

const answerOpenDialogWith = async (app: ElectronApplication, filePath: string) => {
  await app.evaluate(({ dialog }, target) => {
    dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths: [target] });
  }, filePath);
};

export { answerOpenDialogWith };
