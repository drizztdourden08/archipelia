/* @layer renderer-app @kind logic */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { AskOptions, AskState } from './ask-store.type';
import { enrichKey } from './enrich-key';

const createAskStore = <T,>({ load, failed, again }: AskOptions<T>) =>
  createSessionStore<AskState<T>>((set, get) => {
    const settle = (key: string, found: T) => set((state) => ({
      found: { ...state.found, [key]: found },
      asked: again?.(found) ? Object.fromEntries(Object.entries(state.asked).filter(([name]) => name !== key)) : state.asked,
    }));
    return {
      asked: {},
      found: {},
      ask: (request) => {
        const key = enrichKey(request);
        if (get().asked[key]) return;
        set((state) => ({ asked: { ...state.asked, [key]: true } }));
        void load(request).then(
          (found) => { if (found) settle(key, found); },
          () => { if (failed) settle(key, failed); },
        );
      },
    };
  });

export { createAskStore };
