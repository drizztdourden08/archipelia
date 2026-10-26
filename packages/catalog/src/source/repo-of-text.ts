/* @layer core @kind logic */
import type { GithubRepo } from '../enrich/enrich.type';
import { parseGithubHome } from '../enrich/parse-github-home';
import { SHORT_REPO } from './source.constants';

const repoOfText = (text: string): GithubRepo | undefined => {
  const typed = text.trim().replace(/\/+$/, '');
  const short = SHORT_REPO.exec(typed);
  if (short?.[1] && short[2]) return parseGithubHome(`https://github.com/${short[1]}/${short[2]}`);
  return parseGithubHome(/^[a-z][a-z0-9+.-]*:/i.test(typed) ? typed : `https://${typed}`);
};

export { repoOfText };
