/* @layer client-kit @kind logic */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import type { Command } from '../cli.type';
import { writeReleaseFiles } from '../../node/write-release-files';
import { requireValue } from '../require-value';
import { EXIT_OK } from '../cli.constants';
import { RELEASE_FILES_OPTIONS } from './release-files-command.constants';

const pathOf = (cwd: string, value: string | undefined): string | undefined => (value === undefined ? undefined : resolve(cwd, value));

const releaseFilesCommand: Command = async (args, io) => {
  const { values } = parseArgs({ args: [...args], options: RELEASE_FILES_OPTIONS, allowPositionals: false });
  const result = await writeReleaseFiles({
    dir: resolve(io.cwd, requireValue(values.dir, '--dir')),
    module: values.module,
    direct: values.direct === true,
    thumbnail: pathOf(io.cwd, values.thumbnail),
    description: pathOf(io.cwd, values.description),
  });
  for (const warning of result.warnings) io.err(`archipelia-kit: warning: ${warning.message}\n`);
  const { manifestPath, thumbnailPath, descriptionPath, warnings } = result;
  io.out(`${JSON.stringify({ manifest: manifestPath, thumbnail: thumbnailPath, description: descriptionPath, warnings: warnings.map((warning) => warning.message) })}\n`);
  return EXIT_OK;
};

export { releaseFilesCommand };
