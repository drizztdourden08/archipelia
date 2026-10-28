/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, EmptyState, Flex, Icon, Shortcut, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ROUTE } from '../../../../hooks/app-navigation.constants';
import { openNewSession } from '../../../../hooks/open-new-session';
import { IDLE_TEXT } from '../../SessionTabs.constants';
import { IdleArt } from '../IdleArt';
import type { IdleBaseProps } from './IdleBase.type';
import './IdleBase.css';

const openSessions = (): void => nav.open(ROUTE.sessions);

const openJoin = (): void => nav.open(ROUTE.joinSession);

const IdleBase = ({ loaded }: IdleBaseProps) => {
  const actions = (
    <ButtonRow>
      <Button variant="primary" icon={<Icon name="layers" />} onClick={openSessions}>{IDLE_TEXT.sessions}</Button>
      <Button variant="secondary" icon={<Icon name="plus" />} onClick={openNewSession}>{IDLE_TEXT.newSession}</Button>
      <Button variant="secondary" icon={<Icon name="log-in" />} onClick={openJoin}>{IDLE_TEXT.join}</Button>
    </ButtonRow>
  );
  return (
    <Stack gap="lg" align="center" justify="center" className="idle-base">
      <IdleArt />
      <EmptyState icon={loaded ? undefined : <Spinner />} message={loaded ? IDLE_TEXT.none : IDLE_TEXT.loading} action={actions} />
      <Flex gap="lg" align="center" justify="center" wrap>
        <Flex gap="xs" align="center"><Shortcut keys="esc" size="xs" /><Text variant="caption">Multiworld window</Text></Flex>
        <Flex gap="xs" align="center"><Shortcut keys={['ctrl', 'K']} size="xs" /><Text variant="caption">Search</Text></Flex>
      </Flex>
    </Stack>
  );
};

export { IdleBase };
