/* @layer renderer-app @kind config */
import { NEW_PRESET_TOUR } from '../hooks/tour-targets.constants';

const SELECTOR = {
  layer: '.screen-layer:not(.screen-layer--hidden)',
  layerClose: '.screen-layer:not(.screen-layer--hidden) .screen-window__corner-close',
  button: 'button, [role="button"]',
  dialog: '[role="dialog"], [role="alertdialog"], dialog',
  field: 'input, textarea',
  status: '[role="status"]',
  toggle: '[role="switch"]',
  radio: 'input[type="radio"], [role="radio"]',
  tab: '[role="tab"]',
  paletteInput: '.command-palette--open input.command-palette__input, .command-palette--open .command-palette__input input',
  paletteRow: '.command-palette--open .command-palette-row',
  dashboard: '.session-dashboard',
  optionRow: '.form-row',
  rowControl: '.form-row__control',
  rowReset: '.form-row__reset',
  rowText: '.form-row .fold-text__text',
  rowMore: '.form-row .fold-text__more',
  gameCard: '.item-card',
  compactCard: '.item-card[data-density="compact"]',
  cardTitle: '.item-card__title',
  statusBar: 'section[aria-label="Games status"]',
  presetName: 'input[aria-label="Preset name"]',
  presetList: 'section[aria-label="Presets"]',
  newPreset: `[data-tour="${NEW_PRESET_TOUR}"]`,
  runJob: '.job-dialog .task-progress[aria-label^="Running "]',
} as const;

export { SELECTOR };
