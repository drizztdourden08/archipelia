/* @layer renderer-app @kind types */
import type { ServerAuth, ServerEntry } from '@archipelia/model';
import type { ServerTestResult } from '@archipelia/hosts';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { Dispatch, SetStateAction } from 'react';

type SecretInputs = { password: string; passphrase: string };

type AuthKind = ServerAuth['kind'];

type DraftField = 'label' | 'host' | 'port' | 'username' | 'keyPath' | 'password' | 'apPath' | 'gamePort';

type DraftRule = { field: DraftField; message: string; broken: (entry: ServerEntry, inputs: SecretInputs) => boolean };

type DraftProblem = { field: DraftField; message: string };

type FieldErrors = Partial<Record<DraftField, string>>;

type FailureKey = 'save' | 'test' | 'trust' | 'remove' | 'rename';

type ServerGuard = <T>(key: FailureKey, work: () => Promise<T>) => Promise<T | undefined>;

type SaveFacts = { saving: boolean; failed: boolean; dirty: boolean; saved: boolean };

type TestStatus = { tone: StatusTone; text: string };

type SetDraft = Dispatch<SetStateAction<ServerEntry | null>>;

type RowsEditor = { draft: ServerEntry | null; dirty: boolean; select: (entry: ServerEntry | null) => void; setDraft: SetDraft };

type RowsOptions = { servers: readonly ServerEntry[]; editor: RowsEditor; guard: ServerGuard };

type ChecksOptions = { draft: ServerEntry | null; guard: ServerGuard; setDraft: SetDraft; setTest: (test: ServerTestResult | null) => void };

export type {
  AuthKind, ChecksOptions, DraftField, DraftProblem, DraftRule, FailureKey, FieldErrors, RowsOptions, SaveFacts, SecretInputs, TestStatus,
};
