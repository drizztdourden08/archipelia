/* @layer electron-main @kind logic */
import type { LobbyServerTest } from '../../../src/lobbies/lobbies.type';
import { parseServerUrl } from '../../../src/lobbies/parse-server-url';
import type { RemoteOptions } from '../lobbies.type';
import { openRemoteChannel } from './open-remote-channel';
import { probeCertificate } from './probe-certificate';
import { CERTIFICATE_PROBLEMS, CHANGED, UNTRUSTED } from './remote.constants';

const codeOf = (error: unknown): string => (error instanceof Error && 'code' in error ? String(error.code) : '');

const pinnedSha256 = (error: unknown): string | undefined => {
  const seen = error instanceof Error && 'sha256' in error ? error.sha256 : undefined;
  return typeof seen === 'string' ? seen : undefined;
};

const certificateFailure = async (options: RemoteOptions, error: unknown): Promise<LobbyServerTest | null> => {
  const target = parseServerUrl(options.url);
  const mismatch = pinnedSha256(error);
  if (mismatch) return { ok: false, message: CHANGED, certSha256: mismatch };
  if (!target?.secure || !CERTIFICATE_PROBLEMS.includes(codeOf(error))) return null;
  const certSha256 = await probeCertificate(target).catch(() => undefined);
  return certSha256 ? { ok: false, message: UNTRUSTED, certSha256 } : null;
};

const testRemoteServer = async (options: RemoteOptions): Promise<LobbyServerTest> => {
  try {
    const { channel, info } = await openRemoteChannel(options);
    channel.close();
    return { ok: true, message: `Connected to ${info.name} ${info.version}.`, info };
  } catch (error) {
    return (await certificateFailure(options, error)) ?? { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
};

export { testRemoteServer };
