/* @layer core @kind logic */
import { PLATFORM_EQUAL, PLATFORM_LIST, QUOTED } from './python-range.constants';

const branchPlatforms = (header: string): string[] | undefined => {
  const list = PLATFORM_LIST.exec(header)?.[1];
  if (list !== undefined) return [...list.matchAll(QUOTED)].flatMap((match) => (match[1] ? [match[1]] : []));
  const single = PLATFORM_EQUAL.exec(header)?.[1];
  return single ? [single] : undefined;
};

export { branchPlatforms };
