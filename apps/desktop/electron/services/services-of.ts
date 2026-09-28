/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { createAppServices } from './app-services';
import type { AppServices } from './app-services.type';

const built = new WeakMap<MainContext, AppServices>();

const servicesOf = (ctx: MainContext): AppServices => {
  const existing = built.get(ctx);
  if (existing) return existing;
  const services = createAppServices(ctx);
  built.set(ctx, services);
  return services;
};

export { servicesOf };
