/* @layer server @kind logic */
import { VALUE_FLAGS } from './cli.constants';
import type { ParsedCommand } from './cli.type';

const parseCommand = (argv: readonly string[]): ParsedCommand => {
  const words: string[] = [];
  const flags: Record<string, string> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] ?? '';
    if (!arg.startsWith('--')) {
      words.push(arg);
      continue;
    }
    const [name = '', inline] = arg.slice(2).split(/=(.*)/s);
    const next = argv[index + 1];
    if (inline !== undefined) flags[name] = inline;
    else if (VALUE_FLAGS.includes(name) && next !== undefined && !next.startsWith('--')) {
      flags[name] = next;
      index += 1;
    } else flags[name] = '';
  }
  return { name: words[0] ?? 'start', words: words.slice(1), flags };
};

export { parseCommand };
