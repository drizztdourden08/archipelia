/* @layer core @kind logic */
import { once } from 'node:events';
import type { Client, ClientChannel, SFTPWrapper } from 'ssh2';
import { createLineSplitter } from './line-splitter';
import type { ExecResult, SshSession, StreamHandle } from './remote.type';

const openChannel = (client: Client, command: string) =>
  new Promise<ClientChannel>((resolve, reject) => {
    client.exec(command, (error, channel) => (error ? reject(error) : resolve(channel)));
  });

const exitCode = (channel: ClientChannel) => {
  let code: number | null = null;
  channel.on('exit', (value: number | null) => { code = value; });
  return once(channel, 'close').then(() => code);
};

const exec = async (client: Client, command: string): Promise<ExecResult> => {
  const channel = await openChannel(client, command);
  const out: Buffer[] = [];
  const err: Buffer[] = [];
  channel.on('data', (chunk: Buffer) => out.push(chunk));
  channel.stderr.on('data', (chunk: Buffer) => err.push(chunk));
  const code = await exitCode(channel);
  return { code, stdout: Buffer.concat(out).toString('utf8'), stderr: Buffer.concat(err).toString('utf8') };
};

const stream = async (client: Client, command: string, onLine: (line: string) => void): Promise<StreamHandle> => {
  const channel = await openChannel(client, command);
  channel.on('data', createLineSplitter(onLine));
  channel.stderr.on('data', createLineSplitter(onLine));
  return { done: exitCode(channel), close: () => channel.close() };
};

const sftpCall = (sftp: Promise<SFTPWrapper>, run: (s: SFTPWrapper, done: (error?: Error | null) => void) => void) =>
  sftp.then((s) => new Promise<void>((resolve, reject) => run(s, (error) => (error ? reject(error) : resolve()))));

const createClientSession = (client: Client, isOpen: () => boolean): SshSession => {
  let sftp: Promise<SFTPWrapper> | undefined;
  const openSftp = () => {
    sftp ??= new Promise<SFTPWrapper>((resolve, reject) => client.sftp((error, s) => (error ? reject(error) : resolve(s))));
    return sftp;
  };

  return {
    exec: (command) => exec(client, command),
    stream: (command, onLine) => stream(client, command, onLine),
    upload: (localPath, remotePath) => sftpCall(openSftp(), (s, done) => s.fastPut(localPath, remotePath, done)),
    writeFile: (remotePath, data, mode) => sftpCall(openSftp(), (s, done) => s.writeFile(remotePath, data, { mode }, done)),
    isOpen,
    end: () => client.end(),
  };
};

export { createClientSession };
