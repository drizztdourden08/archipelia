/* @layer core @kind types */
import type { PackageSource } from '@archipelia/model';

type AcceptedFound = { pins: string[]; sha256: string; sources?: PackageSource[] };

export type { AcceptedFound };
