/* @layer renderer-app @kind config */
import type { NumberBounds, NumberSettingKey } from '../../settings.type';

const NUMBER_BOUNDS: Record<NumberSettingKey, NumberBounds> = {
  hostingLocalPort: { min: 1024, max: 65535 },
  hostingAutoShutdownMinutes: { min: 0 },
};

export { NUMBER_BOUNDS };
