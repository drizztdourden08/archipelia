/* @layer core @kind logic */
import { SIGNER_CA, SIGNER_ORG } from './tool.constants';
import { parseDn } from './parse-dn';

const valuesOf = (lines: string[], key: string): string[] => lines.filter((line) => line.startsWith(`${key}=`)).map((line) => line.slice(key.length + 1));

const signatureTrusted = (out: string): boolean => {
  const lines = out.split(/\r?\n/).map((line) => line.trim());
  const orgs = valuesOf(lines, 'subject').map((dn) => parseDn(dn).O ?? []);
  const issuedByPca = valuesOf(lines, 'chain').some((dn) => (parseDn(dn).CN ?? []).some((name) => SIGNER_CA.test(name)));
  return valuesOf(lines, 'status').join() === 'Valid' && orgs.length === 1 && orgs[0]?.length === 1 && orgs[0][0] === SIGNER_ORG && issuedByPca;
};

export { signatureTrusted };
