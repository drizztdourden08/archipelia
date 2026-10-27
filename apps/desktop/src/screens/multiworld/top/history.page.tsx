/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { History } from '../../../views/History';

const meta: ScreenMeta = {
  title: 'History',
  icon: 'history',
  menu: 'entry',
  fill: true,
  keywords: ['runs', 'old runs', 'clean', 'run again', 'seed', 'players', 'overrides', 'output', 'log'],
  header: { search: { placeholder: 'Filter runs' } },
};

const HistoryPage = () => <History />;

export default HistoryPage;
export { meta };
