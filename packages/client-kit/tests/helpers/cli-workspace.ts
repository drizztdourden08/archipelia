/* @layer tests @kind helper */
import { join } from 'node:path';
import { ROTP_DATA, ROTP_GAME, ROTP_MODULE, ROTP_WORLD_FILES } from './rotp-world.constants';
import { makeTempDir } from './temp-dirs';
import { writeFiles } from './write-files';

const workspace = async (): Promise<string> => {
  const dir = await makeTempDir();
  await writeFiles(join(dir, ROTP_MODULE), ROTP_WORLD_FILES);
  await writeFiles(join(dir, 'generated'), { 'game.json': JSON.stringify(ROTP_DATA['game.json']) });
  return dir;
};

const BUILD: string[] = ['build-apworld', '--world', ROTP_MODULE, '--out', 'out/world.apworld', '--game', ROTP_GAME, '--world-version', '0.1.0', '--minimum-ap', '0.6.4', '--data', 'generated'];

export { BUILD, workspace };
