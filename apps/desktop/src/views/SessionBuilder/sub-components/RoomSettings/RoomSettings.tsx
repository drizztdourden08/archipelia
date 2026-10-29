/* @layer renderer-app @kind component */
import { Disclosure, NumberInput, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PORT_PROBLEM, PORT_RANGE, SERVER_TEXT, ServerOptionsForm, inPortRange } from '@archipelia/design';
import { EDITOR_TEXT } from '../../SessionBuilder.constants';
import { SetupRow } from '../SetupRow';
import type { RoomSettingsProps } from './RoomSettings.type';
import './RoomSettings.css';

const RoomSettings = ({ builder, open, onOpenChange }: RoomSettingsProps) => {
  const { draft, busy } = builder;
  const { host } = draft;
  const port = host.kind === 'local' ? host.port : null;
  return (
    <Disclosure
      summary={EDITOR_TEXT.advanced}
      end={<Text variant="caption" tone="muted">{EDITOR_TEXT.advancedEnd}</Text>}
      wrapEnd
      open={open}
      onOpenChange={onOpenChange}
      bodyClassName="room-settings__body"
    >
      <Stack gap="md">
        {port !== null && (
          <SetupRow label={SERVER_TEXT.localPort.label} hint={SERVER_TEXT.localPort.hint} problem={inPortRange(port) ? undefined : PORT_PROBLEM}>
            <NumberInput aria-label={SERVER_TEXT.localPort.label} value={port} {...PORT_RANGE} disabled={busy} invalid={!inPortRange(port)} sizeToContent onChange={builder.setPort} />
          </SetupRow>
        )}
        <ServerOptionsForm generator={draft.generator} server={draft.server} onGenerator={builder.setGenerator} onServer={builder.setServer} />
      </Stack>
    </Disclosure>
  );
};

export { RoomSettings };
