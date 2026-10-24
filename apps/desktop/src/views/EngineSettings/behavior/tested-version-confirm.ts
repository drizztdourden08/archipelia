/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineChoice } from '@archipelia/model';

const testedVersionConfirm = (failed: string, tested: EngineChoice): ConfirmActionOptions => ({
  title: 'Install the tested version?',
  message: `Archipelago ${failed} did not pass the test. Archipelago ${tested.ap} with Python ${tested.python} is the version this app was tested with.`,
  confirmLabel: `Install ${tested.ap}`,
});

export { testedVersionConfirm };
