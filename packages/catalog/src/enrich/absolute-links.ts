/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { absoluteLink } from './absolute-link';
import { FENCE_LINE, INLINE_LINK, REFERENCE_LINK } from './enrich.constants';

const lineLinks = (line: string, repo: GithubRepo): string => {
  const swap = (_whole: string, open: string, target: string) => `${open}${absoluteLink(target, repo)}`;
  return line.replace(INLINE_LINK, swap).replace(REFERENCE_LINK, swap);
};

const absoluteLinks = (markdown: string, repo: GithubRepo): string => {
  let fenced = false;
  return markdown
    .split('\n')
    .map((line) => {
      const fence = FENCE_LINE.test(line);
      if (fence) fenced = !fenced;
      return fence || fenced ? line : lineLinks(line, repo);
    })
    .join('\n');
};

export { absoluteLinks };
