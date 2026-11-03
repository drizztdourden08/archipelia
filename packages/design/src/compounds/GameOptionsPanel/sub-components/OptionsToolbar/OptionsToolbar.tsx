/* @layer renderer-app @kind component */
import { Box, Button, SearchInput } from '@drizztdourden08/tessera/primitives';
import type { OptionsToolbarProps } from './OptionsToolbar.type';
import { RESET_ALL_LABEL, SEARCH_LABEL } from '../../GameOptionsPanel.constants';

const OptionsToolbar = ({ query, onQueryChange, onResetAll, extra }: OptionsToolbarProps) => (
  <Box className="game-options-toolbar">
    <SearchInput
      className="game-options-toolbar__search"
      value={query}
      onChange={onQueryChange}
      placeholder={SEARCH_LABEL}
      aria-label={SEARCH_LABEL}
    />
    {onResetAll && <Button size="sm" variant="ghost" onClick={onResetAll}>{RESET_ALL_LABEL}</Button>}
    {extra}
  </Box>
);

export { OptionsToolbar };
