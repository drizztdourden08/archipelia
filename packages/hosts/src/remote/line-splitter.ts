/* @layer core @kind logic */
import { StringDecoder } from 'node:string_decoder';

const createLineSplitter = (onLine: (line: string) => void) => {
  const decoder = new StringDecoder('utf8');
  let rest = '';
  return (chunk: Buffer | string) => {
    rest += typeof chunk === 'string' ? chunk : decoder.write(chunk);
    const parts = rest.split(/\r?\n/);
    rest = parts.pop() ?? '';
    parts.filter((part) => part.length > 0).forEach(onLine);
  };
};

export { createLineSplitter };
