/* @layer client-kit @kind types */

type ApworldEntry = { path: string; bytes: Uint8Array };

type ApworldContents = { module: string; manifestText: string; entries: readonly string[] };

export type { ApworldContents, ApworldEntry };
