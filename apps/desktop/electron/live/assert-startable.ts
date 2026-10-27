/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { setupProblems } from '../../src/views/SessionBuilder/behavior/setup-problems';
import { LIVE_TEXT } from './live.constants';

const assertStartable = (template: SessionTemplate): void => {
  const [first] = setupProblems(template);
  if (first) throw new Error(LIVE_TEXT.problems(first));
};

export { assertStartable };
