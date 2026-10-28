/* @layer core @kind config */

const MAX_NAME_LENGTH = 80;

const HIDDEN_CHARACTERS = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu;

const SPACE_RUNS = /\s+/gu;

const COMBINING_MARKS = /\p{M}/gu;

const LOOK_ALIKES: ReadonlyMap<string, string> = new Map([
  ['\u0430', 'a'], ['\u0435', 'e'], ['\u043E', 'o'], ['\u0440', 'p'], ['\u0441', 'c'], ['\u0445', 'x'], ['\u0443', 'y'],
  ['\u0456', 'i'], ['\u0458', 'j'], ['\u0455', 's'], ['\u0501', 'd'], ['\u051B', 'q'], ['\u051D', 'w'], ['\u04BB', 'h'],
  ['\u03B1', 'a'], ['\u03B5', 'e'], ['\u03BF', 'o'], ['\u03C1', 'p'], ['\u03BD', 'v'], ['\u03B9', 'i'], ['\u03BA', 'k'], ['\u03C5', 'u'],
  ['\u0131', 'i'], ['\u0269', 'i'], ['\u1D00', 'a'], ['\u1D0F', 'o'], ['\u1D1C', 'u'],
]);

export { COMBINING_MARKS, HIDDEN_CHARACTERS, LOOK_ALIKES, MAX_NAME_LENGTH, SPACE_RUNS };
