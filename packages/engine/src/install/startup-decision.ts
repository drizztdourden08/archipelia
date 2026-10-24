/* @layer core @kind logic */
import { compareVersions, ENGINE_DEFAULTS, findActiveEngine, pickPythonBuild, versionLine } from '../index';
import type { ApRelease, EngineChoice, InstalledEngine, StartupDecision } from '@archipelia/model';
import { defaultChoice } from './default-choice';
import type { StartupInput } from './startup-decision.type';

const none = (): StartupDecision => ({ kind: 'none' });

const choiceFor = async ({ feed, rangeOf }: StartupInput, release: ApRelease, line: string | undefined): Promise<EngineChoice | undefined> => {
  const range = await rangeOf(release);
  const build = pickPythonBuild(feed.python, range, line);
  return build ? { ap: release.version, python: build.version, pythonRelease: build.release } : undefined;
};

const firstRun = async (input: StartupInput): Promise<StartupDecision> => {
  const newest = input.feed.releases[0];
  const tested = ENGINE_DEFAULTS.defaultPython[input.target]?.version;
  const latest = newest ? await choiceFor(input, newest, tested && versionLine(tested)) : undefined;
  const choice = latest ?? defaultChoice(input.target);
  return choice ? { kind: 'first-run', choice } : none();
};

const offerNewer = async (input: StartupInput, active: InstalledEngine): Promise<StartupDecision> => {
  const newest = input.feed.releases[0];
  if (!newest || compareVersions(newest.version, active.ap) <= 0) return none();
  const { offeredAp } = input.state;
  if (offeredAp && compareVersions(newest.version, offeredAp) <= 0) return none();
  const choice = await choiceFor(input, newest, versionLine(active.python));
  return choice ? { kind: 'offer', from: active.ap, to: newest.version, notesUrl: newest.notesUrl, choice } : none();
};

const startupDecision = (input: StartupInput): Promise<StartupDecision> => {
  const active = findActiveEngine(input.state);
  return active ? offerNewer(input, active) : firstRun(input);
};

export { startupDecision };
