/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { ServerFieldsProps } from './ServerFields.type';
import { serverRuleRows } from '../../behavior/server-rule-rows';

const ServerFields = ({ server, onServer }: ServerFieldsProps) => {
  const rows = useMemo(() => serverRuleRows(server, onServer), [server, onServer]);
  return <SettingsSection id="server-rules" title="Server rules" description="How the room treats hints, releases and idle time." rows={rows} />;
};

export { ServerFields };
