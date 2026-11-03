/* @layer renderer-app @kind types */
type SessionTitleProps = {
  name: string;
  stored: boolean;
  onName: (name: string) => void;
};

export type { SessionTitleProps };
