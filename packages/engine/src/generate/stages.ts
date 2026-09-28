/* @layer core @kind logic */
import type { EngineProgress } from '@archipelia/model';
import type { StageRule } from './stages.type';
import { STAGE_RULES } from './stages.constants';

const toProgress = ({ stage, counts, detail }: StageRule, match: RegExpMatchArray): EngineProgress => {
  if (counts) return { stage, done: Number(match[1]), total: Number(match[2]) };
  if (detail) return { stage, detail: match[1]?.trim() };
  return { stage };
};

const matchStage = (line: string): EngineProgress | undefined => {
  for (const rule of STAGE_RULES) {
    const match = line.match(rule.pattern);
    if (match) return toProgress(rule, match);
  }
  return undefined;
};

export { matchStage };
