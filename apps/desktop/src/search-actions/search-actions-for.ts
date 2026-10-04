/* @layer renderer-app @kind logic */
import type { FilePickerPort } from '@drizztdourden08/brock-core/platform';
import { nav } from '@drizztdourden08/brock-react';
import type { SearchAction } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { ROUTE } from '../hooks/app-navigation.constants';
import { useFocusStore } from '../stores/useFocusStore';
import { ACTION_GROUP, NO_ROOM } from './search-actions.constants';
import { addGameFromFile } from './add-game-from-file';
import { refreshGames } from './refresh-games';
import { stopRoom } from './stop-room';

const showRoom = (room: Session): void => {
  useFocusStore.getState().focus(room.id);
  nav.close();
};

const searchActionsFor = (room: Session | undefined, filePicker: FilePickerPort): SearchAction[] => [
  {
    id: 'archipelia:install-game',
    label: 'Install a game',
    group: ACTION_GROUP,
    description: 'Open the official games to install a world.',
    keywords: ['apworld', 'world', 'add', 'store'],
    run: () => nav.open(ROUTE.officialGames),
  },
  {
    id: 'archipelia:add-game-file',
    label: 'Add a game from a file',
    group: ACTION_GROUP,
    description: 'Pick an .apworld file and install the world it holds.',
    keywords: ['apworld', 'world', 'install', 'file', 'custom'],
    run: () => { void addGameFromFile(filePicker); },
  },
  {
    id: 'archipelia:refresh-games',
    label: 'Refresh the games index',
    group: ACTION_GROUP,
    description: 'Fetch the latest list of worlds and their versions.',
    keywords: ['apworld', 'catalog', 'updates'],
    run: () => { void refreshGames(); },
  },
  {
    id: 'archipelia:show-room',
    label: 'Show the room',
    group: ACTION_GROUP,
    description: room ? `Open the dashboard of ${room.snapshot.name}.` : NO_ROOM,
    keywords: ['dashboard', 'hosting', 'server'],
    disabled: !room,
    run: () => { if (room) showRoom(room); },
  },
  {
    id: 'archipelia:stop-room',
    label: 'Stop the room',
    group: ACTION_GROUP,
    description: room ? `Stop ${room.snapshot.name} and disconnect every player.` : NO_ROOM,
    keywords: ['server', 'hosting', 'shut down'],
    disabled: !room,
    run: () => { if (room) void stopRoom(room); },
  },
];

export { searchActionsFor };
