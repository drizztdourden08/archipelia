/* @layer renderer-app @kind config */
import type { FilterClause } from '@drizztdourden08/tessera/data';

const NO_FILTERS: readonly FilterClause[] = [];

const RETRY_SLACK_MS = 2000;

export { NO_FILTERS, RETRY_SLACK_MS };
