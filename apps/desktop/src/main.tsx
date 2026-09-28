/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp } from '@drizztdourden08/brock-react';
import { rendererModules } from '../.brock/modules.renderer';
import { SCREEN_GROUPS, SCREENS, SETTINGS } from './main.constants';
import { MENU } from './menu.constants';
import { product } from './product';
import { listenToRuns } from './state/listen-to-runs';
import type { AppSettings } from './settings.type';

listenToRuns();

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <BrockApp<AppSettings>
      product={product}
      settings={SETTINGS}
      screens={SCREENS}
      modules={rendererModules}
      home="home"
      layout="rail"
      screenGroups={SCREEN_GROUPS}
      menu={MENU}
    />
  </StrictMode>,
);
