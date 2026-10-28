/* @layer renderer-app @kind types */
import type { GameDetailsVersion } from '../../GameDetails.type';

type VersionRowProps = {
  label: string;
  version?: GameDetailsVersion | undefined;
};

export type { VersionRowProps };
