/* @layer core @kind logic */
import { RESERVED_NAMES } from './build.constants';

const refusal = (name: string) => new Error(`The source archive holds a path Archipelia will not unpack: ${name.slice(0, 120)}`);

const climbs = (part: string): boolean => part === '' || part === '.' || part === '..';

const windowsUnsafe = (part: string): boolean =>
  part.includes(':') || /[ .]$/.test(part) || RESERVED_NAMES.has((part.split('.')[0] ?? '').toLowerCase());

const rootless = (name: string): boolean => name !== '' && !name.includes('\0') && !name.includes('\\') && !name.startsWith('/') && !/^[A-Za-z]:/.test(name);

const entryParts = (name: string, platform: NodeJS.Platform = process.platform): { parts: string[]; folder: boolean } => {
  const folder = name.endsWith('/');
  const parts = (folder ? name.slice(0, -1) : name).split('/');
  if (!rootless(name) || parts.some(climbs) || (platform === 'win32' && parts.some(windowsUnsafe))) throw refusal(name);
  return { parts, folder };
};

export { entryParts };
