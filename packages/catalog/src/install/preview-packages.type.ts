/* @layer core @kind types */
import type { ApworldInfo } from './read-apworld.type';

type HashedWorld = { info: ApworldInfo; sha256: string };

export type { HashedWorld };
