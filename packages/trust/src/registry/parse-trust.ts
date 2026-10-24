/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import { isTextList } from './is-text-list';
import { REF_PATTERN, REPO_PATTERN, WORKFLOW_PATTERN } from './parse-trust.constants';
import type { Parsed } from './parsed.type';
import type { ClientTrust } from './registry.type';

const isRefList = (value: unknown): value is string[] =>
  isTextList(value) && value.length > 0 && value.every((ref) => REF_PATTERN.test(ref));

const parseTrust = (value: unknown): Parsed<ClientTrust> => {
  if (!isRecord(value)) return { problem: 'trust is not an object' };
  if (value.method !== 'github-attestation') return { problem: `trust method ${String(value.method)} is not supported` };
  const { repo, workflow, refs, issuer } = value;
  if (!isText(repo) || !REPO_PATTERN.test(repo)) return { problem: 'trust repo is not owner/name' };
  if (!isText(workflow) || !WORKFLOW_PATTERN.test(workflow)) return { problem: 'trust workflow is not a workflow file path' };
  if (!isRefList(refs)) return { problem: 'trust refs is not a list of refs/heads or refs/tags names' };
  if (!isText(issuer)) return { problem: 'trust issuer is missing' };
  return { value: { method: 'github-attestation', repo, workflow, refs, issuer } };
};

export { parseTrust };
