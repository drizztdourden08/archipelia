/* @layer core @kind logic */
import { normalizePackageName } from '@archipelia/engine';
import { LEADING_NAME } from './names-of.constants';

const namesOf = (specs: string[]) => [...new Set(specs.map((spec) => normalizePackageName(LEADING_NAME.exec(spec)?.[0] ?? spec)))];

export { namesOf };
