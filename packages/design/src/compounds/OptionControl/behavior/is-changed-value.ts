/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';

const isChangedValue = (value: OptionValue, reference: OptionValue) => JSON.stringify(value) !== JSON.stringify(reference);

export { isChangedValue };
