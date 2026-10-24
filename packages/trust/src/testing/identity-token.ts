/* @layer testing @kind logic */
import { GITHUB_ISSUER } from '../registry/registry.constants';
import type { Identity } from './mint.type';

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

const identityToken = ({ repo, workflow, ref }: Identity) => {
  const signer = `${repo}/${workflow}@${ref}`;
  const claims = { sub: `https://github.com/${signer}`, iss: GITHUB_ISSUER, repository: repo, job_workflow_ref: signer, ref };
  return `${encode({ alg: 'none' })}.${encode(claims)}.unsigned`;
};

export { identityToken };
