/* @layer renderer-app @kind types */
type SessionRowProps = {
  id: string;
  name: string;
  meta: string;
  playersLabel: string;
  busy?: boolean;
  onEdit: (id: string) => void;
  onRun: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionRowProps };
