/* @layer renderer-app @kind types */
import type { GameDetailsVersion } from '../../GameDetails.type';

type GameDetailsVersionsProps = {
  options: GameDetailsVersion[];
  value?: string | undefined;
  onChange: (value: string) => void;
  note?: string | undefined;
  loading?: boolean | undefined;
};

export type { GameDetailsVersionsProps };
