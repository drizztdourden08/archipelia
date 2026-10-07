/* @layer renderer-app @kind types */
type JsonShape = 'object' | 'array';

type JsonProblem = {
  message: string;
  line: number | undefined;
};

type JsonRead = { value: unknown; problem: null } | { value?: never; problem: JsonProblem };

type JsonText = {
  text: string;
  edit: (text: string) => void;
  problem: JsonProblem | null;
};

export type { JsonProblem, JsonRead, JsonShape, JsonText };
