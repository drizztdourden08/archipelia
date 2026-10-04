/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { ROUTE } from './app-navigation.constants';

const openNewSession = (): void => nav.open(ROUTE.newSession);

export { openNewSession };
