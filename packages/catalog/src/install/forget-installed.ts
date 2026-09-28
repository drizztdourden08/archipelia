/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { recordPath } from './record-path';

const forgetInstalled = (files: FileStore, apworld: string) => files.remove(recordPath(apworld));

export { forgetInstalled };
