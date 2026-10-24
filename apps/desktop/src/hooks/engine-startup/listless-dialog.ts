/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { EngineChoice } from '@archipelia/model';
import { FIRST_RUN_TEXT, SIZE_TEXT } from './engine-startup.constants';
import { firstRunBase } from './first-run-base';

const listlessDialog = (choice: EngineChoice): ConfirmActionOptions => ({
  ...firstRunBase(choice),
  message: FIRST_RUN_TEXT.noList,
  facts: [
    { label: 'Archipelago', value: choice.ap },
    { label: 'Python', value: choice.python },
    { label: 'Download', value: SIZE_TEXT },
  ],
});

export { listlessDialog };
