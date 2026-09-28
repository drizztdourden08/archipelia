/* @layer renderer-app @kind logic */
import type { Endpoint } from '@archipelia/model';

const addressOf = (endpoint: Endpoint | undefined) => (endpoint ? `${endpoint.host}:${endpoint.port}` : null);

export { addressOf };
