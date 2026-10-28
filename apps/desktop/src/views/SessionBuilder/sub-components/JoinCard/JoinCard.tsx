/* @layer renderer-app @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { joinRows } from '../../behavior/join-rows';
import { useDirectWorlds } from '../../behavior/useDirectWorlds';
import { useSessionPlace } from '../../behavior/useSessionPlace';
import { DirectWorlds } from '../DirectWorlds';
import { PasswordControl } from '../PasswordControl';
import type { JoinCardProps } from './JoinCard.type';
import { JOIN_CARD } from './JoinCard.constants';

const JoinCard = ({ builder }: JoinCardProps) => {
  const { draft, live } = builder;
  const place = useSessionPlace({ draft, servers: builder.servers, hosting: builder.hosting, live, setDraft: builder.setDraft });
  const password = (
    <PasswordControl password={builder.password} hasPassword={Boolean(draft.server.passwordRef)} onPassword={builder.setPassword} onClearPassword={builder.clearPassword} />
  );
  const directWorlds = useDirectWorlds(draft);
  const worlds = <DirectWorlds worlds={directWorlds} allowUnlisted={Boolean(draft.direct?.allowUnlisted)} />;
  const rows = joinRows({
    draft, directWorlds, worlds, live, place: place.place, placeOptions: place.options, remoteOptions: place.remoteOptions, remoteValue: place.remoteValue, busy: builder.busy, password,
    onPlace: place.choose, onRemote: place.pickRemote, onPort: builder.setPort, onAllow: builder.setDirect, onOptions: builder.setDirectOptions,
  });
  return <SettingsSection id="how-players-join" title={JOIN_CARD.heading} description={JOIN_CARD.description} rows={rows} />;
};

export { JoinCard };
