/* @layer core @kind logic */
import { win32 } from 'node:path';
import { DRIVE_PATH, POWERSHELL_PATH, SIGNATURE_ARGS, SIGNATURE_VAR } from './tool.constants';
import type { Probe, ToolHost } from './tool.type';

const verifySignature = async (probe: Probe, host: ToolHost, file: string): Promise<boolean> => {
  const root = host.env.SystemRoot ?? host.env.windir;
  if (root === undefined || !DRIVE_PATH.test(root)) return false;
  const result = await probe(win32.join(root, ...POWERSHELL_PATH), [...SIGNATURE_ARGS], { [SIGNATURE_VAR]: file });
  return result.ok && result.out.trim() === 'valid';
};

export { verifySignature };
