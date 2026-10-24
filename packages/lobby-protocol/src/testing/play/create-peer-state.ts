/* @layer testing @kind logic */
import type { Transport, TransportEvent } from '../../node/transport/transport.type';
import type { PeerState } from './play.type';
import { DEFAULT_LIMITS } from '../../protocol/protocol.constants';
import { createQueue } from './create-queue';

const createPeerState = (transport: Transport, timeoutMs: number): PeerState => {
  const inbox = createQueue<TransportEvent>(timeoutMs, 'the other side');
  transport.listen(inbox.push);
  return {
    transport,
    inbox,
    welcomed: false,
    maxBytes: DEFAULT_LIMITS.maxMessageBytes,
    chunkBytes: DEFAULT_LIMITS.chunkBytes,
  };
};

export { createPeerState };
