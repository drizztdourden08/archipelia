/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const withoutDirect = (template: SessionTemplate): SessionTemplate => {
  const next = { ...template };
  delete next.direct;
  return next;
};

export { withoutDirect };
