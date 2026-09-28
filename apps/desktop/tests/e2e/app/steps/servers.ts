/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launch-app';
import { settledProof } from '../support/settled-proof';
import { closeLayer, openScreen } from '../support/locators';

const SERVER = { label: 'E2E box', host: '192.0.2.10', user: 'ap', keyPath: 'C:\\keys\\e2e_ed25519', apPath: '/opt/archipelago' };

const PROBLEMS = [
  'Give the server a label.',
  'Enter the host name or address.',
  'Enter the user name.',
  'The Archipelago path must be absolute.',
  'Enter the path of the key file.',
];

const text = (servers: Locator, label: string) => servers.getByRole('textbox', { name: label, exact: true });

const showProblems = async (launched: LaunchedApp, servers: Locator) => {
  await servers.getByRole('button', { name: 'Add', exact: true }).click();
  await servers.getByRole('heading', { name: 'New server', level: 2 }).waitFor();
  await text(servers, 'Label').fill('');
  await text(servers, 'Archipelago path on the host').fill('opt/archipelago');
  for (const problem of PROBLEMS) await servers.getByText(problem, { exact: true }).waitFor();
  expect(await servers.getByRole('button', { name: 'Save' }).isDisabled()).toBe(true);
  await settledProof(launched, '31-servers-validation');
};

const fillServer = async (launched: LaunchedApp, servers: Locator) => {
  await text(servers, 'Label').fill(SERVER.label);
  await text(servers, 'Host').fill(SERVER.host);
  await text(servers, 'User name').fill(SERVER.user);
  await text(servers, 'Key file').fill(SERVER.keyPath);
  await text(servers, 'Archipelago path on the host').fill(SERVER.apPath);
  for (const problem of PROBLEMS) expect(await servers.getByText(problem, { exact: true }).count()).toBe(0);
  expect(await text(servers, 'Key file').inputValue()).toBe(SERVER.keyPath);
  await settledProof(launched, '32-servers-filled');
};

const saveAndRemove = async (launched: LaunchedApp, servers: Locator) => {
  await servers.getByRole('button', { name: 'Save' }).click();
  const entry = servers.getByRole('button', { name: `${SERVER.label} ${SERVER.host} · SSH key` });
  await entry.waitFor();
  await servers.getByText('Servers · 1').waitFor();
  await settledProof(launched, '33-servers-saved');
  await servers.getByRole('button', { name: 'Remove' }).click();
  await entry.waitFor({ state: 'detached' });
  await servers.getByText('Servers · 0').waitFor();
  await settledProof(launched, '34-servers-removed');
};

const manageServer = async (launched: LaunchedApp) => {
  const servers = await openScreen(launched.page, 'Servers');
  await servers.getByText('Servers · 0').waitFor();
  await showProblems(launched, servers);
  await fillServer(launched, servers);
  await saveAndRemove(launched, servers);
  await closeLayer(launched.page, 'Servers');
};

export { manageServer };
