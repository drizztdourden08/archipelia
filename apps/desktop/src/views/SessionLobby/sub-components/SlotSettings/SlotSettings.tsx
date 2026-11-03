/* @layer renderer-app @kind component */
import { Button, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { GameOptionsPanel } from '@archipelia/design';
import { SLOT_DIALOG } from '../../behavior/slot.constants';
import { useSlotSettings } from '../../behavior/useSlotSettings';
import { APP_FILE_TEXT } from '../../SessionLobby.constants';
import type { SlotSettingsProps } from './SlotSettings.type';

const SlotSettings = ({ player, installed, presets, actions, focusKey, onFocused }: SlotSettingsProps) => {
  const settings = useSlotSettings(player, installed, presets, actions);
  const { schema, readOnly } = settings;
  if (!schema) return null;
  const reset = !readOnly && settings.changed
    ? <Button size="sm" variant="ghost" onClick={settings.resetAll}>{SLOT_DIALOG.resetToPreset}</Button>
    : undefined;
  return (
    <Stack gap="sm">
      {readOnly && <Text variant="caption" tone="muted">{APP_FILE_TEXT.readOnly}</Text>}
      <GameOptionsPanel
        schema={schema}
        values={settings.values}
        onChange={readOnly ? undefined : settings.onChange}
        readOnly={readOnly}
        title={readOnly ? SLOT_DIALOG.settingsFromFile : SLOT_DIALOG.settings}
        problems={settings.problems}
        focusKey={focusKey}
        onFocused={onFocused}
        toolbar={reset}
      />
    </Stack>
  );
};

export { SlotSettings };
