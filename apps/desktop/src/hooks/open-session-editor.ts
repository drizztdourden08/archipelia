/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { sessionRoute } from './session-route';

const openSessionEditor = (id: string): void => nav.open(sessionRoute(id));

export { openSessionEditor };
