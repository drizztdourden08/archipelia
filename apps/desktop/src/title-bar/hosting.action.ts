/* @layer renderer-app @kind config */
import { defineTitleBarItem } from '@drizztdourden08/brock-react';
import { useHostingStatus } from '../hooks/useHostingStatus';

export default defineTitleBarItem(useHostingStatus);
