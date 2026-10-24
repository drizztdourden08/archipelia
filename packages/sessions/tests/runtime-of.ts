/* @layer tests @kind test */
import type { EngineRuntime } from '@archipelia/model';

const runtimeOf = (id: string, apVersion: string): EngineRuntime => ({
  id, apVersion, apCommit: 'c', pythonVersion: '3.12.15', root: `/e/${id}`, python: '', generate: '', multiServer: '', schemaScript: '',
});

export { runtimeOf };
