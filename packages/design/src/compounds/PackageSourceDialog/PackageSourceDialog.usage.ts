/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The guided wizard for a world package that is not on the Python Package Index. One step per page: why Archipelia asks, the GitHub source to trust, what was found for it, then the way to install it (a ready-made build, the Index, a build by Archipelia, or by hand), the package list to agree to, the install and the result.',
  useWhen: [
    'A world needs a Python package that only exists on GitHub and Archipelia cannot install it from the Python Package Index.',
  ],
  avoidWhen: [
    { case: 'The question before a world installs packages that are on the Python Package Index.', use: 'PackageConsentDialog' },
    { case: 'The full information of a world.', use: 'GameDetails' },
  ],
  rules: [
    'Start with a danger callout: the package is not on the Python Package Index and installing it runs code from the internet on this computer.',
    'Preselect nothing: the user picks a source with Use this one, ticks the trust box (or types the repo name when the source has a warning badge), and picks a way when several exist.',
    'A source that does not hold the module cannot be picked.',
    'Run nothing from a repo before the user asks: the plan only reads files, the build starts only on the Download the source click, and a tool installs only on its own Install click.',
    'Each step has Back, Next and Cancel; Cancel closes the wizard and cancels what runs. A running step shows a live log and its own Cancel, and holds Back and Next until it ends.',
    'Show the commit, the size and the sha256 of the source and every build tool before the build runs.',
    'When a tool is missing, offer Show me how and Install it for me with neither preselected. Install shows the size, the licence, the exact command and who asks for permission. Archipelia never runs as an administrator.',
    'The package list is a step of its own: nothing installs before the user agrees to it.',
    'A failure shows the reason, Copy log and Try again on the step that failed.',
    'Open every link with onOpenLink, never inside the app window.',
  ],
  a11y: [
    'The dialog is modal and named after the package; focus moves to the step title on each step.',
    'The step list shows where the user is; the live status and the failure reason are read out without moving focus.',
  ],
  tree: {
    path: ['something over the page', 'a way to pick where a missing package comes from'],
    rule: 'The user sees the risk first, picks one source and agrees to trust it before anything is shown to install.',
  },
  example: `import { PackageSourceDialog } from '@archipelia/design';

const PackageSourceSample = ({ onClose }: { onClose: () => void }) => (
  <PackageSourceDialog
    title="Chrono Trigger"
    module="ctrando"
    search={{ suggestions: null, looking: false, failed: undefined }}
    step={{ kind: 'idle' }}
    finish={{ kind: 'idle' }}
    consent={null}
    onPaste={() => undefined}
    onRetrySearch={() => undefined}
    onPlan={() => undefined}
    onInstallFromPypi={() => undefined}
    onUseWheel={() => undefined}
    onCheckAgain={() => undefined}
    onBuildDownload={() => undefined}
    onBuildStart={() => undefined}
    onBuildCancel={() => undefined}
    onToolInstall={() => undefined}
    onToolCancel={() => undefined}
    onConsent={() => undefined}
    onOpenLink={() => undefined}
    onClose={onClose}
  />
);
`,
  propsHash: 'a068ab00831a7a0a',
} satisfies ComponentUsage;

export { usage };
