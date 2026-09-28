/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const withoutPassword = (template: SessionTemplate): SessionTemplate => ({
  ...template, server: { ...template.server, passwordRef: undefined },
});

export { withoutPassword };
