/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { VS_BOOTSTRAPPER_NAME, VS_BOOTSTRAPPER_URL, VS_HOSTS, VS_MAX_BYTES } from './tool.constants';
import type { ToolDeps, ToolHost } from './tool.type';
import { downloadInstaller } from './download-installer';
import type { Installer } from './installer.type';
import { removeInstaller } from './remove-installer';
import { TOOL_TEXT } from './tool-text.constants';
import { verifySignature } from './verify-signature';
import { writeInstaller } from './write-installer';

const prepareBootstrapper = async (deps: ToolDeps, host: ToolHost): Promise<Installer> => {
  const bytes = await downloadInstaller(deps.fetch, { url: VS_BOOTSTRAPPER_URL, hosts: VS_HOSTS, maxBytes: VS_MAX_BYTES });
  const file = await writeInstaller(host.toolsDir, VS_BOOTSTRAPPER_NAME, bytes);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (!(await verifySignature(deps.probe, host.env, file))) {
    await removeInstaller(file);
    throw new Error(TOOL_TEXT.unsigned);
  }
  deps.log?.(`tool: downloaded the Visual Studio installer, ${bytes.length} bytes, sha256 ${sha256}, signed by Microsoft`);
  return { file, sha256 };
};

export { prepareBootstrapper };
