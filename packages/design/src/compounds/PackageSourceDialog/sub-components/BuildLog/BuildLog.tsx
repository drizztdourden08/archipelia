/* @layer renderer-app @kind component */
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildLogProps } from '../../PackageSourceDialog.type';
import { LOG_HEIGHT } from './BuildLog.constants';

const BuildLog = ({ lines }: BuildLogProps) => (
  <LogPanel
    height={LOG_HEIGHT}
    rows={lines.map((message, index) => ({ id: String(index), gutter: '', tag: '', kind: 'info', message }))}
    emptyLabel={BUILD_TEXT.logEmpty}
    countLabel="lines"
  />
);

export { BuildLog };
