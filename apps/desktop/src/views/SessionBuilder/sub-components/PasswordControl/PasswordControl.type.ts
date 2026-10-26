/* @layer renderer-app @kind types */
type PasswordControlProps = {
  password: string;
  hasPassword: boolean;
  onPassword: (value: string) => void;
  onClearPassword: () => void;
};

export type { PasswordControlProps };
