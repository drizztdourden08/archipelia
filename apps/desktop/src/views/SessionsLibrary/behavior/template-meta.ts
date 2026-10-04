/* @layer renderer-app @kind logic */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import { hostLabel } from '../../../hosts/host-label';
import { SPOILER_LABEL } from '../SessionsLibrary.constants';

const templateMeta = (template: SessionTemplate, servers: ServerEntry[] = []) => {
  const names = template.players.map((player) => player.name).filter(Boolean).join(' · ');
  return [names || 'no players yet', hostLabel(template.host, servers), SPOILER_LABEL[template.generator.spoiler]].join(' · ');
};

export { templateMeta };
