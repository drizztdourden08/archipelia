/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineChoice } from '@archipelia/model';
import { FIRST_RUN_TEXT, SIZE_TEXT } from './engine-startup.constants';

const firstRunBase = (choice: EngineChoice): ConfirmActionOptions => ({
  title: FIRST_RUN_TEXT.title,
  message: FIRST_RUN_TEXT.message,
  confirmLabel: FIRST_RUN_TEXT.confirmLabel,
  cancelLabel: FIRST_RUN_TEXT.cancelLabel,
  facts: [
    { label: 'Archipelago', value: FIRST_RUN_TEXT.archipelago(choice.ap) },
    { label: 'Python', value: FIRST_RUN_TEXT.python(choice.python) },
    { label: 'Requirements', value: FIRST_RUN_TEXT.requirements },
    { label: 'Download', value: SIZE_TEXT },
  ],
});

export { firstRunBase };
