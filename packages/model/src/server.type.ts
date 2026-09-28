/* @layer core @kind types */
type ServerAuth =
  | { kind: 'ssh-key'; username: string; keyPath: string; passphraseRef?: string }
  | { kind: 'ssh-password'; username: string; passwordRef: string };

type ServerCheckName = 'connect' | 'python' | 'multiserver' | 'ap-version' | 'game-port' | 'linger';

type ServerCheck = { name: ServerCheckName; ok: boolean; detail: string; advisory?: boolean };

type ServerTest = { at: number; ok: boolean; message: string; checks?: ServerCheck[] };

type ServerEntry = {
  id: string;
  label: string;
  host: string;
  port: number;
  auth: ServerAuth;
  gamePort: number;
  apPath: string;
  hostKeySha256?: string;
  lastTest?: ServerTest;
};

export type { ServerAuth, ServerCheck, ServerCheckName, ServerEntry, ServerTest };
