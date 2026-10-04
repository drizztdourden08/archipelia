/* @layer renderer-app @kind component */
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { HomeView } from '../../views/HomeView';

const meta: ScreenMeta = { title: 'Home', icon: 'house', keywords: ['overview', 'engine', 'recent runs', 'run again'] };

const MultiworldHome = ({ slots }: HeroProps) => <HomeView slots={slots} />;

export default MultiworldHome;
export { meta };
