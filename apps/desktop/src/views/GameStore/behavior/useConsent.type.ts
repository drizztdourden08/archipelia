/* @layer renderer-app @kind types */
import type { ConsentPackage } from '@archipelia/design';

type PendingConsent = { title: string; packages: readonly ConsentPackage[] };

export type { PendingConsent };
