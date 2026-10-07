/* @layer renderer-app @kind logic */
import type { KeyValueEntry } from '@drizztdourden08/tessera/composites';
import { isLoose } from './is-loose';

const isScalar = (entry: [string, unknown]): entry is [string, KeyValueEntry] => typeof entry[1] === 'string' || typeof entry[1] === 'number';

const scalarsOf = (value: unknown): Record<string, KeyValueEntry> => (isLoose(value) ? Object.fromEntries(Object.entries(value).filter(isScalar)) : {});

export { scalarsOf };
