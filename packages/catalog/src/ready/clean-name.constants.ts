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

const CAPITAL_LOOK_ALIKES: ReadonlyMap<string, string> = new Map([
  ['\u0410', 'A'], ['\u0412', 'B'], ['\u0415', 'E'], ['\u041A', 'K'], ['\u041C', 'M'], ['\u041D', 'H'], ['\u041E', 'O'], ['\u0420', 'P'], ['\u0421', 'C'],
  ['\u0422', 'T'], ['\u0425', 'X'], ['\u0423', 'Y'], ['\u0406', 'I'], ['\u0408', 'J'], ['\u0405', 'S'],
  ['\u0391', 'A'], ['\u0392', 'B'], ['\u0395', 'E'], ['\u0396', 'Z'], ['\u0397', 'H'], ['\u0399', 'I'], ['\u039A', 'K'], ['\u039C', 'M'], ['\u039D', 'N'],
  ['\u039F', 'O'], ['\u03A1', 'P'], ['\u03A4', 'T'], ['\u03A5', 'Y'], ['\u03A7', 'X'],
]);

export { CAPITAL_LOOK_ALIKES, COMBINING_MARKS, HIDDEN_CHARACTERS, LOOK_ALIKES, MAX_NAME_LENGTH, SPACE_RUNS };
