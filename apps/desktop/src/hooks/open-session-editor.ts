/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { sessionEditorRoute } from './session-editor-route';

const openSessionEditor = (id: string): void => nav.open(sessionEditorRoute(id));

export { openSessionEditor };
