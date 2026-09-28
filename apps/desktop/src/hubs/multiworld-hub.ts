/* @layer renderer-app @kind config */
import { createElement } from 'react';
import { defineHub } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { MULTIWORLD_HUB } from '../navigation/app-navigation.constants';
import { MULTIWORLD_GROUPS, MULTIWORLD_HOME } from './multiworld-pages.constants';

const multiworldHub = defineHub({
  id: MULTIWORLD_HUB,
  title: 'Multiworld',
  icon: createElement(Icon, { name: 'layers' }),
  home: MULTIWORLD_HOME,
  groups: MULTIWORLD_GROUPS,
  search: { placeholder: 'Find a section' },
});

export { multiworldHub };
