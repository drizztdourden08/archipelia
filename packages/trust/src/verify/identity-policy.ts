/* @layer core @kind logic */
import type { VerificationPolicy } from '@sigstore/verify';
import type { GithubAttestationTrust } from '../registry/registry.type';
import { derUtf8 } from './der-utf8';
import { escapePattern } from './escape-pattern';
import { GITHUB_HOST, SOURCE_REPOSITORY_OID } from './verify-world.constants';

const identityPolicy = ({ repo, workflow, refs, issuer }: GithubAttestationTrust): VerificationPolicy => {
  const signer = `${escapePattern(`${GITHUB_HOST}/${repo}/${workflow}`)}@(?:${refs.map(escapePattern).join('|')})`;
  return {
    subjectAlternativeName: new RegExp(`^${signer}$`),
    extensions: { issuer },
    oids: [{ oid: { id: SOURCE_REPOSITORY_OID }, value: derUtf8(`${GITHUB_HOST}/${repo}`) }],
  };
};

export { identityPolicy };
