/* @layer renderer-app @kind types */
type StatCardAction = { label: string; onClick: () => void; primary?: boolean };

type StatCardProps = {
  heading: string;
  value: string;
  meta?: string;
  action?: StatCardAction;
};

export type { StatCardProps };
