/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The guided dialog for a world package that is not on the Python Package Index: a warning on top, GitHub repos that might hold the package with their warning badges, a trust step, then the choices to install from the Index or by hand.',
  useWhen: [
    'A world needs a Python package that only exists on GitHub and Archipelia cannot install it from the Python Package Index.',
  ],
  avoidWhen: [
    { case: 'The question before a world installs packages that are on the Python Package Index.', use: 'PackageConsentDialog' },
    { case: 'The full information of a world.', use: 'GameDetails' },
  ],
  rules: [
    'Show the warning at the top of every step: code from a GitHub repo runs on this computer with the user\'s access and Archipelia cannot check it.',
    'Preselect nothing: the user picks a repo with Use this one, and a repo that does not hold the module cannot be picked.',
    'Ask for trust before any plan: a checkbox, or the typed owner and repo name when the repo has a warning badge.',
    'Run nothing from a repo in this dialog; the plan only reads files and the commands are for the user to copy.',
    'Offer a ready-made build only when the plan holds one that fits the engine, and say plainly when there is none. When the host published no checksum for it, ask for the typed owner and repo name before the button works.',
    'Keep Let Archipelia build it disabled with its Coming soon note until building from source exists.',
    'Open every link with onOpenLink, never inside the app window.',
  ],
  a11y: [
    'The dialog is modal and named after the package; focus moves into it on open and returns on close.',
    'The warning is a callout read first; each repo is a card whose buttons name what they do.',
    'The still missing message and the copy button announce their result without moving focus.',
  ],
  tree: {
    path: ['something over the page', 'a way to pick where a missing package comes from'],
    rule: 'The user sees the risk first, picks one repo and agrees to trust it before anything is shown to install.',
  },
  example: `import { PackageSourceDialog } from '@archipelia/design';

const PackageSourceSample = ({ onClose }: { onClose: () => void }) => (
  <PackageSourceDialog
    title="Chrono Trigger"
    module="ctrando"
    step={{ kind: 'searching' }}
    onPaste={() => undefined}
    onPick={() => undefined}
    onTrust={() => undefined}
    onBack={() => undefined}
    onRetry={() => undefined}
    onInstallFromPypi={() => undefined}
    onUseWheel={() => undefined}
    onCheckAgain={() => undefined}
    onOpenLink={() => undefined}
    onClose={onClose}
  />
);
`,
  propsHash: '950fde7c2900550d',
} satisfies ComponentUsage;

export { usage };
