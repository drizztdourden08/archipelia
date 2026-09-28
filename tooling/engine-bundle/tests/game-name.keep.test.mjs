/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parseGameName } from '../src/official/game-name.mjs';
import { parseLooseGames } from '../src/official/loose-worlds.mjs';

describe('parseGameName', () => {
  test('reads a plain class attribute', () => {
    expect(parseGameName(['class TimespinnerWorld(World):\n    game = "Timespinner"\n'])).toBe('Timespinner');
  });

  test('reads an annotated attribute with single quotes', () => {
    expect(parseGameName(["class W(World):\n    game: ClassVar[str] = 'Hollow Knight'  # name\n"])).toBe('Hollow Knight');
  });

  test('resolves a module constant from another file', () => {
    const sources = ['class W(World):\n    game = GAME_NAME\n', 'GAME_NAME: str = "Saving Princess"\n'];
    expect(parseGameName(sources)).toBe('Saving Princess');
  });

  test('skips a line that is not a name and keeps looking', () => {
    const source = 'class C:\n    game: str = os.path.join(a, b)\n\nclass W(World):\n    game = "Ocarina of Time"\n';
    expect(parseGameName([source])).toBe('Ocarina of Time');
  });

  test('gives nothing for an attribute of another object', () => {
    expect(parseGameName(['class W(World):\n    game = OTHER.game_name\n'])).toBeUndefined();
  });
});

describe('parseLooseGames', () => {
  test('reads the set of worlds AP keeps as folders', () => {
    const setup = 'non_apworlds: set[str] = {\n    "A Link to the Past",\n    "Raft",\n}\n';
    expect([...(parseLooseGames(setup) ?? [])]).toEqual(['A Link to the Past', 'Raft']);
  });

  test('gives nothing when the set is missing', () => {
    expect(parseLooseGames('import os\n')).toBeUndefined();
  });
});
