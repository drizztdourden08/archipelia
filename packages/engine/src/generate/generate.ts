/* @layer core @kind logic */
import type { GenerateParams, GenerateResult } from './generate.type';
import { matchStage } from './stages';
import { runPython } from '../process/run-python';
import { apRoot } from '../runtime/ap-root';

const generateArgs = ({ runtime, playersDir, outDir, spoiler, race, skipBalancing, seed }: GenerateParams) => [
  runtime.generate, '--player_files_path', playersDir, '--outputpath', outDir, '--spoiler', String(spoiler),
  ...(race ? ['--race'] : []),
  ...(skipBalancing ? ['--skip_prog_balancing'] : []),
  ...(seed === undefined ? [] : ['--seed', String(seed)]),
];

const generate = async (params: GenerateParams): Promise<GenerateResult> => {
  const { runtime, settingsDir, onProgress, onLine: onRawLine, signal } = params;
  let zip: string | undefined;
  const onLine = (line: string) => {
    onRawLine?.(line);
    const progress = matchStage(line);
    if (!progress) return;
    if (progress.stage === 'archive') zip = progress.detail;
    onProgress?.(progress);
  };
  const { code, lines } = await runPython(runtime, { args: generateArgs(params), cwd: settingsDir ?? apRoot(runtime), onLine, signal });
  return { ok: code === 0 && zip !== undefined, zip, lines };
};

export { generate };
