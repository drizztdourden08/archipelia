/* @layer core @kind types */

type ZipEntry = { name: string; method: number; compressedSize: number; size: number; offset: number };

type ZipLimits = { entries: number; entryBytes: number; totalBytes: number };

type UnzipPick = (entry: ZipEntry) => boolean;

type Unzipped = { names: string[]; files: Record<string, Uint8Array> };

export type { UnzipPick, Unzipped, ZipEntry, ZipLimits };
