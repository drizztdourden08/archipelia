/* @layer renderer-app @kind types */
import type { ServerSettings } from '@archipelia/model';

type ServerFieldsProps = {
  server: ServerSettings;
  password: string;
  hasPassword: boolean;
  onServer: (patch: Partial<ServerSettings>) => void;
  onPassword: (value: string) => void;
  onClearPassword: () => void;
};

export type { ServerFieldsProps };
