/* @layer core @kind logic */
import type { SchemaRead } from '@archipelia/engine';
import type { LoadContext } from './load-failure.type';
import { failedText } from './failed-text';
import { ERROR_LINE, MISSING_MODULE } from './read-game-schema.constants';

const missingPackage = (cause: string | undefined, module: string) => {
  const name = MISSING_MODULE.exec(cause ?? '')?.[1]?.split('.')[0];
  return name && name !== 'worlds' && name !== module ? name : undefined;
};

const reasonFor = (declared: string[]) =>
  declared.length === 0
    ? 'the world does not list it in a requirements.txt'
    : `the world's requirements.txt (${declared.join(', ')}) does not provide it`;

const loadFailure = ({ failedWorlds, lines }: SchemaRead, game: string, context?: LoadContext) => {
  const cause = lines.filter((line) => ERROR_LINE.test(line)).at(-1)?.trim();
  const missing = context && failedWorlds.includes(context.module) ? missingPackage(cause, context.module) : undefined;
  if (context && missing) return failedText(context.label, [missing], reasonFor(context.packages));
  const worlds = failedWorlds.length ? `failed to load: ${failedWorlds.join(', ')}` : 'the world did not load in the engine';
  return `${game}: ${cause ? `${worlds} (${cause})` : worlds}`;
};

export { loadFailure };
