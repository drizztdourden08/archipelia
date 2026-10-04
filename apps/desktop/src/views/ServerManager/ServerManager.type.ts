/* @layer renderer-app @kind types */
import type { ServerAuth, ServerEntry } from '@archipelia/model';

type SecretInputs = { password: string; passphrase: string };

type AuthKind = ServerAuth['kind'];

type DraftField = 'label' | 'host' | 'port' | 'username' | 'keyPath' | 'password' | 'apPath' | 'gamePort';

type DraftRule = { field: DraftField; message: string; broken: (entry: ServerEntry, inputs: SecretInputs) => boolean };

type DraftProblem = { field: DraftField; message: string };

type FieldErrors = Partial<Record<DraftField, string>>;

export type { AuthKind, DraftField, DraftProblem, DraftRule, FieldErrors, SecretInputs };
