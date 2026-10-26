/* @layer renderer-app @kind config */
import type { SourceOrigin, SourceWarning } from '@archipelia/model';

const SOURCE_TEXT = {
  title: (module: string) => `Get the package ${module}`,
  warning: (module: string) => `This game needs a Python package called ${module}. It is not on the Python Package Index, where Archipelia normally gets packages. Archipelia searched GitHub for it. It does not know who made these projects or whether they are safe. Installing one runs its code on your computer, with your access. Pick one only if you trust it, ideally one the world's author points to.`,
  searching: (module: string) => `Looking for ${module} on GitHub.`,
  empty: (module: string) => `Archipelia found nothing for ${module} on GitHub. If the world's page says where to get it, paste that GitHub link here.`,
  limited: (time: string) => `GitHub asks Archipelia to wait. Try again at ${time}.`,
  pasteHeading: 'Not here? Paste a GitHub link',
  pastePlaceholder: 'https://github.com/owner/repo',
  pasteAction: 'Look it up',
  pasteFailed: 'Archipelia could not find that repository. Paste a link such as https://github.com/owner/repo.',
  use: 'Use this one',
  openRepo: 'Open on GitHub',
  contains: (module: string) => `Contains ${module}`,
  missingModule: (module: string) => `Does not contain ${module}`,
  checking: (repo: string) => `Checking ${repo}.`,
  back: 'Back to the list',
  close: 'Close',
  retry: 'Try again',
  stars: (count: number) => (count === 1 ? '1 star' : `${count} stars`),
  updated: 'Updated',
  created: 'Created',
  trust: (repo: string, module: string) => `${repo}. Its code will run on your computer to build ${module}.`,
  trustBox: (repo: string) => `I trust ${repo}`,
  trustType: (repo: string) => `Type ${repo} to continue.`,
  trustWarned: 'This project has warnings. Read them before you go on.',
  continue: 'Continue',
} as const;

const ORIGIN_LABEL: Record<SourceOrigin, string | undefined> = {
  world: 'Linked by this world',
  author: 'From the world\'s author',
  search: undefined,
  pasted: 'Pasted by you',
};

const WARNING_LABEL: Record<SourceWarning, string> = {
  archived: 'Archived',
  new: 'New project',
  'few-stars': 'Few stars',
  fork: 'Fork',
};

const WARNING_HELP: Record<SourceWarning, string> = {
  archived: 'Its author stopped working on it.',
  new: 'It was created in the last 90 days.',
  'few-stars': 'Few people have starred it.',
  fork: 'It is a copy of another project.',
};

const PLAN_TEXT = {
  noBuild: (version: string, date: string | undefined) =>
    `It has to be built from its source code, version ${version}${date ? ` from ${date}` : ''}.`,
  orBuild: (version: string, date: string | undefined) =>
    `You can also build it from its source code, version ${version}${date ? ` from ${date}` : ''}.`,
  wheelFound: (asset: string, tag: string) => `A ready-made build for your setup exists: ${asset} from release ${tag}.`,
  wheelFit: {
    exact: 'It was built for this exact engine.',
    abi3: 'It was built for this engine and for newer ones.',
    pure: 'It is plain Python, so it runs on any engine.',
  },
  wheelAction: 'Use the ready-made build',
  wheelNoDigest: 'GitHub published no checksum for this file, so Archipelia cannot check that it is the file the author uploaded. It will install it only if you ask.',
  wheelType: (repo: string) => `Type ${repo} to use it anyway.`,
  wheelNone: 'No ready-made build for this engine.',
  wheelUnknown: 'Archipelia could not read the releases of this project just now, so it does not know if a ready-made build exists.',
  pypiLinked: (repo: string, name: string) => `Good news. ${repo} is on the Python Package Index as ${name}. Archipelia can install it the usual way.`,
  pypiUnlinked: (name: string) => `A project called ${name} is on the Python Package Index, but it does not point back to this repository, so Archipelia does not offer it.`,
  pypiAction: 'Install from the Python Package Index',
  build: 'Let Archipelia build it',
  buildSoon: 'Coming soon: building from source',
  manualHeading: 'I will do it myself',
  manualIntro: 'Run these steps in a terminal, in order. Then click Check again.',
  python: 'Archipelia\'s own Python is at:',
  compiler: 'This project has C sources or build files. You need a C compiler first: Microsoft C++ Build Tools on Windows, Xcode command line tools on macOS (xcode-select --install), gcc and make on Linux.',
  compilerUnsure: 'Archipelia could not read the whole file list of this project, so it may need a C compiler: Microsoft C++ Build Tools on Windows, Xcode command line tools on macOS, gcc and make on Linux.',
  git: 'The command below needs Git to be installed.',
  submodules: 'This project uses Git submodules. The command below fetches them.',
  install: (module: string) => `Install ${module} into Archipelia's Python:`,
  shell: 'In PowerShell, put & and a space in front of the command.',
  checkAgain: 'Check again',
  still: (module: string) => `Archipelia still cannot find ${module}. Check the last step's output.`,
} as const;

const BACKABLE_STEPS: ReadonlySet<string> = new Set(['trust', 'plan']);

export { BACKABLE_STEPS, ORIGIN_LABEL, PLAN_TEXT, SOURCE_TEXT, WARNING_HELP, WARNING_LABEL };
