/* @layer renderer-app @kind logic */
import type { EnrichRequest } from '@archipelia/catalog';

const enrichKey = ({ source, apworld }: EnrichRequest): string => `${source}:${apworld}`;

export { enrichKey };
