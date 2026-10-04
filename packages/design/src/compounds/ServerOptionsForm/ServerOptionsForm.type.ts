/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { GeneratorSettings, HostTarget, ServerSettings } from '@archipelia/model';

type HostKind = HostTarget['kind'];

type RowText = { label: string; description: string; hint: string; keywords?: string };

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

type HostRowsInput = {
  host: HostTarget;
  serverOptions: SelectOption[];
  hasPassword: boolean;
  room: ReactNode;
  onHostKind: (kind: HostKind) => void;
  onPort: (port: number) => void;
  onRemoteServer: (serverId: string) => void;
};

export type { HostKind, HostRowsInput, RowText, ServerOptionsFormProps };
