/* @layer renderer-app @kind types */
import type { SessionPlayer } from '@archipelia/model';

type DirectCellProps = { player: SessionPlayer; onChange: (slot: number, on: boolean) => void };

export type { DirectCellProps };
