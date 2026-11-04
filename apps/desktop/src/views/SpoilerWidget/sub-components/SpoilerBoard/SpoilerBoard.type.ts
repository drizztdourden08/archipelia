/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type SpoilerBoardProps = { session: Session; file: string; onHide: () => void };

export type { SpoilerBoardProps };
