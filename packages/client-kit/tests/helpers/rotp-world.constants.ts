/* @layer tests @kind config */

const ROTP_MODULE = 'relic_of_the_past';

const ROTP_GAME = 'Relic of the Past';

const ROTP_WORLD_FILES: Readonly<Record<string, string>> = {
  '__init__.py': 'class RelicWorld:\n    game = "Relic of the Past"\n',
  'items.py': 'ITEMS = ["sword", "shield"]\n',
  'rules/regions.py': 'REGIONS = ["start"]\n',
  '__pycache__/items.cpython-312.pyc': 'compiled',
  'archipelago.json': '{"game": "stale"}',
};

const ROTP_DATA: Readonly<Record<string, unknown>> = {
  'game.json': { game: ROTP_GAME, worldVersion: '0.1.0' },
  'options.json': [{ key: 'death_link', type: 'toggle', default: false }],
};

const ROTP_RANGE = { game: ROTP_GAME, worldVersion: '0.1.0', minimumAp: '0.6.4' };

export { ROTP_DATA, ROTP_GAME, ROTP_MODULE, ROTP_RANGE, ROTP_WORLD_FILES };
