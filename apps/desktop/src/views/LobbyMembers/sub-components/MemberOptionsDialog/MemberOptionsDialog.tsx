/* @layer renderer-app @kind component */
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Callout, Field, Flex, Grid, Spinner, Stack, Status, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { OPTION_TEXT } from '../../LobbyMembers.constants';
import { memberLine } from '../../behavior/member-line';
import { trustTag } from '../../behavior/trust-tag';
import { useMemberOptions } from '../../behavior/useMemberOptions';
import { MemberDialogActions } from '../MemberDialogActions';
import { SlotOptionsView } from '../SlotOptionsView';
import type { MemberOptionsDialogProps } from './MemberOptionsDialog.type';

const MemberOptionsDialog = ({ serverId, lobby, member, model }: MemberOptionsDialogProps) => {
  const state = useMemberOptions({ serverId, lobbyId: lobby.id, memberId: member.id, rev: lobby.rev });
  const games = [...new Set(member.slots.map((slot) => slot.game))].join(', ');
  return (
    <DialogShell
      open
      size="lg"
      title={OPTION_TEXT.title(member.seat, member.displayName)}
      headerExtra={member.admission === 'pending' ? <Status tone="warning" variant="pill" dot>{OPTION_TEXT.asks}</Status> : undefined}
      onClose={model.closeOptions}
      actions={<MemberDialogActions lobby={lobby} member={member} model={model} />}
    >
      <Stack gap="md">
        <Grid gap="md" minColWidth={200}>
          <Field label={OPTION_TEXT.name} width="full"><TextInput readOnly value={member.displayName} /></Field>
          <Field label={OPTION_TEXT.game} width="full"><TextInput readOnly value={games || OPTION_TEXT.noGame} /></Field>
          <Field label={OPTION_TEXT.sentBy} width="full"><TextInput readOnly value={`${memberLine(member)}, ${trustTag(member).text.toLowerCase()}`} /></Field>
        </Grid>
        <Text tone="muted">{OPTION_TEXT.readOnly}</Text>
        {state.status === 'loading' && <Flex gap="sm" align="center"><Spinner /><Text tone="muted">{OPTION_TEXT.loading}</Text></Flex>}
        {state.status === 'failed' && <Callout tone="danger">{state.problem}</Callout>}
        {state.status === 'ready' && state.slots.map((slot) => <SlotOptionsView key={slot.name} slot={slot} titled={state.slots.length > 1} />)}
      </Stack>
    </DialogShell>
  );
};

export { MemberOptionsDialog };
