/* @layer renderer-app @kind logic */
import type { Session, SessionTemplate } from '@archipelia/model';
import type { SourceLink } from '../History.type';
import { sourceNameOf } from './source-name';

const sourceLinkOf = (run: Session, templates: readonly SessionTemplate[]): SourceLink => {
  const id = run.source?.sessionId;
  return { name: sourceNameOf(run), sessionId: templates.some((template) => template.id === id) ? id ?? null : null };
};

export { sourceLinkOf };
