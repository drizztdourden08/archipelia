/* @layer renderer-app @kind logic */
import type { SessionPlayer, SessionTemplate } from '@archipelia/model';
import { applyOverrides } from './apply-overrides';
import type { LiveTab } from './live.type';

const draftOf = (tab: Pick<LiveTab, 'overrides'>, saved: SessionTemplate, edited: SessionPlayer[] | undefined): SessionTemplate =>
  applyOverrides(saved, edited ? { ...tab.overrides, players: edited } : tab.overrides);

export { draftOf };
