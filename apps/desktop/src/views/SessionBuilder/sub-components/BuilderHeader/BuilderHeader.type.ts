/* @layer renderer-app @kind types */
type BuilderHeaderProps = {
  name: string;
  saved: boolean;
  busy: boolean;
  onName: (name: string) => void;
  onSave: () => void;
  onRun: () => void;
};

export type { BuilderHeaderProps };
