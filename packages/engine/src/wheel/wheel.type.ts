/* @layer core @kind types */

type WheelName = { distribution: string; version: string; triples: string[] };

type WheelKind = 'exact' | 'abi3' | 'pure';

type WheelFit = { rank: number; kind: WheelKind };

type WheelMetadata = { name: string; version: string; requires: string[]; modules: string[] };

type WheelInstall = { file: string; sha256: string };

export type { WheelFit, WheelInstall, WheelKind, WheelMetadata, WheelName };
