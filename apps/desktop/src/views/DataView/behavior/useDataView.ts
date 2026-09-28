/* @layer renderer-app @kind hook */
import { requireHostApi, usePlatform } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useState } from 'react';
import type { StorageSummary } from '@drizztdourden08/brock-core/platform';
import { useRunsStore } from '../../../state/useRunsStore';
import { olderThan } from './old-runs';
import { CLEAN_DAYS, EXPORT_NAME } from '../DataView.constants';
import { archipeliaApi } from '../../../ipc/archipelia-api';

const useDataView = () => {
  const { filePicker } = usePlatform();
  const { runs, load, remove } = useRunsStore();
  const [summary, setSummary] = useState<StorageSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setSummary(await requireHostApi().getStorageSummary());
    await load();
  }, [load]);

  useEffect(() => { void refresh(); }, [refresh]);

  const guard = useCallback(async (work: () => Promise<string | null>) => {
    setBusy(true);
    try {
      setMessage(await work());
      await refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const stale = olderThan(runs, CLEAN_DAYS, Date.now());
  const reveal = useCallback(() => { void requireHostApi().revealDataFolder(); }, []);
  const clean = useCallback(() => guard(async () => {
    for (const run of stale) await remove(run.id);
    return `${stale.length} old runs removed`;
  }), [guard, remove, stale]);
  const exportLibrary = useCallback(() => guard(async () => {
    const result = await filePicker.saveFile({ name: EXPORT_NAME, bytes: await archipeliaApi().dataExport(), extensions: ['zip'] });
    return result.saved ? `Saved ${result.name ?? EXPORT_NAME}` : result.error ?? null;
  }), [guard, filePicker]);
  const importLibrary = useCallback(() => guard(async () => {
    const picked = await filePicker.pickFile({ extensions: ['zip'] });
    if (!picked) return null;
    const counts = await archipeliaApi().dataImport(picked.bytes);
    return `Imported ${counts.presets} presets and ${counts.templates} templates`;
  }), [guard, filePicker]);

  return { busy, clean, exportLibrary, importLibrary, message, reveal, runs, stale, summary };
};

export { useDataView };
