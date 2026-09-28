/* @layer renderer-app @kind config */
import { createElement } from 'react';
import type { HubGroup } from '@drizztdourden08/brock-react';
import { SECTION } from '../navigation/app-navigation.constants';
import { DataView } from '../views/DataView';
import { hubPage } from './hub-page';

const DATA_HOME = hubPage(SECTION.overview, 'Overview', 'hard-drive', () => createElement(DataView, { part: 'overview' }));

const DATA_GROUPS: HubGroup[] = [
  {
    id: 'storage',
    label: 'Storage',
    pages: [hubPage(SECTION.runs, 'Session runs', 'history', () => createElement(DataView, { part: 'runs' }))],
  },
  {
    id: 'transfer',
    label: 'Transfer',
    pages: [
      hubPage(SECTION.export, 'Export', 'upload', () => createElement(DataView, { part: 'export' })),
      hubPage(SECTION.import, 'Import', 'download', () => createElement(DataView, { part: 'import' })),
    ],
  },
];

export { DATA_GROUPS, DATA_HOME };
