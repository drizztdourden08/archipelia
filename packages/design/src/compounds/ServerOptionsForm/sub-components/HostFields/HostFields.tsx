/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { HostFieldsProps } from './HostFields.type';
import { hostRows } from '../../behavior/host-rows';
import { RoomPassword } from '../RoomPassword';

const HostFields = (props: HostFieldsProps) => {
  const { host, serverOptions, password, hasPassword, onHostKind, onPort, onRemoteServer, onPassword, onClearPassword } = props;
  const rows = useMemo(() => {
    const room = <RoomPassword password={password} hasPassword={hasPassword} onPassword={onPassword} onClearPassword={onClearPassword} />;
    return hostRows({ host, serverOptions, hasPassword, room, onHostKind, onPort, onRemoteServer });
  }, [host, serverOptions, password, hasPassword, onHostKind, onPort, onRemoteServer, onPassword, onClearPassword]);
  return <SettingsSection id="host" title="Host" description="Where the room runs and who may join it." rows={rows} />;
};

export { HostFields };
