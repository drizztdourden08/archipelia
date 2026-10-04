/* @layer renderer-app @kind types */
type RoomPasswordProps = {
  password: string;
  hasPassword: boolean;
  onPassword: (value: string) => void;
  onClearPassword: () => void;
};

export type { RoomPasswordProps };
