/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { validatePlayers } from '@archipelia/sessions/validation';
import { assertStartable } from './assert-startable';
import { LIVE_TEXT } from './live.constants';
import type { LibraryView } from '@archipelia/sessions/validation';

const assertRunnable = (template: SessionTemplate, library: LibraryView): void => {
  assertStartable(template);
  const [first] = validatePlayers(template, library);
  if (first) throw new Error(LIVE_TEXT.problems(first.message));
};

export { assertRunnable };
