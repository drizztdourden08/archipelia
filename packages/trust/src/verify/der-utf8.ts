/* @layer core @kind logic */
import { UTF8_STRING_TAG } from './der-utf8.constants';

const lengthBytes = (length: number) => {
  if (length < 0x80) return [length];
  if (length < 0x100) return [0x81, length];
  return [0x82, length >> 8, length & 0xff];
};

const derUtf8 = (text: string): Buffer => {
  const body = Buffer.from(text, 'utf8');
  return Buffer.concat([Buffer.from([UTF8_STRING_TAG, ...lengthBytes(body.length)]), body]);
};

export { derUtf8 };
