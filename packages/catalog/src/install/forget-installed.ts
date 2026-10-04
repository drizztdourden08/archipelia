/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { recordPath } from './record-path';

const forgetInstalled = (files: DataFiles, apworld: string) => files.remove(recordPath(apworld));

export { forgetInstalled };
