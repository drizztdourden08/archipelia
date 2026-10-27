/* @layer client-kit @kind types */
import type { KitIssue } from '../errors/kit-issue.type';

type ImageFormat = 'png' | 'webp';

type ImageHeader = { format: ImageFormat; width: number; height: number; animated: boolean };

type ThumbnailCheck = { header?: ImageHeader; issues: KitIssue[] };

type DescriptionCheck = { issues: KitIssue[]; warnings: KitIssue[] };

export type { DescriptionCheck, ImageFormat, ImageHeader, ThumbnailCheck };
