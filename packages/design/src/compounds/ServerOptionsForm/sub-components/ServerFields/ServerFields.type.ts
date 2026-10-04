/* @layer renderer-app @kind types */
import type { ServerSettings } from '@archipelia/model';

type ServerFieldsProps = {
  server: ServerSettings;
  onServer: (patch: Partial<ServerSettings>) => void;
};

export type { ServerFieldsProps };
