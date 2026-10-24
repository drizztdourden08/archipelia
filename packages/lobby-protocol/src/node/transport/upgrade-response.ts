/* @layer protocol @kind logic */
import { createHash } from 'node:crypto';
import { WEBSOCKET_GUID } from './websocket.constants';

const upgradeResponse = (key: string): string => {
  const accept = createHash('sha1').update(key + WEBSOCKET_GUID).digest('base64');
  const lines = ['HTTP/1.1 101 Switching Protocols', 'Upgrade: websocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${accept}`];
  return `${lines.join('\r\n')}\r\n\r\n`;
};

export { upgradeResponse };
