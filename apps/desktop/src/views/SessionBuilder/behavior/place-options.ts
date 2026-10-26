/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { PlaceView } from '../SessionBuilder.type';
import { PLACE_TEXT } from './place.constants';

const remoteLock = ({ draft, lobbyServers }: PlaceView): string | undefined =>
  (draft.direct && lobbyServers.length === 0 ? PLACE_TEXT.noArchipelia : undefined);

const placeOptions = (view: PlaceView): SettingsOption[] => {
  const live = view.live ? PLACE_TEXT.live : undefined;
  return [
    { value: 'local', label: 'Local', hint: PLACE_TEXT.local, disabled: live },
    { value: 'lan', label: 'LAN', hint: PLACE_TEXT.lan, disabled: live },
    { value: 'remote', label: 'Remote', hint: PLACE_TEXT.remote, disabled: live ?? remoteLock(view) },
  ];
};

export { placeOptions };
