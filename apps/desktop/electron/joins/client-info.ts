/* @layer electron-main @kind logic */
import type { ClientInfo } from '@drizztdourden08/archipelia-lobby-protocol';
import { CLIENT_HOMEPAGE, CLIENT_ID } from './joins.constants';

const OS: Record<string, ClientInfo['platform']['os']> = { win32: 'windows', darwin: 'macos', linux: 'linux', android: 'android' };

const ARCH: Record<string, ClientInfo['platform']['arch']> = { x64: 'x64', arm64: 'arm64' };

const clientInfo = (name: string, version: string, platform: string = process.platform, arch: string = process.arch): ClientInfo => ({
  id: CLIENT_ID, name, version, platform: { os: OS[platform] ?? 'other', arch: ARCH[arch] ?? 'other' }, homepage: CLIENT_HOMEPAGE,
});

export { clientInfo };
