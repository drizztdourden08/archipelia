/* @layer core @kind types */

type ApworldManifest = { game?: string; worldVersion?: string; minimumAp?: string; maximumAp?: string };

type ApworldRead = { ok: true; module: string; manifest: ApworldManifest } | { ok: false; problem: string };

export type { ApworldManifest, ApworldRead };
