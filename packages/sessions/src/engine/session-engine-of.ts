/* @layer core @kind logic */
import type { EngineRuntime, SessionEngine } from '@archipelia/model';

const sessionEngineOf = (runtime: EngineRuntime): SessionEngine => ({
  id: runtime.id, ap: runtime.apVersion, python: runtime.pythonVersion,
});

export { sessionEngineOf };
