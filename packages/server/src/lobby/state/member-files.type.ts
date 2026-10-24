/* @layer core @kind types */
import type { UploadKind } from '@archipelia/lobby-protocol';

type MemberFile = { sha256: string; size: number; kind: UploadKind };

export type { MemberFile };
