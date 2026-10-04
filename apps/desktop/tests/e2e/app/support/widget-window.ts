/* @layer tests @kind helper */
import type { ElectronApplication, Page } from 'playwright-core';

const WINDOW_TIMEOUT_MS = 20000;
const POLL_MS = 100;

const widgetWindow = async (app: ElectronApplication, id: string, until = Date.now() + WINDOW_TIMEOUT_MS): Promise<Page> => {
  const found = app.windows().find((win) => new URL(win.url()).searchParams.get('widget') === id);
  if (found) return found;
  if (Date.now() > until) throw new Error(`the "${id}" widget window never opened`);
  await new Promise((resolve) => { setTimeout(resolve, POLL_MS); });
  return widgetWindow(app, id, until);
};

export { widgetWindow };
