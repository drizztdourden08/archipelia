/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const withoutPlace = (template: SessionTemplate): SessionTemplate => {
  const next = { ...template };
  delete next.lobby;
  delete next.lan;
  return next;
};

export { withoutPlace };
