/* @layer renderer-app @kind types */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import type { SeatKind } from '../../SessionLobby.type';

type SeatMetaProps = { kind: SeatKind; player: SessionPlayer; presets: GamePreset[] };

export type { SeatMetaProps };
