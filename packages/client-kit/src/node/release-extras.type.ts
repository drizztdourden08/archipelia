/* @layer client-kit @kind types */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ImageFormat } from '../release-files/release-files.type';

type ReleaseExtras = {
  thumbnail?: { bytes: Uint8Array; format: ImageFormat };
  description?: Uint8Array;
  issues: KitIssue[];
  warnings: KitIssue[];
};

export type { ReleaseExtras };
