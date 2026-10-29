/* @layer renderer-app @kind logic */
import type { GameCardEyebrowProps } from '../sub-components/GameCardEyebrow/GameCardEyebrow.type';

const hasEyebrow = ({ verified, direct, prerelease }: GameCardEyebrowProps): boolean => Boolean(verified || direct || prerelease);

export { hasEyebrow };
