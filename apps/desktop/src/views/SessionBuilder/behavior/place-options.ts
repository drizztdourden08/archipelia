/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { PlaceView } from '../SessionBuilder.type';
import { PLACE_TEXT } from './place.constants';

const lockOf = ({ draft, connected }: PlaceView, toHere: boolean): string | undefined => {
  const { direct } = draft;
  if (!direct || connected === 0) return undefined;
  const here = direct.serverId === LOCAL_SERVER;
  if (here === toHere) return undefined;
  return here ? PLACE_TEXT.lockedHere : PLACE_TEXT.lockedRemote;
};

const remoteLock = (view: PlaceView): string | undefined =>
  (view.draft.direct && view.lobbyServers.length === 0 ? PLACE_TEXT.noArchipelia : lockOf(view, false));

const placeOptions = (view: PlaceView): SettingsOption[] => {
  const direct = view.draft.direct !== undefined;
  return [
    { value: 'local', label: 'Local', hint: direct ? PLACE_TEXT.localDirect : PLACE_TEXT.local, disabled: lockOf(view, true) },
    { value: 'lan', label: 'LAN', hint: PLACE_TEXT.lan, disabled: direct ? lockOf(view, true) : PLACE_TEXT.lanOff },
    { value: 'remote', label: 'Remote', hint: PLACE_TEXT.remote, disabled: remoteLock(view) },
  ];
};

export { placeOptions };
