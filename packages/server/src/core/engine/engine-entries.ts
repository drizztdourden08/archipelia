/* @layer core @kind logic */
import { engineFolder, readEngineMeta } from '@archipelia/engine';
import type { EngineEntry, EngineStateFile, InstalledEngine, Session } from '@archipelia/model';
import { engineOfSession } from '@archipelia/sessions';
import type { EngineEnv } from '@archipelia/engine/install';

const usesEngine = (session: Session, engine: InstalledEngine) => {
  const used = engineOfSession(session);
  return used.id ? used.id === engine.id : used.ap === engine.ap && used.python === engine.python;
};

const engineEntries = async (env: EngineEnv, state: EngineStateFile): Promise<EngineEntry[]> => {
  const sessions = await env.sessions().catch((): Session[] => []);
  return Promise.all(state.installed.map(async (engine): Promise<EngineEntry> => {
    const [meta, bytes] = await Promise.all([
      readEngineMeta(engineFolder(env.root, engine.id)).catch(() => undefined),
      env.size(engine.id).catch(() => undefined),
    ]);
    const inUse = env.inUse(engine.id);
    return {
      ...engine,
      lastGood: engine.id === state.lastGood && engine.id !== state.active,
      packages: meta?.packages ?? [],
      rules: meta?.rules ?? [],
      sessions: sessions.filter((session) => usesEngine(session, engine)).length,
      ...(bytes === undefined ? {} : { bytes }),
      ...(inUse ? { inUse } : {}),
    };
  }));
};

export { engineEntries };
