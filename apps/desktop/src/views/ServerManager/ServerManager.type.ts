/* @layer renderer-app @kind types */
import type { ServerAuth, ServerEntry } from '@archipelia/model';

type SecretInputs = { password: string; passphrase: string };

type AuthKind = ServerAuth['kind'];

type DraftRule = { message: string; broken: (entry: ServerEntry, inputs: SecretInputs) => boolean };

export type { AuthKind, DraftRule, SecretInputs };
