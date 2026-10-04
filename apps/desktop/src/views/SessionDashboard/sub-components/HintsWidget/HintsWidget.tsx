/* @layer renderer-app @kind component */
import type { HintsWidgetProps } from './HintsWidget.type';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { HintsPanel } from '../HintsPanel';

const HintsWidget = ({ session, lines }: HintsWidgetProps) => {
  const { hints, phase, error, submitPassword, retry } = useLiveRoom(session, lines);
  return <HintsPanel rows={hints} phase={phase} error={error} onPassword={submitPassword} onRetry={retry} />;
};

export { HintsWidget };
