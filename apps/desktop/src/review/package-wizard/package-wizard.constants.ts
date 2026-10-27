/* @layer renderer-app @kind config */
const WIZARD_TITLE = /get the package ctrando/i;

const WIZARD_SCOPE = { step: '.wizard-step', nav: '.wizard-nav' } as const;

const WIZARD_TEXT = {
  why: /not on the Python Package Index/i,
  source: /Pseudoarc\/ctrando/i,
  found: /built from its source code/i,
  how: /Let Archipelia build it/i,
  confirm: /Nothing is downloaded/i,
  tools: /Archive size/i,
  toolMissing: /Build Tools are missing/i,
  toolInstall: /Archipelia will run this command/i,
  toolRunning: /Installing the Microsoft/i,
  consent: /Packages from GitHub/i,
  done: /is installed and ready/i,
  compiler: /C compiler/i,
  git: /needs Git/i,
  pip: /Install ctrando into/i,
  check: /Click the button/i,
  stillMissing: /still cannot find ctrando/i,
} as const;

const WIZARD_BUTTON = {
  next: 'Next', use: 'Use this one', install: 'Install', installForMe: 'Install it for me', done: 'Done', checkAgain: 'Check again', cancel: 'Cancel',
} as const;

const WIZARD_CHOICE = { build: /Let Archipelia build it/i, myself: /I will do it myself/i, trust: /I trust Pseudoarc\/ctrando/i } as const;

export { WIZARD_BUTTON, WIZARD_CHOICE, WIZARD_SCOPE, WIZARD_TEXT, WIZARD_TITLE };
