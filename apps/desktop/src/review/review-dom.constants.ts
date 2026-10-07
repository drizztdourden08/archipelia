/* @layer renderer-app @kind config */
const SELECTOR = {
  layer: '.screen-layer:not(.screen-layer--hidden)',
  layerClose: '.screen-layer:not(.screen-layer--hidden) .screen-window__header .window-header__close',
  button: 'button, [role="button"]',
  dialog: '[role="dialog"], [role="alertdialog"], dialog',
  field: 'input, textarea',
  status: '[role="status"]',
  toggle: '[role="switch"]',
  tab: '[role="tab"]',
  paletteInput: '.command-palette--open input.command-palette__input, .command-palette--open .command-palette__input input',
  paletteRow: '.command-palette--open .command-palette-row',
  dashboard: '.session-dashboard',
  presetName: 'input[aria-label="Preset name"]',
  presetList: 'section[aria-label="Presets"]',
  runJob: '.job-dialog .task-progress[aria-label^="Running "]',
} as const;

export { SELECTOR };
