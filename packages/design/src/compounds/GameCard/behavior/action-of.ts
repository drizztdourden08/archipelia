/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import type { GameCardAction } from '../GameCard.type';

const actionOf = (action: GameCardAction, title: string): ActionItem => ({
  id: action.id,
  label: action.label,
  nameSuffix: title,
  icon: action.icon,
  iconOnly: true,
  kind: action.primary ? 'primary' : action.tone ?? 'default',
  confirm: false,
  disabled: action.disabled,
  loading: action.loading,
  onSelect: action.onClick,
});

export { actionOf };
