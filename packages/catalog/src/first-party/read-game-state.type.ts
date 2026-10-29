/* @layer core @kind types */
import type { ReleaseState } from './first-party.type';

type GameState = { state: ReleaseState; prerelease?: string };

export type { GameState };
