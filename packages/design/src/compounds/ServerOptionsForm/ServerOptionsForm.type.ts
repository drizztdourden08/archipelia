/* @layer renderer-app @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { GeneratorSettings, HostTarget, ServerSettings } from '@archipelia/model';

type HostKind = HostTarget['kind'];

type ServerOptionsFormProps = {
  generator: GeneratorSettings;
  server: ServerSettings;
  host: HostTarget;
  serverOptions: SelectOption[];
  password: string;
  hasPassword: boolean;
  onGenerator: (patch: Partial<GeneratorSettings>) => void;
  onServer: (patch: Partial<ServerSettings>) => void;
  onHostKind: (kind: HostKind) => void;
  onPort: (port: number) => void;
  onRemoteServer: (serverId: string) => void;
  onPassword: (value: string) => void;
  onClearPassword: () => void;
};

export type { HostKind, ServerOptionsFormProps };
