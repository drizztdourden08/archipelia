/* @layer renderer-app @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { WHEN_FORMAT } from '../EngineSettings.constants';
import type { WhenText } from '../EngineSettings.type';

const whenText: WhenText = (at, form) => formatDate(at, WHEN_FORMAT[form]);

export { whenText };
