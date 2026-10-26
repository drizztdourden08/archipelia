/* @layer core @kind logic */
import type { ArchiveSite } from './build.type';

const archiveUrl = ({ owner, repo, sha }: ArchiveSite): string => `https://codeload.github.com/${owner}/${repo}/zip/${sha}`;

export { archiveUrl };
