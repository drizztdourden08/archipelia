/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { TextState } from '../../../TextState';
import { useSpoilerLog } from '../../behavior/useSpoilerLog';
import { SpoilerLoaded } from '../SpoilerLoaded';
import type { SpoilerBoardProps } from './SpoilerBoard.type';

const SpoilerBoard = ({ session, file, onHide }: SpoilerBoardProps) => {
  const { text, log, types } = useSpoilerLog(session, file);
  if (text.loading || text.failed) return <TextState failed={text.failed} loadingLabel="Loading the spoiler" onRetry={text.retry} />;
  if (!log) return <EmptyState message="The spoiler file is empty or missing." />;
  return <SpoilerLoaded log={log} types={types} text={text.value ?? ''} onHide={onHide} />;
};

export { SpoilerBoard };
