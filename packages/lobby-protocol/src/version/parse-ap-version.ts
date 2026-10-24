/* @layer protocol @kind logic */
import { AP_VERSION } from './parse-ap-version.constants';

const parseApVersion = (text: string): [number, number, number] | null => {
  const match = AP_VERSION.exec(text);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

export { parseApVersion };
