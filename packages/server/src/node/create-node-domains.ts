/* @layer core @kind logic */
import { join } from 'node:path';
import { createDataDomains } from '@drizztdourden08/brock-electron/node';
import { DATA_DOMAINS } from '../core/data-domains.constants';
import { DATA_FOLDER } from './create-node-domains.constants';

const createNodeDomains = (dataDir: string) => createDataDomains(join(dataDir, DATA_FOLDER), DATA_DOMAINS);

export { createNodeDomains };
