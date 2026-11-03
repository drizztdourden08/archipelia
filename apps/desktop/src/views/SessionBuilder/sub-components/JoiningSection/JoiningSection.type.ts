/* @layer renderer-app @kind types */
import type { DirectConnection, InstalledGame } from '@archipelia/model';
import type { DirectState } from '../../SessionBuilder.type';

type JoiningSectionProps = {
  state: DirectState;
  installed: readonly InstalledGame[];
  allowedGames: readonly string[];
  onAllow: (on: boolean) => void;
  onOptions: (patch: Partial<DirectConnection>) => void;
};

export type { JoiningSectionProps };
