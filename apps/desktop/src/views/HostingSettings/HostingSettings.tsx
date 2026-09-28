/* @layer renderer-app @kind component */
import { Field, NumberInput, Select, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ReleaseMode, RemainingMode } from '@archipelia/model';
import type { HostingSettingsProps } from './HostingSettings.type';
import { DEFAULT_HOST_OPTIONS } from './HostingSettings.constants';
import type { AppSettings } from '../../settings.type';
import { RELEASE_OPTIONS, REMAINING_OPTIONS } from '../../compounds/ServerOptionsForm';

const HostingSettings = ({ settings, onChange }: HostingSettingsProps) => (
  <Stack>
    <Text as="h2" variant="subtitle">Hosting</Text>
    <Text variant="body">Defaults for new sessions. Each session keeps its own copy, so changing these never rewrites one.</Text>
    <Field label="Default host" hint="Where a new session runs its server.">
      <Select value={settings.hostingDefaultHost} options={DEFAULT_HOST_OPTIONS}
        onChange={(value) => onChange({ hostingDefaultHost: value as AppSettings['hostingDefaultHost'] })} />
    </Field>
    <Field label="Local port" hint="Players connect to this computer on this port.">
      <NumberInput min={1024} max={65535} value={settings.hostingLocalPort} onChange={(value) => onChange({ hostingLocalPort: value })} />
    </Field>
    <Field label="Hint cost" hint="Percent of a player's checks that one hint costs.">
      <NumberInput min={0} max={100} value={settings.hostingHintCost} onChange={(value) => onChange({ hostingHintCost: value })} />
    </Field>
    <Field label="Release mode">
      <Select value={settings.hostingReleaseMode} options={RELEASE_OPTIONS}
        onChange={(value) => onChange({ hostingReleaseMode: value as ReleaseMode })} />
    </Field>
    <Field label="Collect mode">
      <Select value={settings.hostingCollectMode} options={RELEASE_OPTIONS}
        onChange={(value) => onChange({ hostingCollectMode: value as ReleaseMode })} />
    </Field>
    <Field label="Remaining mode">
      <Select value={settings.hostingRemainingMode} options={REMAINING_OPTIONS}
        onChange={(value) => onChange({ hostingRemainingMode: value as RemainingMode })} />
    </Field>
    <Field label="Auto shutdown" hint="Minutes without activity before the server stops. 0 keeps it up.">
      <NumberInput min={0} value={settings.hostingAutoShutdownMinutes} onChange={(value) => onChange({ hostingAutoShutdownMinutes: value })} />
    </Field>
  </Stack>
);

export { HostingSettings };
