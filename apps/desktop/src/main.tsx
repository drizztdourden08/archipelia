/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp } from '@drizztdourden08/brock-react';
import { rendererBootTasks } from '../.brock/boot.renderer';
import { rendererModules } from '../.brock/modules.renderer';
import { screenTree } from '../.brock/screens';
import { appWidgets } from '../.brock/widgets';
import { BASE_SCREEN } from './hooks/app-navigation.constants';
import { MENU, SCREENS, SETTINGS } from './main.constants';
import { product } from './product';
import { quitWhileHosting } from './rooms/quit-while-hosting';
import type { AppSettings } from './settings.type';

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
      beforeQuit={quitWhileHosting}
    />
  </StrictMode>,
);
