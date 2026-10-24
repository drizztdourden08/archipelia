/* @layer core @kind logic */
import type { ServerTest } from '@archipelia/model';
import { AP_VERSION_DETAIL } from './ap-version-detail.constants';

const apVersionOfTest = (test: ServerTest | undefined): string | undefined => {
  const check = test?.checks?.find((candidate) => candidate.name === 'ap-version');
  return check ? AP_VERSION_DETAIL.exec(check.detail)?.[1] : undefined;
};

export { apVersionOfTest };
