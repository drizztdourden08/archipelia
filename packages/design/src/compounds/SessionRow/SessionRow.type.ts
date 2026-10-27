/* @layer renderer-app @kind types */
type SessionRowProps = {
  id: string;
  name: string;
  meta: string;
  playersLabel: string;
  historyLabel: string;
  busy?: boolean;
  onEdit: (id: string) => void;
  onStart: (id: string) => void;
  onHistory: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionRowProps };
