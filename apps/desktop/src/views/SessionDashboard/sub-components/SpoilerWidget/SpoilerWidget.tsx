/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Icon } from '@drizztdourden08/tessera/primitives';
import type { SpoilerWidgetProps } from './SpoilerWidget.type';
import { spoilerFileOf } from '../../behavior/spoiler-file-of';
import { SpoilerBoard } from './sub-components/SpoilerBoard';

const SpoilerWidget = ({ session }: SpoilerWidgetProps) => {
  const file = spoilerFileOf(session);
  const [shown, setShown] = useWidgetState(`shown:${session.id}`, false);
  const show = useCallback(() => setShown(true), [setShown]);
  const hide = useCallback(() => setShown(false), [setShown]);
  if (!file) return <EmptyState message="This session has no spoiler. Raise the spoiler level in the session to get one." />;
  if (!shown) {
    const action = <Button variant="secondary" icon={<Icon name="eye" />} onClick={show}>Show spoiler</Button>;
    return <EmptyState icon={<Icon name="eye-off" />} message="The spoiler is covered so it gives nothing away." action={action} />;
  }
  return <SpoilerBoard session={session} file={file} onHide={hide} />;
};

export { SpoilerWidget };
