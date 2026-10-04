/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { CREATE_PARAM, ROUTE } from './app-navigation.constants';

const openNewSession = (): void => nav.open(ROUTE.sessions, { [CREATE_PARAM]: Date.now() });

export { openNewSession };
