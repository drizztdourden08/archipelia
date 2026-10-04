/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ChosenMascot } from '@drizztdourden08/tessera/brand';
import { Button, ButtonRow, EmptyState, Flex, Icon, Shortcut, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { ROUTE } from '../../../../hooks/app-navigation.constants';
import { openNewSession } from '../../../../hooks/open-new-session';
import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { reloadRuns } from '../../../../runs/reload-runs';
import { RUNS_FAILED } from '../../../../runs/runs.constants';
import type { IdleBaseProps } from './IdleBase.type';
import './IdleBase.css';

const IdleBase = ({ loaded, failed }: IdleBaseProps) => {
  const { open } = useAppNavigation();
  const openGames = useCallback(() => open(ROUTE.games), [open]);
  const openPresets = useCallback(() => open(ROUTE.presets), [open]);
  const actions = (
    <ButtonRow>
      <Button variant="primary" icon={<Icon name="plus" />} onClick={openNewSession}>New session</Button>
      <Button variant="secondary" icon={<Icon name="gamepad-2" />} onClick={openGames}>Games</Button>
      <Button variant="secondary" icon={<Icon name="sliders-horizontal" />} onClick={openPresets}>Presets</Button>
    </ButtonRow>
  );
  return (
    <Stack gap="lg" align="center" justify="center" className="idle-base">
      {failed && !loaded
        ? <Stack gap="md" align="center"><ErrorCallout message={RUNS_FAILED} onRetry={reloadRuns} />{actions}</Stack>
        : (
          <EmptyState
            icon={loaded ? <ChosenMascot mascot="pelago" animation="idle" loop size="xl" /> : <Spinner />}
            message={loaded ? 'No room is hosting right now.' : 'Loading runs'}
            action={actions}
          />
        )}
      <Flex gap="lg" align="center" justify="center" wrap>
        <Flex gap="xs" align="center"><Shortcut keys="esc" size="xs" /><Text variant="caption">Multiworld window</Text></Flex>
        <Flex gap="xs" align="center"><Shortcut keys={['ctrl', 'K']} size="xs" /><Text variant="caption">Search</Text></Flex>
      </Flex>
    </Stack>
  );
};

export { IdleBase };
