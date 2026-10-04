/* @layer renderer-app @kind types */
type CounterRowProps = {
  optionKey: string;
  name: string;
  count: number;
  onCount: (name: string, count: number) => void;
  onRemove: (name: string) => void;
  disabled?: boolean;
  labelId?: string;
};

export type { CounterRowProps };
