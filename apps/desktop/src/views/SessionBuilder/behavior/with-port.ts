/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';
import { DEFAULT_PORT } from '../SessionBuilder.constants';

const withPort = (current: HostTarget, port: number): HostTarget =>
  (current.kind === 'local' ? { kind: 'local', port: Number.isFinite(port) ? Math.round(port) : DEFAULT_PORT } : current);

export { withPort };
