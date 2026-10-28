/* @layer tests @kind helper */
import type { LaunchedApp } from './launched-app.type';

type RunsApi = {
  sessionsList: () => Promise<{ id: string; status: string; snapshot: { name: string } }[]>;
  sessionsRoomPassword: (id: string) => Promise<string | null>;
};

const roomPasswordOf = (launched: LaunchedApp, name: string): Promise<string> =>
  launched.page.evaluate(async (runName) => {
    const api = (window as unknown as { api: RunsApi }).api;
    const run = (await api.sessionsList()).find((entry) => entry.snapshot.name === runName && entry.status === 'hosting');
    if (!run) throw new Error(`no hosting run named ${runName}`);
    return (await api.sessionsRoomPassword(run.id)) ?? '';
  }, name);

export { roomPasswordOf };
