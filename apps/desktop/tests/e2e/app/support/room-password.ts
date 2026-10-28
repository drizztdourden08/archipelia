/* @layer tests @kind helper */
import type { LaunchedApp } from './launched-app.type';

const roomPasswordOf = (launched: LaunchedApp, name: string): Promise<string> =>
  launched.page.evaluate(async (runName) => {
    const api: unknown = Reflect.get(window, 'api');
    const field = (value: unknown, key: string): unknown => (typeof value === 'object' && value !== null ? Reflect.get(value, key) : undefined);
    const call = (method: string, ...args: string[]): Promise<unknown> => {
      const fn = field(api, method);
      if (typeof fn !== 'function') throw new Error(`window.api has no ${method}`);
      return Promise.resolve(Reflect.apply(fn, api, args));
    };
    const runs = await call('sessionsList');
    const found = Array.isArray(runs)
      ? runs.find((entry: unknown) => field(entry, 'status') === 'hosting' && field(field(entry, 'snapshot'), 'name') === runName)
      : undefined;
    const id = field(found, 'id');
    if (typeof id !== 'string') throw new Error(`no hosting run named ${runName}`);
    const password = await call('sessionsRoomPassword', id);
    return typeof password === 'string' ? password : '';
  }, name);

export { roomPasswordOf };
