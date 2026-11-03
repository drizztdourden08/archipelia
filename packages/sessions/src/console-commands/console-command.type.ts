/* @layer core @kind types */
type ConsoleGroup = 'Players' | 'Items and hints' | 'Room' | 'Server';

type ConsoleParamKind = 'text' | 'number' | 'choice' | 'boolean';

type ConsoleParamSource = 'players' | 'items' | 'locations' | 'options';

type ConsoleParam = {
  name: string;
  label: string;
  kind: ConsoleParamKind;
  source?: ConsoleParamSource;
  options?: readonly string[];
  optional?: boolean;
  placeholder?: string;
  dependsOn?: string;
  min?: number;
  max?: number;
};

type ConsoleValue = string | number | boolean | undefined;

type ConsoleValues = Readonly<Record<string, ConsoleValue>>;

type ConsoleCommand = {
  id: string;
  label: string;
  icon: string;
  group: ConsoleGroup;
  description: string;
  confirm?: boolean;
  params: readonly ConsoleParam[];
  format: (values: ConsoleValues) => string;
};

type ServerOption = {
  name: string;
  kind: ConsoleParamKind;
  options?: readonly string[];
};

export type { ConsoleCommand, ConsoleGroup, ConsoleParam, ConsoleParamKind, ConsoleParamSource, ConsoleValue, ConsoleValues, ServerOption };
