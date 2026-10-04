/* @layer renderer-app @kind types */
import type { HostTarget } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { HostKind } from '../../ServerOptionsForm.type';

type HostFieldsProps = {
  host: HostTarget;
  serverOptions: SelectOption[];
  onHostKind: (kind: HostKind) => void;
  onPort: (port: number) => void;
  onRemoteServer: (serverId: string) => void;
};

export type { HostFieldsProps };
