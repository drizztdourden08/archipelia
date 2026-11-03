/* @layer renderer-app @kind types */
import type { DirectConnection } from '@archipelia/model';
import type { DirectState } from '../../SessionBuilder.type';

type DirectTogglesProps = {
  state: DirectState;
  onAllow: (on: boolean) => void;
  onOptions: (patch: Partial<DirectConnection>) => void;
};

export type { DirectTogglesProps };
