/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { LaunchedApp } from '../../app/support/launched-app.type';

const runConsoleCommand = async (launched: LaunchedApp, text: string) => {
  const consoleWidget = launched.page.locator('[data-widget-id="console"]');
  const command = consoleWidget.getByRole('combobox', { name: 'Server command', exact: true });
  await command.fill(text);
  await command.press('Enter');
  await expect.poll(() => command.inputValue(), { message: `the Console sent ${text}` }).toBe('');
};

export { runConsoleCommand };
