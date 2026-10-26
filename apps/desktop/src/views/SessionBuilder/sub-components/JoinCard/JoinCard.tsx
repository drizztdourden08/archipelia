/* @layer renderer-app @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { usePendingCloses } from '../../../../hooks/usePendingCloses';
import { joinRows } from '../../behavior/join-rows';
import { LOBBY_TEXT } from '../../behavior/lobby-view.constants';
import { useSessionPlace } from '../../behavior/useSessionPlace';
import { JoinState } from '../JoinState';
import { PasswordControl } from '../PasswordControl';
import type { JoinCardProps } from './JoinCard.type';

const JoinCard = ({ builder }: JoinCardProps) => {
  const { draft, direct } = builder;
  const place = useSessionPlace({ draft, servers: builder.servers, hosting: builder.hosting, setHost: builder.setHost, moveTo: (serverId) => void direct.moveTo(serverId) });
  const closing = usePendingCloses(draft.id).length > 0;
  const password = (
    <PasswordControl password={builder.password} hasPassword={Boolean(draft.server.passwordRef)} onPassword={builder.setPassword} onClearPassword={builder.clearPassword} />
  );
  const rows = joinRows({
    draft, place: place.place, placeOptions: place.options, remoteOptions: place.remoteOptions, remoteValue: place.remoteValue, busy: builder.busy || place.busy, password,
    onPlace: place.choose, onRemote: place.pickRemote, onPort: builder.setPort,
    onAllow: (on) => (on ? direct.enable() : void direct.disable()),
    onOptions: (patch) => void direct.setOptions(patch),
  });
  const shown = draft.direct !== undefined || closing || place.error !== null;
  return (
    <SettingsSection id="how-players-join" title={LOBBY_TEXT.heading} description={LOBBY_TEXT.description} rows={rows}>
      {shown ? <JoinState direct={draft.direct} place={place} closing={closing} /> : undefined}
    </SettingsSection>
  );
};

export { JoinCard };
