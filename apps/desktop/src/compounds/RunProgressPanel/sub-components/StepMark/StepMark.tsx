/* @layer renderer-app @kind component */
import { Glyph, PathIcon } from '@drizztdourden08/tessera/primitives';
import type { StepMarkProps } from './StepMark.type';
import { DOT, MARK_SIZE, RING } from './StepMark.constants';

const StepMark = ({ state }: StepMarkProps) => {
  if (state === 'done') return <Glyph name="check" size={MARK_SIZE} />;
  if (state === 'current') return <PathIcon circles={DOT} size={MARK_SIZE} aria-hidden />;
  return <PathIcon circles={RING} size={MARK_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden />;
};

export { StepMark };
