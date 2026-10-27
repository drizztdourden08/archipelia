/* @layer renderer-app @kind config */
import type { SourceBuildTool, SourceOrigin, SourceToolBlock, SourceToolOs, SourceWarning } from '@archipelia/model';

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
  wheelOlder: (newest: string, tag: string) => `The newest release is ${newest}, but it has no build for this engine. This one is the older release ${tag}.`,
  wheelAction: 'Use the ready-made build',
  wheelNoDigest: 'GitHub published no checksum for this file, so Archipelia cannot check that it is the file the author uploaded. It will install it only if you ask.',
  wheelType: (repo: string) => `Type ${repo} to use it anyway.`,
  wheelNone: 'No ready-made build for this engine.',
  wheelUnknown: 'Archipelia could not read the releases of this project just now, so it does not know if a ready-made build exists.',
  pypiLinked: (repo: string, name: string) => `Good news. ${repo} is on the Python Package Index as ${name}. Archipelia can install it the usual way.`,
  pypiUnlinked: (name: string) => `A project called ${name} is on the Python Package Index, but it does not point back to this repository, so Archipelia does not offer it.`,
  pypiAction: 'Install from the Python Package Index',
  build: 'Let Archipelia build it',
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

const BUILD_TEXT = {
  warning: (repo: string) =>
    `Building runs the code of ${repo} on your computer, with your access. Archipelia cannot check that code. Nothing is downloaded until you click Download the source.`,
  confined: 'The build runs in a sandbox. It can write only to its private build folder, and it has no network while it builds.',
  unconfined: 'The build runs with your user rights and can read your files and use the network.',
  how: 'Archipelia downloads the source at the version shown, checks it, installs the build tools into a private folder and builds there. The tools come from the Python Package Index as ready-made files. Only this project is built from source.',
  download: 'Download the source',
  preparing: 'Downloading the source and setting up a private build folder.',
  readyHeading: (module: string) => `Ready to build ${module}`,
  source: (repo: string, short: string) => `Source: ${repo} at ${short}`,
  size: (megabytes: string) => `Archive size: ${megabytes} MB`,
  checksum: (sha256: string) => `sha256 ${sha256}`,
  checksumNote: 'Archipelia checks the source against this checksum again before it builds.',
  tools: 'Build tools Archipelia will install in the private folder',
  noTools: 'This project needs no extra build tools.',
  action: (module: string) => `Build ${module}`,
  building: (module: string) => `Building ${module}. This can take a few minutes.`,
  cancel: 'Cancel',
  checkAgain: 'Check again',
  tryAgain: 'Try again',
  failedHeading: 'The build failed',
  failedHelp: 'The log says why. You can copy it to ask the author of the world.',
  logLabel: 'Build log',
  logEmpty: 'No output yet.',
} as const;

const MISSING_TEXT: Record<SourceBuildTool, { title: string; body: string; link: string; url: string }> = {
  msvc: {
    title: 'The Microsoft C++ Build Tools are missing',
    body: 'Windows needs the Microsoft C++ Build Tools to compile this project. Install them, then click Check again.',
    link: 'Get the Microsoft C++ Build Tools',
    url: 'https://visualstudio.microsoft.com/visual-cpp-build-tools/',
  },
  compiler: {
    title: 'A C compiler is missing',
    body: 'Install gcc or clang. On Linux that is the build tools of your distribution, such as build-essential. On macOS it is the Xcode command line tools. Then click Check again.',
    link: 'How to install gcc',
    url: 'https://gcc.gnu.org/install/',
  },
  xcode: {
    title: 'The Xcode command line tools are missing',
    body: 'Run xcode-select --install in a terminal and finish the Apple installer. Then click Check again.',
    link: 'Xcode downloads',
    url: 'https://developer.apple.com/xcode/resources/',
  },
  'python-headers': {
    title: 'The Python headers are missing',
    body: 'The build could not find Python.h. The engine Python should ship it, so this engine may be damaged. Reinstall the engine, then click Check again.',
    link: 'About the Python headers',
    url: 'https://docs.python.org/3/c-api/intro.html#include-files',
  },
  headers: {
    title: 'A system library is missing',
    body: 'The build needs a header file that is not on this computer. Install the development package of that library, then click Check again.',
    link: 'Find the package',
    url: 'https://pkgs.org/',
  },
  rust: {
    title: 'Rust is missing',
    body: 'This project is written in Rust. Install Rust with rustup, then click Check again. On Windows it also needs the Microsoft C++ Build Tools.',
    link: 'Get Rust',
    url: 'https://www.rust-lang.org/tools/install',
  },
  cmake: {
    title: 'CMake is missing',
    body: 'This project builds with CMake. Install CMake, then click Check again.',
    link: 'Get CMake',
    url: 'https://cmake.org/download/',
  },
};

const TOOL_TEXT = {
  choose: 'How do you want to fix this?',
  how: 'Show me how',
  install: 'Install it for me',
  howIntro: 'Run this in a terminal, then click Check again.',
  howNone: 'Archipelia has no command for this system. Use the link above, then click Check again.',
  installHeading: 'Archipelia will run this command',
  size: (size: string) => `Size: ${size}`,
  source: (source: string) => `From ${source}.`,
  never: 'Archipelia never runs as an administrator. The installer asks for permission itself.',
  restart: 'The computer may need a restart afterwards.',
  action: 'Install',
  uncancellable: 'Once the system installer has started, it cannot be stopped from here.',
  installing: (what: string) => `Installing ${what}. Archipelia checks again when it ends.`,
  distro: (name: string) => `Detected system: ${name}`,
} as const;

const TOOL_ELEVATION_TEXT: Record<SourceToolOs, string> = {
  windows: 'Windows will ask for permission in its own window.',
  linux: 'Your system will ask for your password in its own window.',
  mac: 'Apple\'s installer opens in its own window and asks for permission.',
  other: 'Your system will ask for permission in its own window.',
};

const TOOL_BLOCKED_TEXT: Record<SourceToolBlock, string> = {
  immutable: 'This system keeps its programs read-only, so Archipelia cannot install this here. Use the manual way below, then click Check again.',
  unsupported: 'Archipelia cannot install this on this system. Use the manual way below, then click Check again.',
};

const TOOL_NAME: Record<SourceBuildTool, string> = {
  msvc: 'the Microsoft C++ Build Tools',
  compiler: 'a C compiler',
  xcode: 'the Xcode command line tools',
  'python-headers': 'the Python headers',
  headers: 'a system library',
  rust: 'Rust',
  cmake: 'CMake',
};

const BACKABLE_STEPS: ReadonlySet<string> = new Set(['trust', 'plan', 'build']);

export {
  BACKABLE_STEPS, BUILD_TEXT, MISSING_TEXT, ORIGIN_LABEL, PLAN_TEXT, SOURCE_TEXT, TOOL_BLOCKED_TEXT, TOOL_ELEVATION_TEXT, TOOL_NAME, TOOL_TEXT, WARNING_HELP, WARNING_LABEL,
};
