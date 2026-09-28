/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { HubPage, HubTab } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';

const hubPage = (id: string, label: string, icon: IconName, body: (() => ReactNode) | HubTab[]): HubPage => ({
  id,
  label,
  icon: createElement(Icon, { name: icon }),
  render: Array.isArray(body) ? () => null : body,
  tabs: Array.isArray(body) ? body : undefined,
});

export { hubPage };
