/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { isStringList } from '@archipelia/model';
import type { InstallPackagesOptions } from '../packages/install-packages.type';
import { pipReason } from '../packages/pip-reason';
import { withPipDir } from '../packages/with-pip-dir';
import { runPython } from '../process/run-python';
import { MAX_TAGS, TAG_TRIPLE, TAGS_SCRIPT } from './wheel.constants';

const tagsOfLines = (lines: string[]): string[] => {
  const unreadable = new Error('The engine Python gave a wheel tag list Archipelia cannot read');
  let tags: unknown;
  try {
    tags = JSON.parse(lines.filter((line) => line.trim() !== '').at(-1) ?? '');
  } catch {
    throw unreadable;
  }
  if (!isStringList(tags) || tags.length === 0 || tags.length > MAX_TAGS || !tags.every((tag) => TAG_TRIPLE.test(tag))) throw unreadable;
  return tags;
};

const engineTags = (runtime: EngineRuntime, { signal, run = runPython }: InstallPackagesOptions = {}): Promise<string[]> =>
  withPipDir(async (dir) => {
    const { code, lines } = await run(runtime, { args: ['-I', '-c', TAGS_SCRIPT], cwd: dir, signal });
    if (code !== 0) throw new Error(`The engine Python did not list its wheel tags: ${pipReason(lines, code)}`);
    return tagsOfLines(lines);
  });

export { engineTags };
