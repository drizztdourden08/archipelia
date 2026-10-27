/* @layer core @kind logic */
import { FILE_SCRIPT, POWERSHELL_FLAGS, SIGNATURE_VAR } from './tool.constants';
import type { Probe, ToolEnv } from './tool.type';
import { powershellPathOf } from './powershell-path-of';
import { signatureTrusted } from './signature-trusted';

const verifySignature = async (probe: Probe, env: ToolEnv, file: string): Promise<boolean> => {
  const shell = powershellPathOf(env);
  if (shell === undefined) return false;
  const result = await probe(shell, [...POWERSHELL_FLAGS, FILE_SCRIPT], { [SIGNATURE_VAR]: file });
  return result.ok && signatureTrusted(result.out);
};

export { verifySignature };
