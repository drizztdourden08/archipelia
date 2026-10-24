/* @layer tests @kind test */
import { WORLD_URL, bytesResponse, routed } from './first-party.fixtures';

const createWorldFetch = (bytes: Uint8Array, routes: Record<string, () => Response>): typeof fetch =>
  routed({ [WORLD_URL]: () => bytesResponse(bytes), ...routes });

export { createWorldFetch };
