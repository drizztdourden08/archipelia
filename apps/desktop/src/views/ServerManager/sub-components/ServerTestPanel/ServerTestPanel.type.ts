/* @layer renderer-app @kind types */
import type { ServerTestResult } from '../../../../ipc/contract.type';

type ServerTestPanelProps = { test: ServerTestResult | null; pinned?: string; busy: boolean; onTrust: (sha: string) => void };

export type { ServerTestPanelProps };
