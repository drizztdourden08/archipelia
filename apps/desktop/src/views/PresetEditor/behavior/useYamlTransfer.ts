/* @layer renderer-app @kind hook */
import { usePlatform } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import type { TransferParams } from '../PresetEditor.type';
import { YAML_PICK, YAML_SAVE } from '../PresetEditor.constants';
import { importPlayerYaml } from './import-player-yaml';
import { importSummary } from './import-summary';
import { exportPlayerYaml } from './export-player-yaml';
import { yamlFileName } from './yaml-file-name';

const useYamlTransfer = ({ schema, name, values, replaceValues, report }: TransferParams) => {
  const { filePicker } = usePlatform();

  const importYaml = useCallback(async () => {
    try {
      const picked = await filePicker.pickFile({ extensions: YAML_PICK });
      if (!picked) return;
      const imported = importPlayerYaml(new TextDecoder().decode(picked.bytes), schema);
      replaceValues(imported.values);
      report({ tone: 'info', text: importSummary(picked.name, Object.keys(imported.values).length, imported.skipped) });
    } catch (err) {
      report({ tone: 'error', text: (err as Error).message });
    }
  }, [filePicker, schema, replaceValues, report]);

  const exportYaml = useCallback(async () => {
    try {
      const bytes = new TextEncoder().encode(exportPlayerYaml(schema, values));
      const result = await filePicker.saveFile({ name: yamlFileName(name), bytes, extensions: YAML_SAVE });
      if (result.error) throw new Error(result.error);
      if (result.saved) report({ tone: 'info', text: `Exported ${result.name ?? yamlFileName(name)}.` });
    } catch (err) {
      report({ tone: 'error', text: (err as Error).message });
    }
  }, [filePicker, schema, values, name, report]);

  return { exportYaml, importYaml };
};

export { useYamlTransfer };
