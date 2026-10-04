/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { EDIT_SUB, ROUTE } from './app-navigation.constants';

const openSessionEditor = (id: string): void => nav.open(`${ROUTE.sessions}/${encodeURIComponent(id)}/${EDIT_SUB}`);

export { openSessionEditor };
