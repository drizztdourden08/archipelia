/* @layer renderer-app @kind component */
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { directState } from '../../behavior/direct-state';
import { passwordHint } from '../../behavior/password-hint';
import { PLACE_CAPTION, PLACE_TEXT } from '../../behavior/place.constants';
import { useDirectWorlds } from '../../behavior/useDirectWorlds';
import { useSessionPlace } from '../../behavior/useSessionPlace';
import { worldSummary } from '../../behavior/world-summary';
import { worldsWarning } from '../../behavior/worlds-warning';
import { EDITOR_TEXT } from '../../SessionBuilder.constants';
import { DirectToggles } from '../DirectToggles';
import { DirectWorlds } from '../DirectWorlds';
import { PasswordControl } from '../PasswordControl';
import { SetupRow } from '../SetupRow';
import { WhereControl } from '../WhereControl';
import type { SetupFieldsProps } from './SetupFields.type';

const SetupFields = ({ builder, onWorld }: SetupFieldsProps) => {
  const { draft, live, busy } = builder;
  const place = useSessionPlace({ draft, servers: builder.servers, hosting: builder.hosting, live, setDraft: builder.setDraft });
  const worlds = useDirectWorlds(draft);
  const direct = directState(draft, live, busy);
  const warning = worldsWarning(worlds, direct.unlisted);
  return (
    <Stack as="section" gap="xs" aria-label={EDITOR_TEXT.join}>
      <Text variant="overline" tone="muted">{EDITOR_TEXT.join}</Text>
      <SetupRow label={EDITOR_TEXT.where} hint={live ? PLACE_TEXT.live : PLACE_CAPTION[place.place]}>
        <WhereControl place={place} busy={busy} locked={live} />
      </SetupRow>
      <SetupRow label={EDITOR_TEXT.direct} hint={direct.hint} problem={direct.problem}>
        <DirectToggles state={direct} onAllow={builder.setDirect} onOptions={builder.setDirectOptions} />
        {worlds.length > 0 && <DirectWorlds worlds={worlds} allowUnlisted={direct.unlisted} />}
        {warning && <Text variant="caption" tone="warning">{warning}</Text>}
      </SetupRow>
      <SetupRow label={EDITOR_TEXT.password} hint={passwordHint(draft)}>
        <PasswordControl password={builder.password} hasPassword={Boolean(draft.server.passwordRef)} onPassword={builder.setPassword} onClearPassword={builder.clearPassword} />
      </SetupRow>
      <SetupRow label={EDITOR_TEXT.world}>
        <Flex gap="sm" align="center" wrap>
          <Text variant="body" tone="dim">{worldSummary(draft.generator, draft.server)}</Text>
          <Button size="sm" variant="ghost" aria-label={`${EDITOR_TEXT.change} the world settings`} onClick={onWorld}>{EDITOR_TEXT.change}</Button>
        </Flex>
      </SetupRow>
    </Stack>
  );
};

export { SetupFields };
