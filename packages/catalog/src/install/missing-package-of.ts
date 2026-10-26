/* @layer core @kind logic */
import type { SchemaRead } from '@archipelia/engine';
import type { LoadContext } from './load-failure.type';
import { causeOf } from './cause-of';
import { MISSING_MODULE } from './read-game-schema.constants';

const missingPackageOf = (read: SchemaRead, context?: LoadContext): string | undefined => {
  if (!context || !read.failedWorlds.includes(context.module)) return undefined;
  const name = MISSING_MODULE.exec(causeOf(read) ?? '')?.[1]?.split('.')[0];
  return name && name !== 'worlds' && name !== context.module ? name : undefined;
};

export { missingPackageOf };
