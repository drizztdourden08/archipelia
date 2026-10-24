/* @layer core @kind types */

type ZipEntry = { name: string; method: number; compressedSize: number; size: number; offset: number };

type ZipLimits = { entries: number; entryBytes: number; totalBytes: number };

export type { ZipEntry, ZipLimits };
