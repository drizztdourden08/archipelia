/* @layer client-kit @kind logic */
import { TEXT_SUFFIXES } from './node.constants';
import { CR, LF } from './normalize-line-endings.constants';

const normalizeLineEndings = (path: string, bytes: Uint8Array): Uint8Array => {
  if (!TEXT_SUFFIXES.some((suffix) => path.endsWith(suffix)) || !bytes.includes(CR)) return bytes;
  const out: number[] = [];
  bytes.forEach((byte, index) => {
    if (byte === CR && bytes[index + 1] === LF) return;
    out.push(byte);
  });
  return Uint8Array.from(out);
};

export { normalizeLineEndings };
