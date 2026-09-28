/* @layer renderer-app @kind logic */
import type { ReactNode } from 'react';
import type { HubTab } from '@drizztdourden08/brock-react';

const hubTab = (id: string, label: string, render: () => ReactNode): HubTab => ({ id, label, render });

export { hubTab };
