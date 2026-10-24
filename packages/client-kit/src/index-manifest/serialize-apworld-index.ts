/* @layer client-kit @kind logic */
import type { ApworldIndex } from './index.type';

const serializeApworldIndex = (index: ApworldIndex): string => `${JSON.stringify(index, null, 2)}\n`;

export { serializeApworldIndex };
