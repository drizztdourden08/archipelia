/* @layer renderer-app @kind types */
type EngineActionsInput = {
  ready: boolean;
  building: boolean;
  setup: () => Promise<void>;
  refresh: () => Promise<void>;
};

export type { EngineActionsInput };
