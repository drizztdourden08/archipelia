/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import { sessionRoute } from '../../../../hooks/session-route';
import { playersLabel } from '../../behavior/players-label';
import { whereLabel } from '../../behavior/where-label';
import type { TemplateSearchEntryProps } from './TemplateSearchEntry.type';

const TemplateSearchEntry = ({ template, servers }: TemplateSearchEntryProps) => {
  const entries = useMemo(() => [{
    id: template.id,
    label: template.name,
    description: `${whereLabel(template, servers)} · ${playersLabel(template.players.length)}`,
    keywords: ['session', 'saved session', 'edit', ...template.players.flatMap((player) => (player.game ? [player.game] : []))],
  }], [template, servers]);
  useSearchEntries(entries, sessionRoute(template.id));
  return null;
};

export { TemplateSearchEntry };
