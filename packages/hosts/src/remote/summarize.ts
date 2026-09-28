/* @layer core @kind logic */
import type { ServerCheck, ServerTest } from '@archipelia/model';

const summarize = (checks: ServerCheck[], at = Date.now()): ServerTest => {
  const failed = checks.find((check) => !check.ok && !check.advisory);
  return { at, ok: !failed, message: failed ? failed.detail : 'the server is ready to host', checks };
};

export { summarize };
