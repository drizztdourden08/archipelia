/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { CHECKSUM_MAX_BYTES, RUSTUP_HOSTS, RUSTUP_MAX_BYTES, SHA256_PATTERN } from './tool.constants';
import type { ToolDeps, ToolHost } from './tool.type';
import { downloadInstaller } from './download-installer';
import type { Installer } from './installer.type';
import { rustupUrlOf } from './rustup-url-of';
import { TOOL_TEXT } from './tool-text.constants';
import { writeInstaller } from './write-installer';

const publishedSum = async (deps: ToolDeps, url: string): Promise<string | undefined> =>
  SHA256_PATTERN.exec(new TextDecoder().decode(await downloadInstaller(deps.fetch, { url: `${url}.sha256`, hosts: RUSTUP_HOSTS, maxBytes: CHECKSUM_MAX_BYTES })))?.[0]?.toLowerCase();

const prepareRustup = async (deps: ToolDeps, host: ToolHost): Promise<Installer> => {
  const url = rustupUrlOf(host);
  if (url === undefined) throw new Error(TOOL_TEXT.host);
  const bytes = await downloadInstaller(deps.fetch, { url, hosts: RUSTUP_HOSTS, maxBytes: RUSTUP_MAX_BYTES });
  const sum = createHash('sha256').update(bytes).digest('hex');
  if (sum !== (await publishedSum(deps, url))) throw new Error(TOOL_TEXT.checksum);
  const file = await writeInstaller(host.toolsDir, host.platform === 'win32' ? 'rustup-init.exe' : 'rustup-init', bytes);
  deps.log?.(`tool: downloaded ${url}, ${bytes.length} bytes, sha256 ${sum}, matches the published checksum`);
  return { file, sha256: sum };
};

export { prepareRustup };
