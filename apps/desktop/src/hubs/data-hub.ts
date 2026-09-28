/* @layer renderer-app @kind config */
import { createElement } from 'react';
import { defineHub } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { DATA_HUB } from '../navigation/app-navigation.constants';
import { DATA_GROUPS, DATA_HOME } from './data-pages.constants';

const dataHub = defineHub({
  id: DATA_HUB,
  title: 'Data',
  icon: createElement(Icon, { name: 'hard-drive' }),
  home: DATA_HOME,
  groups: DATA_GROUPS,
  search: { placeholder: 'Find in data' },
});

export { dataHub };
