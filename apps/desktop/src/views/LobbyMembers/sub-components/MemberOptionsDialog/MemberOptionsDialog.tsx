/* @layer renderer-app @kind component */
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Flex, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { OPTION_TEXT } from '../../LobbyMembers.constants';
import { useMemberOptions } from '../../behavior/useMemberOptions';
import { SlotOptionsView } from '../SlotOptionsView';
import type { MemberOptionsDialogProps } from './MemberOptionsDialog.type';

const MemberOptionsDialog = ({ serverId, lobby, member, onClose }: MemberOptionsDialogProps) => {
  const state = useMemberOptions({ serverId, lobbyId: lobby.id, memberId: member.id, rev: lobby.rev });
  return (
    <DialogShell
      open
      size="lg"
      title={OPTION_TEXT.title(member.displayName)}
      onClose={onClose}
      actions={<Flex gap="sm" justify="end" wrap><Button variant="secondary" onClick={onClose}>{OPTION_TEXT.close}</Button></Flex>}
    >
      <Stack gap="md">
        <Text tone="muted">{OPTION_TEXT.readOnly}</Text>
        {state.status === 'loading' && <Flex gap="sm" align="center"><Spinner /><Text tone="muted">{OPTION_TEXT.loading}</Text></Flex>}
        {state.status === 'failed' && <Callout tone="danger">{state.problem}</Callout>}
        {state.status === 'ready' && state.slots.map((slot) => <SlotOptionsView key={slot.name} slot={slot} titled={state.slots.length > 1} />)}
      </Stack>
    </DialogShell>
  );
};

export { MemberOptionsDialog };
