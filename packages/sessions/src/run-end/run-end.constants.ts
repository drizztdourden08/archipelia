/* @layer core @kind config */

const GOAL_REACHED = /(.+?) \(Team #\d+\) has completed their goal\./;

const TALLY_FILE = 'run-tally.json';

const SAVE_EVERY_MS = 15_000;

const ITEM_TYPES_SUFFIX = '_ItemTypes.json';

const SPOILER_SUFFIX = /_Spoiler\.txt$/;

const ZIP_SUFFIX = /\.zip$/;

export { GOAL_REACHED, ITEM_TYPES_SUFFIX, SAVE_EVERY_MS, SPOILER_SUFFIX, TALLY_FILE, ZIP_SUFFIX };
