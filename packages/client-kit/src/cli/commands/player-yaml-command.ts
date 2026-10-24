/* @layer client-kit @kind logic */
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import type { PlayerYamlInput } from '../../yaml/player-yaml.type';
import { createKitError } from '../../errors/create-kit-error';
import { buildPlayerYaml } from '../../yaml/build-player-yaml';
import { parseOptionSchema } from '../../yaml/schema/parse-option-schema';
import { readJsonFile } from '../read-json-file';
import { requireValue } from '../require-value';
import { EXIT_OK } from '../cli.constants';
import { PLAYER_YAML_OPTIONS } from './player-yaml-command.constants';

const playerYamlCommand: Command = async (args, io) => {
  const { values } = parseArgs({ args: [...args], options: PLAYER_YAML_OPTIONS, allowPositionals: false });
  const input = await readJsonFile(resolve(io.cwd, requireValue(values.input, '--input')));
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw createKitError('usage', 'The --input file must hold one JSON object.');
  }
  const schema = values.schema === undefined ? undefined : parseOptionSchema(await readJsonFile(resolve(io.cwd, values.schema)));
  const yaml = buildPlayerYaml({
    ...(input as PlayerYamlInput),
    schema,
    allowUnknown: values['allow-unknown'],
    allowRoll: values['allow-roll'],
    withDefaults: values['with-defaults'],
  });
  if (values.out === undefined) io.out(yaml);
  else await writeFile(resolve(io.cwd, values.out), yaml);
  return EXIT_OK;
};

export { playerYamlCommand };
