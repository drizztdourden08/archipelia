/* @layer core @kind logic */
import { Inflate } from 'fflate';
import { INFLATE_SLICE } from './zip.constants';

const inflateCapped = (raw: Uint8Array, size: number, name: string): Uint8Array => {
  const out = new Uint8Array(size);
  let filled = 0;
  const inflater = new Inflate((chunk) => {
    if (filled + chunk.length > size) throw new Error(`the zip entry ${name} inflates past its declared size`);
    out.set(chunk, filled);
    filled += chunk.length;
  });
  for (let at = 0; at < raw.length; at += INFLATE_SLICE) inflater.push(raw.subarray(at, at + INFLATE_SLICE), at + INFLATE_SLICE >= raw.length);
  if (filled !== size) throw new Error(`the zip entry ${name} is shorter than its declared size`);
  return out;
};

export { inflateCapped };
