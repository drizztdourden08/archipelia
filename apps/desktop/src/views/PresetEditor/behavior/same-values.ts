/* @layer renderer-app @kind logic */
import type { Values } from '../PresetEditor.type';

const sameValues = (a: Values, b: Values) => {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length
    && keys.every((key) => key in b && JSON.stringify(a[key]) === JSON.stringify(b[key]));
};

export { sameValues };
