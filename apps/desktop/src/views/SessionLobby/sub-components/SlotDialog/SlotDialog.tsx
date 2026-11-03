/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Flex, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { isAppGame } from '../../behavior/is-app-game';
import { playerLabel } from '../../behavior/player-label';
import { SLOT_DIALOG } from '../../behavior/slot.constants';
import { slotStatusOf } from '../../behavior/slot-status-of';
import { SEAT_EDITOR_CLASS } from '../../SessionLobby.constants';
import { SlotFields } from '../SlotFields';
import { SlotSettings } from '../SlotSettings';
import type { SlotDialogProps } from './SlotDialog.type';

const SlotDialog = ({ player, installed, presets, allowed, busy, actions, focusKey, onFocused, onClose }: SlotDialogProps) => {
  const [initial] = useState(player);
  const appGame = isAppGame(player, installed);
  const status = slotStatusOf(player, appGame, false);
  const cancel = useCallback(() => {
    actions.replace(initial);
    onClose();
  }, [actions, initial, onClose]);
  return (
    <DialogShell
      open
      size="lg"
      className={SEAT_EDITOR_CLASS}
      title={SLOT_DIALOG.title(player.slot, playerLabel(player))}
      headerExtra={<Status tone={status.tone} variant="pill" dot>{status.label}</Status>}
      onClose={cancel}
      actions={(
        <Flex gap="sm" justify="end" wrap>
          <Button variant="secondary" onClick={cancel}>{SLOT_DIALOG.cancel}</Button>
          <Button variant="primary" onClick={onClose}>{SLOT_DIALOG.save}</Button>
        </Flex>
      )}
    >
      <Stack gap="md">
        <SlotFields player={player} installed={installed} presets={presets} allowed={allowed} appGame={appGame} busy={busy} actions={actions} />
        {appGame && <Callout tone="info">{SLOT_DIALOG.appFile(player.game)}</Callout>}
        <SlotSettings player={player} installed={installed} presets={presets} actions={actions} focusKey={focusKey} onFocused={onFocused} />
      </Stack>
    </DialogShell>
  );
};

export { SlotDialog };
