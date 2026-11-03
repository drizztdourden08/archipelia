/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { parseItemTypes } from '@archipelia/sessions/spoiler';
import { appApi } from '../../../../../ipc/app-api';
import { logFailure } from '../../../../../hooks/log-failure';
import { useSessionText } from '../../../behavior/useSessionText';
import { ITEM_TYPES_FAILED } from '../SpoilerWidget.constants';
import { itemTypesFileOf } from './item-types-file-of';

const useItemTypes = (sessionId: string, file: string | null) => {
  const sidecar = itemTypesFileOf(file);
  const [ready, setReady] = useState<string | null>(null);
  useEffect(() => {
    if (!sidecar) return undefined;
    let alive = true;
    appApi()
      .sessionsItemTypes(sessionId)
      .then((exists) => { if (alive && exists) setReady(sidecar); })
      .catch((err: unknown) => logFailure(ITEM_TYPES_FAILED, err));
    return () => { alive = false; };
  }, [sessionId, sidecar]);
  const text = useSessionText(sessionId, ready === sidecar ? sidecar : null);
  return useMemo(() => parseItemTypes(text.value), [text.value]);
};

export { useItemTypes };
