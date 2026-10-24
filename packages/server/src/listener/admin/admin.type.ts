/* @layer core @kind types */
import type { AdminDeps } from '../listener.type';

type AdminHandler = (deps: AdminDeps, request: Record<string, unknown>) => Promise<unknown>;

type AdminReply = { type: 'admin.reply'; re?: number; ok: boolean; result?: unknown; error?: string };

export type { AdminHandler, AdminReply };
