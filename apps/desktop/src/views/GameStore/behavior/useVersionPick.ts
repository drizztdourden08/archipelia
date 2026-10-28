/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { enrichKey } from '../../../stores/enrich-key';
import { useVersionsStore } from '../../../stores/useVersionsStore';
import type { GameRow } from '../GameStore.type';
import { isPickable } from './is-pickable';
import { versionPick } from './version-pick';
import type { VersionPickView } from './version-pick.type';

const useVersionPick = (row: GameRow): VersionPickView & { choose: (id: string) => void } => {
  const { apworld, source } = row.entry;
  const pickable = isPickable(row.entry);
  const list = useVersionsStore((state) => state.found[enrichKey({ apworld, source })]);
  const ask = useVersionsStore((state) => state.ask);
  const [picked, choose] = useState<string | undefined>();
  useEffect(() => { if (pickable) ask({ apworld, source }); }, [ask, apworld, source, pickable]);
  return { ...(pickable ? versionPick(row, list, picked) : {}), choose };
};

export { useVersionPick };
