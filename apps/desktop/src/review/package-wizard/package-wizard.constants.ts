/* @layer renderer-app @kind config */
const WIZARD_TITLE = 'Get the package ctrando';

const WIZARD_SCOPE = { step: '.wizard-step', nav: '.wizard-nav' } as const;

const WIZARD_TEXT = {
  why: /not on the Python Package Index/,
  source: /Pseudoarc\/ctrando/,
  found: /built from its source code/,
  how: /Let Archipelia build it/,
  confirm: /Nothing is downloaded/,
  tools: /Archive size/,
  toolMissing: /Build Tools are missing/,
  toolInstall: /Archipelia will run this command/,
  toolRunning: /Installing the Microsoft/,
  consent: /Packages from GitHub/,
  done: /is installed and ready/,
  compiler: /C compiler/,
  git: /needs Git/,
  pip: /Install ctrando into/,
  check: /Click the button/,
  stillMissing: /still cannot find ctrando/,
} as const;

const WIZARD_BUTTON = {
  next: 'Next', use: 'Use this one', install: 'Install', installForMe: 'Install it for me', done: 'Done', checkAgain: 'Check again', cancel: 'Cancel',
} as const;

const WIZARD_CHOICE = { build: /Let Archipelia build it/, myself: /I will do it myself/, trust: /I trust Pseudoarc\/ctrando/ } as const;

export { WIZARD_BUTTON, WIZARD_CHOICE, WIZARD_SCOPE, WIZARD_TEXT, WIZARD_TITLE };
