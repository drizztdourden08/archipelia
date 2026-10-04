/* @layer renderer-app @kind hook */
import { requireHostApi, useKeyedGuard, usePlatform } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useState } from 'react';
import type { StorageSummary } from '@drizztdourden08/brock-core/platform';
import { useRunsStore } from '../../../stores/useRunsStore';
import { olderThan } from './old-runs';
import { CLEAN_DAYS, EXPORT_NAME } from '../DataView.constants';
import { appApi } from '../../../ipc/app-api';
import { lastGuardError } from '../../../keyed-guard/last-guard-error';

const useDataView = () => {
  const { filePicker } = usePlatform();
  const { runs, load, remove } = useRunsStore();
  const [summary, setSummary] = useState<StorageSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const guarded = useKeyedGuard();
  const { guard: keyed, isBusy, clearError } = guarded;

  const loadSummary = useCallback(async () => {
    setSummaryError(null);
    try {
      setSummary(await requireHostApi().getStorageSummary());
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadSummary();
    await load();
  }, [load, loadSummary]);

  useEffect(() => { void refresh(); }, [refresh]);

  const guard = useCallback((key: string, work: () => Promise<string | null>) => keyed(key, async () => {
    const result = await work();
    clearError();
    setMessage(result);
    await refresh();
  }), [clearError, keyed, refresh]);

  const stale = olderThan(runs, CLEAN_DAYS, Date.now());
  const reveal = useCallback(() => { void requireHostApi().revealDataFolder(); }, []);
  const retrySummary = useCallback(() => { void loadSummary(); }, [loadSummary]);
  const clean = useCallback(() => guard('clean', async () => {
    for (const run of stale) await remove(run.id);
    return `${stale.length} old runs removed`;
  }), [guard, remove, stale]);
  const exportLibrary = useCallback(() => guard('export', async () => {
    const result = await filePicker.saveFile({ name: EXPORT_NAME, bytes: await appApi().dataExport(), extensions: ['zip'] });
    return result.saved ? `Saved ${result.name ?? EXPORT_NAME}` : result.error ?? null;
  }), [guard, filePicker]);
  const importLibrary = useCallback(() => guard('import', async () => {
    const picked = await filePicker.pickFile({ extensions: ['zip'] });
    if (!picked) return null;
    const counts = await appApi().dataImport(picked.bytes);
    return `Imported ${counts.presets} presets and ${counts.templates} templates`;
  }), [guard, filePicker]);

  return { busy: isBusy(), clean, exportLibrary, importLibrary, message: lastGuardError(guarded) ?? message, retrySummary, reveal, runs, stale, summary, summaryError };
};

export { useDataView };
