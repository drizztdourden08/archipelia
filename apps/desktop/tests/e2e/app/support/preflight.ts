/* @layer tests @kind helper */
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BARE_IMPORT = /^import\s[^'"]*?from\s+"([^".][^"]*)";?$/gm;
const BUILTIN = /^(node:|electron$|fs$|path$|os$|child_process$|crypto$|url$|module$|util$|events$|stream$|fs\/promises$)/;

const packageOf = (spec: string) => spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/');

const bareImports = (source: string) =>
  [...source.matchAll(BARE_IMPORT)].flatMap(([, spec]) => (spec === undefined || BUILTIN.test(spec) ? [] : [packageOf(spec)]));

const foldersUp = (start: string): string[] => {
  const parent = dirname(start);
  return parent === start ? [start] : [start, ...foldersUp(parent)];
};

const resolvesLikeEsm = async (fromDir: string, name: string) => {
  for (const folder of foldersUp(fromDir)) {
    const found = await access(join(folder, 'node_modules', name, 'package.json')).then(() => true, () => false);
    if (found) return true;
  }
  return false;
};

const unresolvedImports = async (mainFile: string) => {
  const source = await readFile(mainFile, 'utf8');
  const names = [...new Set(bareImports(source))];
  const checks = await Promise.all(names.map(async (name) => ((await resolvesLikeEsm(dirname(mainFile), name)) ? null : name)));
  return checks.filter((name): name is string => name !== null);
};

const assertLaunchable = async (mainFile: string) => {
  const missing = await unresolvedImports(mainFile);
  if (missing.length) throw new Error(`not launching: main imports packages the app cannot resolve: ${missing.join(', ')}`);
};

export { assertLaunchable };
