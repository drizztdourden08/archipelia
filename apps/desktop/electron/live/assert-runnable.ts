/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { validatePlayers } from '../../src/views/SessionLobby/behavior/validate-players';
import { assertStartable } from './assert-startable';
import { LIVE_TEXT } from './live.constants';
import type { LibraryView } from './live.type';

const assertRunnable = (template: SessionTemplate, library: LibraryView): void => {
  assertStartable(template);
  const [first] = validatePlayers(template, library);
  if (first) throw new Error(LIVE_TEXT.problems(first.message));
};

export { assertRunnable };
