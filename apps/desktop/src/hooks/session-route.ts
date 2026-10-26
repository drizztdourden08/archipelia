/* @layer renderer-app @kind logic */
import { EDIT_SUB, ROUTE } from './app-navigation.constants';

const sessionRoute = (id: string, sub: string = EDIT_SUB): string => `${ROUTE.sessions}/${encodeURIComponent(id)}/${sub}`;

export { sessionRoute };
