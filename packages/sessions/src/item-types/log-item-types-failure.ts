/* @layer core @kind logic */
import type { SessionOutput } from '@archipelia/model';
import type { ServiceDeps } from '../service/service-deps.type';

const logItemTypesFailure = async (deps: ServiceDeps, sessionId: string, output: SessionOutput, error: unknown) => {
  const line = `Warning: the item types file was not written: ${error instanceof Error ? error.message : String(error)}`;
  deps.emit({ type: 'generate', sessionId, line });
  const logPath = `${sessionId}/${output.generateLog}`;
  const previous = (await deps.files.readText(logPath).catch(() => null)) ?? '';
  await deps.files.writeText(logPath, previous ? `${previous}\n${line}` : line).catch(() => undefined);
};

export { logItemTypesFailure };
