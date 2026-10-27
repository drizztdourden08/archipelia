/* @layer renderer-app @kind logic */
import type { Session, SessionTemplate } from '@archipelia/model';

const savedSessionOf = (templates: readonly SessionTemplate[], run: Session): SessionTemplate | undefined =>
  templates.find((template) => run.source?.match === 'recorded' && template.id === run.source.sessionId)
  ?? templates.find((template) => template.id === run.templateId)
  ?? templates.find((template) => run.lobbyId !== undefined && template.lobby?.lobbyId === run.lobbyId)
  ?? templates.find((template) => template.name === run.snapshot.name);

export { savedSessionOf };
