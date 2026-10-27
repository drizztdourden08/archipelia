/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import type { Installer } from './installer.type';
import type { Probe, ToolHost } from './tool.type';
import { TOOL_TEXT } from './tool-text.constants';
import { verifySignature } from './verify-signature';

const recheckInstaller = async (probe: Probe, host: ToolHost, { file, sha256 }: Installer, signed: boolean): Promise<void> => {
  const bytes = await readFile(file).catch(() => Buffer.alloc(0));
  if (createHash('sha256').update(bytes).digest('hex') !== sha256) throw new Error(TOOL_TEXT.swapped);
  if (signed && !(await verifySignature(probe, host.env, file))) throw new Error(TOOL_TEXT.unsigned);
};

export { recheckInstaller };
