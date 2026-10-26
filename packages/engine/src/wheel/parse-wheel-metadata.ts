/* @layer core @kind logic */
import type { Headers } from './parse-wheel-metadata.type';
import { EXTRA_MARKER, OLD_STYLE } from './parse-wheel-metadata.constants';
import { SAFE_FIELD } from './wheel.constants';

const requirementOf = (raw: string): string => raw.replace(OLD_STYLE, (_whole, name: string, spec: string) => `${name}${spec.replace(/\s+/g, '')}`).trim();

const headersOf = (text: string): Headers => {
  const found: Headers = { requires: [] };
  for (const line of text.split(/\r?\n/)) {
    if (line === '') break;
    const cut = line.indexOf(':');
    if (cut === -1 || /^\s/.test(line)) continue;
    const [key, value] = [line.slice(0, cut).trim().toLowerCase(), line.slice(cut + 1).trim()];
    if (key === 'name') found.name = value;
    else if (key === 'version') found.version = value;
    else if (key === 'requires-dist' && !EXTRA_MARKER.test(value)) found.requires.push(requirementOf(value));
  }
  return found;
};

const parseWheelMetadata = (text: string): { name: string; version: string; requires: string[] } => {
  const { name, version, requires } = headersOf(text);
  if (name === undefined || version === undefined || !SAFE_FIELD.test(name) || !SAFE_FIELD.test(version)) throw new Error('The wheel metadata has no usable name and version');
  return { name, version, requires };
};

export { parseWheelMetadata };
