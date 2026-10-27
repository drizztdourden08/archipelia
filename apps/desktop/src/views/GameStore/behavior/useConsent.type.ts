/* @layer renderer-app @kind types */
import type { ConsentPackage, ConsentWheel } from '@archipelia/design';

type PendingConsent = { title: string; packages: readonly ConsentPackage[]; wheels: readonly ConsentWheel[] };

type AskConsent = (title: string, packages: readonly ConsentPackage[], wheels?: readonly ConsentWheel[]) => Promise<boolean>;

type UseConsent = { ask: AskConsent; accept: () => void; cancel: () => void; pending: PendingConsent | null };

export type { AskConsent, PendingConsent, UseConsent };
