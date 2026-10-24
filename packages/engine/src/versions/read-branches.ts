/* @layer core @kind logic */
import type { Branch } from './python-range.type';
import { branchPlatforms } from './branch-platforms';
import { BRANCH_BODY, BRANCH_START, VERSION_INFO } from './python-range.constants';

const readBranches = (source: string): Branch[] => {
  let branches: Branch[] = [];
  let current: Branch | undefined;
  for (const line of source.split(/\r?\n/)) {
    if (BRANCH_START.test(line)) {
      current = { header: line, body: '', platforms: branchPlatforms(line) };
      branches.push(current);
    } else if (current && BRANCH_BODY.test(line)) {
      current.body += `${line}\n`;
    } else if (current) {
      if (branches.some((branch) => branch.header.includes(VERSION_INFO))) break;
      branches = [];
      current = undefined;
    }
  }
  return branches.filter((branch) => branch.header.includes(VERSION_INFO));
};

export { readBranches };
