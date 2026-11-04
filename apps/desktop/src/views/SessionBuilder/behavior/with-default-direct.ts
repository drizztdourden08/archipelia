/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { DEFAULT_DIRECT } from '../SessionBuilder.constants';

const withDefaultDirect = (template: SessionTemplate): SessionTemplate =>
  (template.direct ? template : { ...template, direct: { ...DEFAULT_DIRECT } });

export { withDefaultDirect };
