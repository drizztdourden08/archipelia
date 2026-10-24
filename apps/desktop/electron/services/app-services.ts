/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { embedServer, lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { startCore } from '@archipelia/server';
import type { Core, CoreDomains, CoreEvent } from '@archipelia/server';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const lanHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const forward = (ctx: MainContext, { kind, event }: CoreEvent) => {
  if (kind === 'engine') ctx.emit(APP_CHANNELS.onEngineEvent, event);
  else if (event.type === 'session' || event.type === 'log') ctx.emit(APP_CHANNELS.onSessionEvent, event);
};

const createAppServices = async (ctx: MainContext) => {
  const secrets = getSecrets(ctx);
  let core: Core | undefined;
  await embedServer<CoreDomains>((host) => {
    const started = startCore(host, {
      job: ctx.job,
      emit: (event) => forward(ctx, event),
      secrets,
      network: { automation: ctx.flags.isAutomationLaunch(), lanHost },
    });
    core = started.core;
    return started;
  }, ctx, { domains: () => ctx.storage });
  if (!core) throw new Error('the embedded core did not start');
  return { ...core, secrets };
};

export { createAppServices };
