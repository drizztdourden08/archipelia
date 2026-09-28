/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { HomeView } from '../views/HomeView';

const homeScreen = defineScreen({
  id: 'home',
  title: 'Home',
  layer: 'fullscreen',
  render: () => <HomeView />,
});

export { homeScreen };
