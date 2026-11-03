/* @layer renderer-app @kind logic */
import type { SpoilerCount } from '@archipelia/design';

const listCount = (value: number, label: string): SpoilerCount[] => [{ key: 'total', value, label }];

export { listCount };
