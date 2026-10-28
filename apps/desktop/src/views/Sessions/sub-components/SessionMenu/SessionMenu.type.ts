/* @layer renderer-app @kind types */
type SessionMenuProps = {
  id: string;
  name: string;
  busy: boolean;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionMenuProps };
