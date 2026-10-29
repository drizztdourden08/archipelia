/* @layer renderer-app @kind logic */
import { ART_MIN_PIXELS, ART_RATIO } from '../LobbySeat.constants';
import type { ArtFit } from '../LobbySeat.type';

const artFitOf = ({ naturalWidth, naturalHeight }: HTMLImageElement): ArtFit => {
  if (naturalWidth < ART_MIN_PIXELS || naturalHeight < ART_MIN_PIXELS) return 'off';
  const ratio = naturalWidth / naturalHeight;
  return ratio >= ART_RATIO.min && ratio <= ART_RATIO.max ? 'fits' : 'off';
};

export { artFitOf };
