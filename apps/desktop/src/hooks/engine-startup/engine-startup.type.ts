/* @layer renderer-app @kind types */
import type { StartupPromptContext, StartupPromptSettings } from '@drizztdourden08/brock-react';
import type { EngineChoice, EngineInstallResult, EngineOverview, EngineStatus, StartupDecision } from '@archipelia/model';
import type { AppSettings } from '../../settings.type';
import type { FinishInstall } from '../../views/EngineSettings/EngineSettings.type';

type EngineStartupDeps = {
  status: () => Promise<EngineStatus>;
  startup: () => Promise<StartupDecision>;
  overview: () => Promise<EngineOverview>;
  offerShown: (version: string) => Promise<void>;
  install: (choice: EngineChoice) => Promise<EngineInstallResult>;
  switchTo: (id: string) => Promise<void>;
  finish: FinishInstall;
  tell: (sentence: string) => void;
  openNotes: (url: string) => void;
};

type StartupCtx = Pick<StartupPromptContext<AppSettings>, 'confirmAction' | 'confirmChoice'> & {
  settings: Pick<StartupPromptSettings<AppSettings>, 'get'>;
};

type OfferDecision = Extract<StartupDecision, { kind: 'offer' }>;

export type { EngineStartupDeps, OfferDecision, StartupCtx };
