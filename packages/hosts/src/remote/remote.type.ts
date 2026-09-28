/* @layer core @kind types */
import type { ServerEntry } from '@archipelia/model';

type RemoteCredentials = { privateKey?: Buffer; passphrase?: string; password?: string };

type HostKeyPrompt = (sha256: string) => boolean | Promise<boolean>;

type ExecResult = { code: number | null; stdout: string; stderr: string };

type StreamHandle = { done: Promise<number | null>; close: () => void };

interface SshSession {
  exec: (command: string) => Promise<ExecResult>;
  stream: (command: string, onLine: (line: string) => void) => Promise<StreamHandle>;
  upload: (localPath: string, remotePath: string) => Promise<void>;
  writeFile: (remotePath: string, data: string, mode: number) => Promise<void>;
  isOpen: () => boolean;
  end: () => void;
}

type SshTarget = { entry: ServerEntry; credentials: RemoteCredentials; onHostKey: HostKeyPrompt };

type SshConnect = (target: SshTarget) => Promise<SshSession>;

type RemoteHostOptions = SshTarget & { connect?: SshConnect; hostingTimeoutMs?: number; stopWaitSeconds?: number };

type ServerTestOptions = { onHostKey?: HostKeyPrompt; connect?: SshConnect; apVersion?: string };

export type {
  ExecResult, HostKeyPrompt, RemoteCredentials, RemoteHostOptions, ServerTestOptions, SshConnect, SshSession, SshTarget, StreamHandle,
};
