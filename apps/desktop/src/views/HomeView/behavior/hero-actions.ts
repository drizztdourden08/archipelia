/* @layer renderer-app @kind logic */
import type { HeroAction, HeroActionsInput } from '../HomeView.type';
import { NEW_SESSION, OPEN_SESSIONS, STEP_TEXT } from '../HomeView.constants';

const againOf = ({ last, busy, engineNeeded }: HeroActionsInput, primary: boolean): HeroAction[] =>
  (last ? [{ id: 'again', label: `Run "${last.snapshot.name}" again`, primary, disabled: busy || engineNeeded }] : []);

const heroActions = (input: HeroActionsInput): HeroAction[] => {
  const { engineNeeded, next, last } = input;
  if (engineNeeded) return [{ id: 'engine', label: STEP_TEXT.engine.action, primary: true }, NEW_SESSION, ...againOf(input, false)];
  if (last) return [...againOf(input, true), NEW_SESSION];
  const step = next ? { id: next.id, label: next.action, primary: true } : { id: 'sessions', label: OPEN_SESSIONS, primary: true };
  return step.id === 'session' ? [step] : [step, NEW_SESSION];
};

export { heroActions };
