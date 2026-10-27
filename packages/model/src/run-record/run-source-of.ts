/* @layer core @kind logic */
import type { RunSource, Session, SessionTemplate } from '../session.type';
import { UNKNOWN_SOURCE_NAME } from './run-record.constants';

const sourceOfTemplate = (template: SessionTemplate, match: RunSource['match']): RunSource =>
  ({ sessionId: template.id, sessionName: template.name, overrides: [], match });

const runSourceOf = (run: Pick<Session, 'templateId' | 'lobbyId'> & { snapshot: { name: string } }, templates: readonly SessionTemplate[]): RunSource => {
  const recorded = templates.find((template) => template.id === run.templateId)
    ?? templates.find((template) => run.lobbyId !== undefined && template.lobby?.lobbyId === run.lobbyId);
  if (recorded) return sourceOfTemplate(recorded, 'recorded');
  const named = templates.find((template) => template.name === run.snapshot.name);
  return named ? sourceOfTemplate(named, 'name') : { sessionName: UNKNOWN_SOURCE_NAME, overrides: [], match: 'unknown' };
};

export { runSourceOf };
