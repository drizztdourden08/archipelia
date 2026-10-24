/* @layer client-kit @kind logic */
import { AP_VERSION } from './parse-ap-version.constants';

const parseApVersion = (text: string): [number, number, number] | null => {
  if (!AP_VERSION.test(text)) return null;
  const [major = 0, minor = 0, patch = 0] = text.split('.').map(Number);
  return [major, minor, patch];
};

export { parseApVersion };
