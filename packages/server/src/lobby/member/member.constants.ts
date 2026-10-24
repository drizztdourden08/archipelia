/* @layer core @kind config */
import type { Failure, Hello } from '@drizztdourden08/archipelia-lobby-protocol';

const NORMAL_CLOSE = 1000;

const NO_FILE: Failure = { code: 'bad-message', message: 'No file of this player has this id.', field: 'fileId' };

const SLOT_RULES_HELLO: Omit<Hello, 'capabilities' | 'slots' | 'worlds'> = {
  type: 'hello',
  protocol: { name: 'archipelia-lobby', versions: [1] },
  lobby: { code: '' },
  client: { id: 'member', name: 'member', version: '0.0.0', platform: { os: 'other', arch: 'other' } },
  player: { displayName: 'member' },
  archipelago: { version: '0.0.0' },
};

export { NO_FILE, NORMAL_CLOSE, SLOT_RULES_HELLO };
