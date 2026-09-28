/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';

const formatJson = (value: OptionValue) => JSON.stringify(value, null, 2);

export { formatJson };
