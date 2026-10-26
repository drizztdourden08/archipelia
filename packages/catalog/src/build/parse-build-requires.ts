/* @layer core @kind logic */
import { parse } from 'smol-toml';
import { isRecord, isStringList } from '@archipelia/model';
import { parseRequirements } from '@archipelia/engine';
import { DEFAULT_REQUIRES, MAX_REQUIRES } from './build.constants';

const unreadable = () => new Error('The build settings of this project (pyproject.toml) cannot be read, so Archipelia cannot build it.');

const refused = (line: string) =>
  new Error(`The build settings of this project list a requirement Archipelia will not install: ${line}. Only plain package names with versions are installed.`);

const tableOf = (text: string): Record<string, unknown> | undefined => {
  let doc: unknown;
  try {
    doc = parse(text);
  } catch {
    throw unreadable();
  }
  const table = isRecord(doc) ? doc['build-system'] : undefined;
  if (table === undefined) return undefined;
  if (!isRecord(table)) throw unreadable();
  return table;
};

const plainLine = (line: string): string => {
  const { packages, refused: bad } = parseRequirements(line);
  const [plain] = packages;
  if (/[\r\n]/.test(line) || bad.length > 0 || packages.length !== 1 || plain === undefined) throw refused(line);
  return plain;
};

const parseBuildRequires = (pyproject: string | undefined): string[] => {
  const table = pyproject === undefined ? undefined : tableOf(pyproject);
  if (table === undefined) return DEFAULT_REQUIRES;
  const requires = table.requires;
  if (!isStringList(requires) || requires.length > MAX_REQUIRES) throw unreadable();
  return requires.map(plainLine);
};

export { parseBuildRequires };
