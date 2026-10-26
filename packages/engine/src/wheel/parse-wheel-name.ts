/* @layer core @kind logic */
import type { WheelName } from './wheel.type';
import { WHEEL_EXTENSION, WHEEL_PART } from './wheel.constants';

const parseWheelName = (file: string): WheelName | undefined => {
  if (!file.endsWith(WHEEL_EXTENSION)) return undefined;
  const parts = file.slice(0, -WHEEL_EXTENSION.length).split('-');
  if ((parts.length !== 5 && parts.length !== 6) || !parts.every((part) => WHEEL_PART.test(part))) return undefined;
  const [distribution, version] = parts;
  const [python, abi, platform] = parts.slice(-3);
  if (distribution === undefined || version === undefined || python === undefined || abi === undefined || platform === undefined) return undefined;
  const triples = python.split('.').flatMap((py) => abi.split('.').flatMap((tag) => platform.split('.').map((plat) => `${py}-${tag}-${plat}`)));
  return { distribution, version, triples };
};

export { parseWheelName };
