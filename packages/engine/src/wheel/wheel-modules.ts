/* @layer core @kind logic */
import { EXTENSION_SUFFIX } from './wheel.constants';

const topLevelOf = (name: string): string | undefined => {
  const [first, ...rest] = name.split('/');
  if (first === undefined || first === '' || first.endsWith('.dist-info') || first.endsWith('.data')) return undefined;
  if (rest.length > 0) return first;
  if (first.endsWith('.py')) return first.slice(0, -3);
  return EXTENSION_SUFFIX.test(first) ? first.split('.')[0] : undefined;
};

const wheelModules = (names: readonly string[]): string[] => {
  const modules = new Set<string>();
  for (const name of names) {
    const module = topLevelOf(name);
    if (module !== undefined && module !== '') modules.add(module);
  }
  return [...modules];
};

export { wheelModules };
