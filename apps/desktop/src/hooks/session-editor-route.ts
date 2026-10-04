/* @layer renderer-app @kind logic */
import { EDIT_SUB, ROUTE } from './app-navigation.constants';

const sessionEditorRoute = (id: string): string => `${ROUTE.sessions}/${encodeURIComponent(id)}/${EDIT_SUB}`;

export { sessionEditorRoute };
