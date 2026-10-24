/* @layer renderer-app @kind logic */
import type { ConfirmChoiceOptions } from '@drizztdourden08/brock-react';
import type { EngineChoice, EngineOverview } from '@archipelia/model';
import { releaseOptions } from '../../views/EngineSettings/behavior/release-options';
import { firstRunBase } from './first-run-base';

const firstRunDialog = (overview: EngineOverview | null, choice: EngineChoice): ConfirmChoiceOptions<string> | null => {
  const choices = (overview ? releaseOptions(overview) : [])
    .filter((option) => !option.disabled)
    .map((option) => ({ value: option.value, label: option.label, ...(option.hint ? { description: option.hint } : {}) }));
  if (choices.length === 0) return null;
  const initial = choices.some((entry) => entry.value === choice.ap) ? choice.ap : choices[0]?.value ?? choice.ap;
  return { ...firstRunBase(choice), choices, initial, look: 'select', searchable: true };
};

export { firstRunDialog };
