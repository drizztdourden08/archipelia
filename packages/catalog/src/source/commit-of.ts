/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { COMMIT_SHA } from './source.constants';
import type { CommitFacts } from './source.type';

const commitOf = (body: unknown): CommitFacts | undefined => {
  if (!isRecord(body) || typeof body.sha !== 'string' || !COMMIT_SHA.test(body.sha)) return undefined;
  const committer = isRecord(body.commit) && isRecord(body.commit.committer) ? body.commit.committer.date : undefined;
  return { sha: body.sha, date: typeof committer === 'string' ? committer : undefined };
};

export { commitOf };
