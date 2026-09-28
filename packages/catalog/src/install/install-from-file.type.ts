/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

type InstallFromFileParams = { engineDir: string; files: FileStore; path: string };

export type { InstallFromFileParams };
