/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import type { TestStatus } from '../ServerManager.type';

const testStatus = ({ lastTest }: ServerEntry): TestStatus => {
  if (!lastTest) return { tone: 'neutral', text: 'not tested' };
  return lastTest.ok ? { tone: 'success', text: 'tested' } : { tone: 'danger', text: 'failing' };
};

export { testStatus };
