/* @layer renderer-app @kind hook */
import { openExternal } from '@drizztdourden08/brock-react';
import type { GameRow } from '../GameStore.type';
import { rowKey } from './row-key';
import type { CardHandlersParams } from './useCardHandlers.type';
import { usePackageSource } from './usePackageSource';

const useCardHandlers = ({ store, setOpened }: CardHandlersParams) => {
  const source = usePackageSource({ needOf: store.needOf, installWorld: store.installWorld, ask: store.consent.ask });
  const handlers = {
    isBusy: store.isBusy,
    errorOf: store.errorOf,
    needOf: store.needOf,
    open: (row: GameRow) => setOpened(rowKey(row)),
    installWorld: store.installWorld,
    remove: store.remove,
    openHome: openExternal,
    getPackage: (row: GameRow) => { setOpened(null); source.open(row); },
  };
  return { handlers, sourceDialog: source.dialog };
};

export { useCardHandlers };
