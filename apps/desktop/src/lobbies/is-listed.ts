/* @layer renderer-app @kind logic */
import type { DirectConnection } from '@archipelia/model';

const isListed = (direct: DirectConnection | undefined) => direct !== undefined && direct.listed !== false;

export { isListed };
