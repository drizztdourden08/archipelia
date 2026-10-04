/* @layer renderer-app @kind logic */
import type { BeforeQuit } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../stores/useRunsStore';
import { hostingRoom } from './hosting-room';
import { HOSTING_QUIT_MESSAGE } from './stop-room-confirm.constants';

const quitWhileHosting: BeforeQuit = () => (hostingRoom(useRunsStore.getState().runs) ? HOSTING_QUIT_MESSAGE : null);

export { quitWhileHosting };
