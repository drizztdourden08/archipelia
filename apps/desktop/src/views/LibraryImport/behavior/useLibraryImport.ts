/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { usePlatform } from '@drizztdourden08/brock-react';
import { useDataAction } from '../../../hooks/useDataAction';
import { appApi } from '../../../ipc/app-api';

const useLibraryImport = () => {
  const { filePicker } = usePlatform();
  const { busy, message, run } = useDataAction();

  const importLibrary = useCallback(() => run('import', async () => {
    const picked = await filePicker.pickFile({ extensions: ['zip'] });
    if (!picked) return null;
    const counts = await appApi().dataImport(picked.bytes);
    return `Imported ${counts.presets} presets and ${counts.templates} templates`;
  }), [filePicker, run]);

  return { busy, importLibrary, message };
};

export { useLibraryImport };
