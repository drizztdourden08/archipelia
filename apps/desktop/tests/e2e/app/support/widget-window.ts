/* @layer tests @kind helper */
import type { ElectronApplication, Page } from 'playwright-core';
import { widgetWindows } from '@drizztdourden08/brock-build/testing';

const WINDOW_TIMEOUT_MS = 20000;
const POLL_MS = 100;

const waitForShown = async (app: ElectronApplication, id: string, until: number): Promise<void> => {
  const shown = (await widgetWindows(app)).some((win) => win.id === id && win.visible);
  if (shown) return;
  if (Date.now() > until) throw new Error(`the "${id}" widget window never showed`);
  await new Promise((resolve) => { setTimeout(resolve, POLL_MS); });
  await waitForShown(app, id, until);
};

const popOutWidget = async (app: ElectronApplication, id: string, popOut: () => Promise<void>): Promise<Page> => {
  const [popped] = await Promise.all([app.waitForEvent('window', { timeout: WINDOW_TIMEOUT_MS }), popOut()]);
  await waitForShown(app, id, Date.now() + WINDOW_TIMEOUT_MS);
  return popped;
};

export { popOutWidget };
