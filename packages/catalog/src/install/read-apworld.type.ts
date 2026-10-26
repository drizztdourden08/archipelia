/* @layer core @kind types */

type ApworldManifest = { game?: string; world_version?: string };

type ApworldInfo = { module: string; manifest: ApworldManifest; requirements: string; bytes: Uint8Array };

export type { ApworldInfo, ApworldManifest };
