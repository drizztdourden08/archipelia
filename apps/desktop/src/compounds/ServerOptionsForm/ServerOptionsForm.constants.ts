/* @layer renderer-app @kind config */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const SPOILER_OPTIONS: SelectOption[] = [
  { value: '0', label: 'None' },
  { value: '1', label: 'Basic' },
  { value: '2', label: 'Playthrough' },
  { value: '3', label: 'Full with paths' },
];

const RELEASE_OPTIONS: SelectOption[] = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'auto', label: 'Auto' },
  { value: 'auto-enabled', label: 'Auto and enabled' },
  { value: 'goal', label: 'After goal' },
];

const REMAINING_OPTIONS: SelectOption[] = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'goal', label: 'After goal' },
];

const HOST_OPTIONS: SelectOption[] = [
  { value: 'local', label: 'This computer' },
  { value: 'archipelago-gg', label: 'archipelago.gg' },
  { value: 'remote', label: 'Remote server' },
];

export { HOST_OPTIONS, RELEASE_OPTIONS, REMAINING_OPTIONS, SPOILER_OPTIONS };
