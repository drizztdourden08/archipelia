/* @layer client-kit @kind logic */
import type { DataFile } from './apworld.type';

const encoder = new TextEncoder();

const encodeDataFile = (content: DataFile): Uint8Array => {
  if (content instanceof Uint8Array) return content;
  return encoder.encode(typeof content === 'string' ? content : `${JSON.stringify(content)}\n`);
};

export { encodeDataFile };
