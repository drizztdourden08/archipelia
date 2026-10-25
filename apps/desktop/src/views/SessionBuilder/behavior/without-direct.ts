/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const withoutDirect = (template: SessionTemplate): SessionTemplate => ({ ...template, direct: undefined });

export { withoutDirect };
