/* @layer renderer-app @kind logic */
import type { PackageSourceHandlers } from '@archipelia/design';
import type { SourceBuildPlan } from '@archipelia/model';
import { MOCK_BUILD, MOCK_CONSENT, MOCK_LOG, MOCK_MODULE, MOCK_PLAN, MOCK_SUGGESTIONS, MOCK_TOOL } from '../mock-package-source.constants';
import type { BuildStep, MockWorld } from './mock-handlers-of.type';
import { logOf, NO_OP } from './useMockWorld.constants';

const mockHandlersOf = (world: MockWorld): Omit<PackageSourceHandlers, 'onClose'> => {
  const { setStep, setFinish, setConsent, setBuildLog, later, missed } = world;
  const candidate = MOCK_SUGGESTIONS.candidates[0];
  const at = (stage: BuildStep['stage']) => {
    if (candidate) setStep({ kind: 'build', candidate, plan: MOCK_PLAN, stage });
  };
  const built = (build: SourceBuildPlan) => {
    at({ kind: 'built', build });
    setFinish({ kind: 'running' });
    later(() => setConsent(MOCK_CONSENT));
  };
  const startBuild = (build: SourceBuildPlan) => {
    at({ kind: 'building', build });
    setBuildLog(logOf('Build'));
    later(() => {
      if (missed.current) return built(build);
      missed.current = true;
      at({ kind: 'missing', build, missing: { tool: 'msvc' }, log: MOCK_LOG, tool: MOCK_TOOL });
    });
  };
  return {
    onPaste: NO_OP,
    onRetrySearch: NO_OP,
    onPlan: (picked) => {
      setStep({ kind: 'planning', candidate: picked });
      later(() => setStep({ kind: 'plan', candidate: picked, plan: MOCK_PLAN }));
    },
    onInstallFromPypi: NO_OP,
    onUseWheel: NO_OP,
    onCheckAgain: () => {
      setFinish({ kind: 'running' });
      later(() => setFinish({ kind: 'missing', names: [MOCK_MODULE] }));
    },
    onBuildDownload: () => {
      at({ kind: 'preparing' });
      setBuildLog(logOf('Source'));
      later(() => at({ kind: 'ready', build: MOCK_BUILD }));
    },
    onBuildStart: startBuild,
    onBuildCancel: NO_OP,
    onToolInstall: (build) => {
      at({ kind: 'installing', build, tool: MOCK_TOOL });
      setBuildLog(logOf('Installer'));
      later(() => startBuild(build));
    },
    onToolCancel: NO_OP,
    onConsent: (accepted) => {
      setConsent(null);
      setFinish(accepted ? { kind: 'running' } : { kind: 'idle' });
      if (accepted) later(() => setFinish({ kind: 'done' }));
    },
    onOpenLink: NO_OP,
  };
};

export { mockHandlersOf };
