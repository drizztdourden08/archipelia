/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import type { GameCardAction } from '../GameCard.type';

const actionOf = (action: GameCardAction): ActionItem => ({
  id: action.id,
  label: action.label,
  icon: action.icon,
  iconOnly: true,
  kind: action.primary ? 'primary' : action.tone ?? 'default',
  disabled: action.disabled === true || action.loading === true,
  onSelect: action.onClick,
});

export { actionOf };
