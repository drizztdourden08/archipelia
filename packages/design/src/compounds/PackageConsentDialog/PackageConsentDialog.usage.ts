/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The question before a world installs Python packages into the engine: every package with its version linked to its page, the world\'s own requirements apart from their dependencies, and the choice to install or cancel.',
  useWhen: [
    'A world needs Python packages that are not in the engine yet, before it is added or updated.',
  ],
  avoidWhen: [
    { case: 'A yes or no that lists nothing.', use: 'Dialog' },
    { case: 'The full information of a world.', use: 'GameDetails' },
  ],
  rules: [
    'Ask only when the list is not empty; a world with nothing to install needs no question.',
    'Say in one plain sentence that the packages install into the engine\'s Python.',
    'Show every package as its name and version, linked to its page; open the link with onOpenLink, never inside the app window.',
    'Keep the packages the world asks for under their own heading, apart from the packages those need.',
    'List a ready-made build apart from the others, with its release, its repo and its sha256, and say when the host published no checksum for it.',
    'Cancel and Escape install nothing and call onCancel; only the install button calls onAccept.',
  ],
  a11y: [
    'The dialog is modal and named after the world.',
    'Each list is a labelled section, and each link says it opens outside the app.',
    'Focus moves into the dialog on open and returns to where it came from on close.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'The user agrees to the packages a world installs before it is added.',
  },
  example: `import { PackageConsentDialog } from '@archipelia/design';

const PackageConsentSample = ({ onAccept, onCancel, onOpenLink }: { onAccept: () => void; onCancel: () => void; onOpenLink: (url: string) => void }) => (
  <PackageConsentDialog
    title="Chrono Trigger"
    packages={[{ name: 'ctrando', version: '1.2.0', url: 'https://pypi.org/project/ctrando/1.2.0/', direct: true }]}
    onAccept={onAccept}
    onCancel={onCancel}
    onOpenLink={onOpenLink}
  />
);
`,
  propsHash: '398f056f353e4cfe',
} satisfies ComponentUsage;

export { usage };
