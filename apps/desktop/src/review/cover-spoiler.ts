/* @layer renderer-app @kind logic */
import { useWidgetPrefStore } from '@drizztdourden08/brock-react';
import { SPOILER_SHOWN_PREFIX, SPOILER_WIDGET_ID } from './spoiler-pref.constants';

const coverSpoiler = (): void => {
  const store = useWidgetPrefStore.getState();
  const prefs = store.byWidget[SPOILER_WIDGET_ID] ?? {};
  const kept = Object.fromEntries(Object.entries(prefs).filter(([key]) => !key.startsWith(SPOILER_SHOWN_PREFIX)));
  store.replaceWidget(SPOILER_WIDGET_ID, kept);
};

export { coverSpoiler };
