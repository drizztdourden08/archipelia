/* @layer core @kind logic */
import type { SandboxRunner } from './sandbox.type';

const noSandbox = (reason: string): SandboxRunner => ({ mode: 'none', reason, confine: () => undefined });

export { noSandbox };
