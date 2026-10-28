/* @layer renderer-app @kind types */
type SessionPickState = {
  selectedId: string | null;
  dirty: boolean;
  select: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
};

export type { SessionPickState };
