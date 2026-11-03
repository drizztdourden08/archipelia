/* @layer renderer-app @kind logic */
import type { Endpoint } from '@archipelia/model';
import { addressText } from '../../../lobbies/address-text';

const addressOf = (endpoint: Endpoint | undefined) => (endpoint ? addressText(endpoint.host, endpoint.port) : null);

export { addressOf };
