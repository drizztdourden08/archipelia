/* @layer renderer-app @kind config */
import type { FloatingWidget } from '@drizztdourden08/tessera/composites';

const TOP_ROW: readonly string[] = ['players', 'hints', 'room'];

const BOTTOM_ROW: readonly string[] = ['log', 'console'];

const ROW_SIZES: readonly number[] = [0.44, 0.08, 0.48];

const FLOATING_PLACES: Readonly<Partial<Record<string, FloatingWidget>>> = {
  spoiler: { id: 'spoiler', x: 0.02, y: 0.04, width: 560, height: 360 },
};

export { BOTTOM_ROW, FLOATING_PLACES, ROW_SIZES, TOP_ROW };
