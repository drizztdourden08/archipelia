/* @layer renderer-app @kind component */
import type { HintsWidgetProps } from './HintsWidget.type';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { HintsPanel } from '../HintsPanel';

const HintsWidget = ({ session, lines }: HintsWidgetProps) => {
  const { hints, connection } = useLiveRoom(session, lines);
  return <HintsPanel rows={hints} connection={connection} />;
};

export { HintsWidget };
