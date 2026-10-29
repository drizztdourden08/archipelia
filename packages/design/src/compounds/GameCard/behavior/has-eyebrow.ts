/* @layer renderer-app @kind logic */
import type { GameCardEyebrowProps } from '../sub-components/GameCardEyebrow/GameCardEyebrow.type';

const hasEyebrow = (flags: GameCardEyebrowProps): boolean => Object.values(flags).some(Boolean);

export { hasEyebrow };
