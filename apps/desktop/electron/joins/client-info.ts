/* @layer electron-main @kind logic */
import type { ClientInfo } from '@drizztdourden08/archipelia-lobby-protocol';
import { CLIENT_ARCH, CLIENT_HOMEPAGE, CLIENT_ID, CLIENT_OS } from './joins.constants';

const clientInfo = (name: string, version: string, platform: string = process.platform, arch: string = process.arch): ClientInfo => ({
  id: CLIENT_ID, name, version, platform: { os: CLIENT_OS[platform] ?? 'other', arch: CLIENT_ARCH[arch] ?? 'other' }, homepage: CLIENT_HOMEPAGE,
});

export { clientInfo };
