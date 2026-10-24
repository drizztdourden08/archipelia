/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { loadTrustedRoot } from '@archipelia/trust';

const trustRoot = async (cache: DataFiles) => (await loadTrustedRoot({ files: cache })).root;

export { trustRoot };
