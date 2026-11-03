/* @layer renderer-app @kind config */
import type { PatternChoice } from '@drizztdourden08/tessera/composites';

const NO_CHOICES: readonly PatternChoice[] = [];

const NAME_CHOICES = new WeakMap<readonly string[], readonly PatternChoice[]>();

export { NAME_CHOICES, NO_CHOICES };
