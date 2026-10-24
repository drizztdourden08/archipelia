/* @layer core @kind types */

type UploadPart = { size: number; chunks: Buffer[]; received: number };

export type { UploadPart };
