/* @layer renderer-app @kind types */
import type { ConsentPackage, ConsentWheel } from '@archipelia/design';

type PendingConsent = { title: string; packages: readonly ConsentPackage[]; wheels: readonly ConsentWheel[] };

type AskConsent = (title: string, packages: readonly ConsentPackage[], wheels?: readonly ConsentWheel[]) => Promise<boolean>;

export type { AskConsent, PendingConsent };
