/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera/primitives';
import { PRERELEASE_LABEL } from '../../GameCard.constants';
import { DirectTag } from '../DirectTag';
import { VerifiedTag } from '../VerifiedTag';
import type { GameCardEyebrowProps } from './GameCardEyebrow.type';

const GameCardEyebrow = ({ verified, direct, prerelease }: GameCardEyebrowProps) => (
  <Flex gap="xs" wrap>
    {verified && <VerifiedTag />}
    {direct && <DirectTag />}
    {prerelease && <Tag>{PRERELEASE_LABEL}</Tag>}
  </Flex>
);

export { GameCardEyebrow };
