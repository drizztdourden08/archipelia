/* @layer renderer-app @kind types */

type FocusState = {
  sessionId: string;
  focus: (sessionId: string) => void;
};

export type { FocusState };
