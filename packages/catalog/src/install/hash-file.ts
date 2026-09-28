/* @layer core @kind logic */
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

const hashFile = async (file: string) => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk as Buffer);
  return hash.digest('hex');
};

export { hashFile };
