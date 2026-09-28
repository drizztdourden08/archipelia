/* @layer renderer-app @kind hook */
import { gameOfYaml } from '@archipelia/sessions/players';
import { usePlatform } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import type { ImportedYaml } from '../SessionBuilder.type';
import { YAML_EXTENSIONS } from '../SessionBuilder.constants';

const readGame = (yaml: string) => {
  try {
    return gameOfYaml(yaml);
  } catch {
    return undefined;
  }
};

const useYamlImport = () => {
  const { filePicker } = usePlatform();
  return useCallback(async (): Promise<ImportedYaml | null> => {
    const picked = await filePicker.pickFile({ extensions: YAML_EXTENSIONS });
    if (!picked) return null;
    const yaml = new TextDecoder().decode(picked.bytes);
    const game = readGame(yaml);
    if (!game) throw new Error(`${picked.name} does not name one game, so it cannot be used as a player file`);
    return { fileName: picked.name, yaml, game };
  }, [filePicker]);
};

export { useYamlImport };
