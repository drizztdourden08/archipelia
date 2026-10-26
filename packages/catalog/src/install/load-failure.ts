/* @layer core @kind logic */
import type { SchemaRead } from '@archipelia/engine';
import type { LoadContext } from './load-failure.type';
import { causeOf } from './cause-of';
import { failedText } from './failed-text';
import { missingPackageOf } from './missing-package-of';

const reasonFor = (declared: string[]) =>
  declared.length === 0
    ? 'the world does not list it in a requirements.txt'
    : `the world's requirements.txt (${declared.join(', ')}) does not provide it`;

const loadFailure = (read: SchemaRead, game: string, context?: LoadContext) => {
  const cause = causeOf(read);
  const missing = missingPackageOf(read, context);
  if (context && missing) return failedText(context.label, [missing], reasonFor(context.packages));
  const worlds = read.failedWorlds.length ? `failed to load: ${read.failedWorlds.join(', ')}` : 'the world did not load in the engine';
  return `${game}: ${cause ? `${worlds} (${cause})` : worlds}`;
};

export { loadFailure };
