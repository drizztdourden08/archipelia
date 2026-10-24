/* @layer client-kit @kind logic */
import type { KitError, KitErrorCode } from './kit-error.type';
import type { KitIssue } from './kit-issue.type';
import { createKitError } from './create-kit-error';

const createIssuesError = (code: KitErrorCode, headline: string, issues: readonly KitIssue[]): KitError => {
  const lines = issues.map((issue) => `- ${issue.message}`);
  return createKitError(code, [headline, ...lines].join('\n'), issues);
};

export { createIssuesError };
