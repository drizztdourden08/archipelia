/* @layer core @kind logic */
import type { Session } from '@archipelia/model';
import type { ServiceDeps } from './service-deps.type';

const roomPasswordOf = async ({ resolveSecret }: Pick<ServiceDeps, 'resolveSecret'>, { snapshot }: Session) => {
  const { passwordRef } = snapshot.server;
  if (!passwordRef) return undefined;
  const password = await resolveSecret(passwordRef);
  if (!password) throw new Error('the room password is missing from the vault');
  return password;
};

export { roomPasswordOf };
