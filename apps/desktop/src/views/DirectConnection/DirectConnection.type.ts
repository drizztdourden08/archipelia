/* @layer renderer-app @kind types */
import type { DirectConnection as Direct } from '@archipelia/model';
import type { DirectOptions } from '../../lobbies/lobbies.type';

type DirectConnectionProps = {
  direct?: Direct;
  busy: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onOptions: (patch: Partial<DirectOptions>) => void;
};

export type { DirectConnectionProps };
