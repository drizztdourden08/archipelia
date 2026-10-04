/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';

type InstallFromFileParams = { engineDir: string; files: DataFiles; path: string };

export type { InstallFromFileParams };
