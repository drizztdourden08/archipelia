/* @layer core @kind types */
import type { EngineRuntime, WorldLayout } from '@archipelia/model';
import type { ApworldInfo } from './read-apworld.type';

type Placement = { path: string; commit: () => Promise<void>; rollback: () => Promise<void> };

type PlaceRequest = { runtime: EngineRuntime; file: string; info: ApworldInfo; layout: WorldLayout };

export type { PlaceRequest, Placement };
