/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import type { BuildRun } from '@archipelia/catalog';

const buildRunOf = (outcome: ProcessJobOutcome, lines: string[]): BuildRun => {
  switch (outcome.status) {
    case 'done':
      return { status: 'done', code: outcome.exitCode, lines };
    case 'cancelled':
      return { status: 'cancelled', code: outcome.exitCode, lines };
    case 'rejected':
      return { status: 'rejected', code: null, lines, error: outcome.error };
    case 'failed':
    case 'detached':
      return { status: 'failed', code: outcome.exitCode, lines: lines.length > 0 ? lines : outcome.tail, error: outcome.error };
  }
};

export { buildRunOf };
