/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button } from '@drizztdourden08/tessera/primitives';
import type { WidgetToggleProps } from './WidgetToggle.type';

const WidgetToggle = ({ id, label, visible, onToggle }: WidgetToggleProps) => {
  const toggle = useCallback(() => onToggle(id), [id, onToggle]);
  return <Button size="sm" variant="tertiary" active={visible} aria-pressed={visible} onClick={toggle}>{label}</Button>;
};

export { WidgetToggle };
