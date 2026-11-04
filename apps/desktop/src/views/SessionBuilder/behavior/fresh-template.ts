/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { HostingDefaults } from '../SessionBuilder.type';
import { newTemplate } from './new-template';
import { withDefaultDirect } from './with-default-direct';

const freshTemplate = (hosting?: HostingDefaults): SessionTemplate => {
  const template = newTemplate(undefined, hosting);
  return template.host.kind === 'local' ? withDefaultDirect(template) : template;
};

export { freshTemplate };
