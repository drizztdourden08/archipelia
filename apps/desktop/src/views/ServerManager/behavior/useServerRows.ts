/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { confirmDelete } from '@drizztdourden08/brock-react';
import type { RowsOptions } from '../ServerManager.type';
import { NEW_SERVER } from '../ServerManager.constants';
import { appApi } from '../../../ipc/app-api';
import { listRows } from './list-rows';
import { newServerEntry } from './new-server-entry';
import { removeServer } from './remove-server';
import { removeServerConfirm } from './remove-server-confirm';

const useServerRows = ({ servers, editor, guard }: RowsOptions) => {
  const { draft, select, setDraft } = editor;
  const rows = useMemo(() => listRows(servers, draft), [servers, draft]);

  const pick = useCallback((id: string | null) => {
    const entry = servers.find((server) => server.id === id);
    if (id === null || entry) select(entry ?? null);
  }, [servers, select]);

  const create = useCallback((label: string, close: () => void) => {
    select({ ...newServerEntry(), label });
    close();
  }, [select]);

  const rename = useCallback((id: string, label: string) => {
    const entry = servers.find((server) => server.id === id);
    if (id === NEW_SERVER.id) setDraft((current) => current && { ...current, label });
    if (!entry) return;
    void guard('rename', async () => {
      await appApi().serversSave({ ...entry, label });
      setDraft((current) => (current?.id === id ? { ...current, label } : current));
    });
  }, [guard, servers, setDraft]);

  const removeRow = useCallback((id: string) => {
    if (id !== NEW_SERVER.id) void guard('remove', () => removeServer(id));
    if (id === NEW_SERVER.id || draft?.id === id) select(null);
  }, [draft, guard, select]);

  const remove = useCallback(() => {
    if (!draft?.id) return;
    const { id } = draft;
    void confirmDelete(removeServerConfirm(draft)).then((confirmed) => {
      if (confirmed) removeRow(id);
    });
  }, [draft, removeRow]);

  return { create, pick, remove, removeRow, rename, rows };
};

export { useServerRows };
