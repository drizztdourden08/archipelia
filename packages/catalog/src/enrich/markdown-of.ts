/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { absoluteLinks } from './absolute-links';
import { clampDoc } from './clamp-doc';
import { MAX_DOC_CHARS } from './enrich.constants';

const withoutBom = (text: string) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

const markdownOf = (text: string | undefined, repo?: GithubRepo): string | undefined => {
  const clean = clampDoc(withoutBom(text ?? '').replace(/\r\n?/g, '\n').trim(), MAX_DOC_CHARS);
  if (!/[A-Za-z]{3}/.test(clean)) return undefined;
  return repo ? absoluteLinks(clean, repo) : clean;
};

export { markdownOf };
