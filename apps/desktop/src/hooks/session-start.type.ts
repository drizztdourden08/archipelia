/* @layer renderer-app @kind types */
import type { SessionTemplate } from '@archipelia/model';
import type { SessionOverrides } from '../live/live.type';

type SessionStartInput = {
  template: SessionTemplate;
  keep?: (template: SessionTemplate) => Promise<SessionTemplate>;
  overrides?: SessionOverrides;
};

export type { SessionStartInput };
