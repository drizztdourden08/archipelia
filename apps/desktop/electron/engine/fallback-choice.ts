/* @layer electron-main @kind logic */
import type { EngineChoice, InstalledEngine } from '@archipelia/model';
import { defaultChoice } from './default-choice';

const samePair = (a: Pick<EngineChoice, 'ap' | 'python'>, b: Pick<EngineChoice, 'ap' | 'python'>) => a.ap === b.ap && a.python === b.python;

const fallbackChoice = (failed: EngineChoice, active: InstalledEngine | undefined, target: string): EngineChoice | undefined => {
  const tested = defaultChoice(target);
  if (!tested || samePair(tested, failed) || (active && samePair(tested, active))) return undefined;
  return tested;
};

export { fallbackChoice };
