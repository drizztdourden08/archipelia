/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { overridesOfRun } from './overrides-of-run';
import type { SessionOverrides } from './live.type';

const overridesOfSession = (draft: SessionTemplate): SessionOverrides => ({ ...overridesOfRun({ snapshot: draft }), lan: draft.lan === true });

export { overridesOfSession };
