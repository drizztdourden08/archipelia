/* @layer renderer-app @kind logic */
import type { StatusTone, TagLook } from '@drizztdourden08/tessera/primitives';
import { PHASE_URGENT } from '../SessionLobby.constants';

const phaseLook = (tone: StatusTone): TagLook => {
  const urgent = PHASE_URGENT.find((color) => color === tone);
  if (urgent) return { variant: 'urgency', color: urgent };
  return { color: tone === 'primary' ? 'primary' : 'neutral' };
};

export { phaseLook };
