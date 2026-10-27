/* @layer core @kind logic */
import { POWERSHELL_FLAGS, WINGET_SCRIPT } from './tool.constants';
import type { Probe, ToolEnv } from './tool.type';
import { powershellPathOf } from './powershell-path-of';
import { signatureTrusted } from './signature-trusted';

const verifyWinget = async (probe: Probe, env: ToolEnv): Promise<boolean> => {
  const shell = powershellPathOf(env);
  if (shell === undefined) return false;
  const result = await probe(shell, [...POWERSHELL_FLAGS, WINGET_SCRIPT]);
  return result.ok && signatureTrusted(result.out);
};

export { verifyWinget };
