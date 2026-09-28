/* @layer core @kind types */

type ApworldManifest = { game?: string; world_version?: string };

type ApworldInfo = { module: string; manifest: ApworldManifest; bytes: Uint8Array };

export type { ApworldInfo, ApworldManifest };
