/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { DescriptionCheck } from './release-files.type';
import { badValue } from '../index-manifest/bad-value';
import { CODE_SPANS, HTML_TAG, MAX_DESCRIPTION_BYTES } from './release-files.constants';

const problem = (message: string): KitIssue => badValue('description', message);

const decode = (bytes: Uint8Array): string | undefined => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
};

const checkDescription = (bytes: Uint8Array): DescriptionCheck => {
  const issues: KitIssue[] = [];
  const warnings: KitIssue[] = [];
  if (bytes.length > MAX_DESCRIPTION_BYTES) issues.push(problem(`the description is ${bytes.length} bytes, over the ${MAX_DESCRIPTION_BYTES} byte limit.`));
  const text = decode(bytes);
  if (text === undefined) issues.push(problem('the description is not valid UTF-8 text.'));
  else if (HTML_TAG.test(text.replace(CODE_SPANS, ''))) warnings.push(problem('the description holds raw HTML. Archipelia drops it when it shows the text, so use Markdown instead.'));
  return { issues, warnings };
};

export { checkDescription };
