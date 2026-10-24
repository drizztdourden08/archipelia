/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { join } from 'node:path';

const engineFolder = (engineRoot: string, id: string): string => join(engineRoot, assertSafeName(id, 'engine id'));

export { engineFolder };
