/* @layer core @kind logic */
import type { Branch } from './python-range.type';

const branchesFor = (branches: Branch[], platform: string): Branch[] => {
  const own = branches.filter((branch) => branch.platforms?.includes(platform));
  return own.length > 0 ? own : branches.filter((branch) => !branch.platforms);
};

export { branchesFor };
