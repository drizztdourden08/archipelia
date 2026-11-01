/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import type { LobbySeatGridProps } from './LobbySeatGrid.type';
import './LobbySeatGrid.css';

const LobbySeatGrid = ({ label, addLabel, addDisabled, onAdd, children }: LobbySeatGridProps) => (
  <Box role="group" aria-label={label} className="lobby-seat-grid">
    {children}
    <Pressable className="lobby-seat-grid__add" disabled={addDisabled} onClick={onAdd}>
      <Box as="span" className="lobby-seat-grid__plus"><Icon name="plus" /></Box>
      <Text as="span" className="lobby-seat-grid__label">{addLabel}</Text>
    </Pressable>
  </Box>
);

export { LobbySeatGrid };
