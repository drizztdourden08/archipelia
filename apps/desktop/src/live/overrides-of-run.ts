/* @layer renderer-app @kind logic */
import type { DirectConnection, GeneratorSettings, Session } from '@archipelia/model';
import type { RunnableServerSettings, SessionOverrides } from './live.type';

const generatorOf = ({ spoiler, race, progressionBalancing }: GeneratorSettings): GeneratorSettings => ({ spoiler, race, progressionBalancing });

const serverOf = ({ hintCost, releaseMode, collectMode, remainingMode, autoShutdownMinutes }: Session['snapshot']['server']): RunnableServerSettings =>
  ({ hintCost, releaseMode, collectMode, remainingMode, autoShutdownMinutes });

const directOf = (direct: DirectConnection | undefined): DirectConnection | null =>
  (direct ? { admission: direct.admission, allowUnlisted: direct.allowUnlisted } : null);

const overridesOfRun = ({ snapshot }: Pick<Session, 'snapshot'>): SessionOverrides => ({
  players: snapshot.players,
  ...(snapshot.lan === undefined ? {} : { lan: snapshot.lan }),
  direct: directOf(snapshot.direct),
  server: serverOf(snapshot.server),
  generator: generatorOf(snapshot.generator),
});

export { overridesOfRun };
