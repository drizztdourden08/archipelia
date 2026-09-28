/* @layer core @kind types */
type RoomStatus = {
  tracker: string;
  players: [name: string, game: string][];
  last_port: number;
  last_activity: string;
  timeout: number;
  downloads: { slot: number; download: string }[];
};

type LogChunk = { text: string; offset: number };

type GgClientOptions = { baseUrl?: string; ownerId: string; fetch?: typeof fetch };

export type { GgClientOptions, LogChunk, RoomStatus };
