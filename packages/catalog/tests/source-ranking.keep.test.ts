/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { githubReposIn } from '../src/source/github-repos-in';
import { pickPin } from '../src/source/pick-pin';
import { projectNameOf } from '../src/source/project-name-of';
import { rankCandidates } from '../src/source/rank-candidates';
import { treeFactsOf } from '../src/source/tree-facts-of';
import { warningsOf } from '../src/source/warnings-of';
import { worldContextOf } from '../src/source/world-context-of';
import { candidate, NOW } from './source.fixtures';

const sha = (digit: string) => digit.repeat(40);

const names = (items: { repo: string }[]) => items.map((item) => item.repo);

describe('ranking the suggestions for a missing module', () => {
  test('a repo the world links comes before the author, which comes before a search hit', () => {
    const ranked = rankCandidates([
      candidate({ repo: 'search-hit', origins: ['search'], stars: 900 }),
      candidate({ repo: 'author-repo', origins: ['author'], stars: 3 }),
      candidate({ repo: 'linked', origins: ['world'], stars: 1 }),
    ], 'ctrando');
    expect(names(ranked)).toEqual(['linked', 'author-repo', 'search-hit']);
  });

  test('a repo that contains the module beats a better ranked one that does not', () => {
    const ranked = rankCandidates([
      candidate({ repo: 'linked-without', origins: ['world'], contains: false }),
      candidate({ repo: 'plain-with', origins: ['search'], contains: true }),
    ], 'ctrando');
    expect(names(ranked)).toEqual(['plain-with', 'linked-without']);
  });

  test('an exact name beats a longer one, a fork comes after its siblings, then stars and recent pushes', () => {
    const ranked = rankCandidates([
      candidate({ repo: 'ctrando-fork', fork: true, stars: 500 }),
      candidate({ repo: 'ctrando-tools', stars: 40 }),
      candidate({ repo: 'CTRando', stars: 5 }),
      candidate({ repo: 'ctrando-old', stars: 40, pushedAt: '2020-01-01T00:00:00Z' }),
      candidate({ repo: 'ctrando-new', stars: 40, pushedAt: '2026-01-01T00:00:00Z' }),
    ], 'ctrando');
    expect(names(ranked)).toEqual(['CTRando', 'ctrando-new', 'ctrando-old', 'ctrando-tools', 'ctrando-fork']);
  });
});

describe('the warning badges', () => {
  const repo = { owner: 'a', repo: 'b', description: undefined, stars: 100, pushedAt: undefined, createdAt: '2020-01-01T00:00:00Z', archived: false, fork: false, branch: 'main' };

  test('an old, popular, live repo has none', () => {
    expect(warningsOf(repo, NOW)).toEqual([]);
  });

  test('archived, new, few stars and fork each show', () => {
    const risky = { ...repo, archived: true, fork: true, stars: 4, createdAt: '2026-09-01T00:00:00Z' };
    expect(warningsOf(risky, NOW)).toEqual(['archived', 'new', 'few-stars', 'fork']);
  });

  test('an unknown creation date is not called new', () => {
    expect(warningsOf({ ...repo, createdAt: undefined }, NOW)).toEqual([]);
  });
});

describe('the commit to pin', () => {
  const head = { name: 'main', sha: sha('a') };

  test('the newest tag by version number, not by name', () => {
    const tags = [
      { name: 'v1.9.0', sha: sha('1') },
      { name: 'v1.10.0', sha: sha('2') },
      { name: 'v1.2.0', sha: sha('3') },
    ];
    expect(pickPin(tags, head)).toEqual({ kind: 'tag', ref: 'v1.10.0', sha: sha('2') });
  });

  test('a tag that is not a plain version, or has no commit, is skipped', () => {
    const tags = [{ name: 'nightly', sha: sha('1') }, { name: 'v2.0.0-rc1', sha: sha('2') }, { name: 'v0.5', sha: 'abc' }];
    expect(pickPin(tags, head)).toEqual({ kind: 'head', ref: 'main', sha: sha('a') });
  });

  test('no tags pins the head of the default branch', () => {
    expect(pickPin([], head)).toEqual({ kind: 'head', ref: 'main', sha: sha('a') });
  });
});

describe('reading a project name without running anything', () => {
  test('pyproject project name, then poetry, then setup.cfg, then setup.py', () => {
    expect(projectNameOf({ pyproject: '[project]\nname = "CTRando"\nversion = "1"' })).toBe('CTRando');
    expect(projectNameOf({ pyproject: '[tool.poetry]\nname = "ctr"' })).toBe('ctr');
    expect(projectNameOf({ setupCfg: '[options]\nx = 1\n[metadata]\nname = from-cfg\n' })).toBe('from-cfg');
    expect(projectNameOf({ setupPy: 'setup(\n    name="from_py",\n)' })).toBe('from_py');
  });

  test('a broken pyproject is no name instead of a failure', () => {
    expect(projectNameOf({ pyproject: '[project\nname =' })).toBeUndefined();
    expect(projectNameOf({})).toBeUndefined();
  });
});

describe('what a repo tree says about building', () => {
  test('C sources and native build files mean a compiler may be needed', () => {
    const tree = (...paths: string[]) => ({ tree: paths.map((path) => ({ path })) });
    expect(treeFactsOf(tree('src/ctrando/compression/compress.c', 'pyproject.toml')).native).toBe(true);
    expect(treeFactsOf(tree('rust/Cargo.toml')).native).toBe(true);
    expect(treeFactsOf(tree('src/ctrando/__init__.py')).native).toBe(false);
  });

  test('submodules and a cut off tree are reported', () => {
    expect(treeFactsOf({ tree: [{ path: '.gitmodules' }] }).submodules).toBe(true);
    expect(treeFactsOf({ tree: [{ path: 'a.py' }], truncated: true }).unsure).toBe(true);
    expect(treeFactsOf('nope').unsure).toBe(true);
  });
});

describe('links inside a world', () => {
  test('GitHub repos are found once each, in order, without site pages', () => {
    const text = 'See [it](https://github.com/Pseudoarc/ctrando). Also https://github.com/Pseudoarc/ctrando/issues, '
      + 'https://github.com/sponsors/someone and https://github.com/other/thing.git.';
    expect(githubReposIn(text)).toEqual([{ owner: 'Pseudoarc', repo: 'ctrando' }, { owner: 'other', repo: 'thing' }]);
  });

  test('the world context keeps the named repo first and takes the author from the home page', () => {
    const context = worldContextOf({
      linked: 'https://github.com/Pseudoarc/ctrando',
      home: 'https://github.com/author/ctrdi',
      texts: [undefined, 'https://github.com/Pseudoarc/ctrando and https://github.com/author/ctrdi'],
    });
    expect(context.links).toEqual([{ owner: 'Pseudoarc', repo: 'ctrando' }, { owner: 'author', repo: 'ctrdi' }]);
    expect(context.author).toBe('author');
  });
});
