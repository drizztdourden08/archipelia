/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp, registerWidgets } from '@drizztdourden08/brock-react';
import { rendererBootTasks } from '../.brock/boot.renderer';
import { rendererModules } from '../.brock/modules.renderer';
import { screenTree } from '../.brock/screens';
import { appWidgets } from '../.brock/widgets';
import { SCREENS, SETTINGS } from './main.constants';
import { MENU } from './menu.constants';
import { BASE_SCREEN } from './navigation/app-navigation.constants';
import { product } from './product';
import { listenToRuns } from './state/listen-to-runs';
import { listenToSessionView } from './state/listen-to-session-view';
import { SESSION_WIDGETS } from './widgets/session-widgets.constants';
import type { AppSettings } from './settings.type';

listenToRuns();
listenToSessionView();
registerWidgets(SESSION_WIDGETS);

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <BrockApp<AppSettings>
      product={product}
      settings={SETTINGS}
      screenTree={screenTree}
      bootTasks={rendererBootTasks}
      screens={SCREENS}
      home={BASE_SCREEN}
      modules={rendererModules}
      menu={MENU}
      widgets={appWidgets}
    />
  </StrictMode>,
);
