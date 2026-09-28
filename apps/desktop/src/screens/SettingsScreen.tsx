/* @layer renderer-app @kind component */
import { useEffect } from 'react';
import { defineScreen } from '@drizztdourden08/brock-react';
import { SECTION } from '../navigation/app-navigation.constants';
import { useAppNavigation } from '../navigation/useAppNavigation';

const OpenGeneralSection = () => {
  const { openSection } = useAppNavigation();
  useEffect(() => { openSection(SECTION.general); }, [openSection]);
  return null;
};

const settingsScreen = defineScreen({
  id: 'settings',
  title: 'Settings',
  shortcut: 'Mod+Comma',
  layer: 'own',
  render: () => <OpenGeneralSection />,
});

export { settingsScreen };
