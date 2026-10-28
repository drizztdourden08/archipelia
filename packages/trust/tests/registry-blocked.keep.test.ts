/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parseRegistry } from '../src/registry/parse-registry';

const release = { repo: 'owner/repo', world: 'a.apworld', manifest: 'a.apworld.json', bundle: 'a.apworld.sigstore.json' };

const client = {
  id: 'demo', name: 'Demo', homepage: 'https://example.com', games: ['Demo Game'], status: 'active',
  trust: { method: 'github-attestation', repo: 'owner/repo', workflow: '.github/workflows/release.yml', refs: ['refs/heads/main'], issuer: 'https://token.actions.githubusercontent.com' },
};

const game = (patch: Record<string, unknown> = {}) => ({
  game: 'Demo Game', module: 'demo_game', displayName: 'Demo Game', home: 'https://example.com', tags: [], client: 'demo', release, ...patch,
});

const file = (patch: Record<string, unknown> = {}) => ({ format: 1, clients: [client], games: [game()], ...patch });

describe('the registry repo id and blocked list', () => {
  test('a registry that has neither still reads, with an empty blocked list', () => {
    const parsed = parseRegistry(file());
    expect(parsed).toMatchObject({ ok: true, problems: [] });
    if (parsed.ok) {
      expect(parsed.registry.blocked).toEqual([]);
      expect(parsed.registry.games[0]?.release).not.toHaveProperty('repoId');
    }
  });

  test('reads the repo id of a release and the blocked repo ids with their reasons', () => {
    const parsed = parseRegistry(file({ games: [game({ release: { ...release, repoId: 42 } })], blocked: [{ repoId: 9, reason: 'spam' }, { repoId: 10 }] }));
    expect(parsed).toMatchObject({ ok: true, problems: [] });
    if (parsed.ok) {
      expect(parsed.registry.games[0]?.release.repoId).toBe(42);
      expect(parsed.registry.blocked).toEqual([{ repoId: 9, reason: 'spam' }, { repoId: 10 }]);
    }
  });

  test('drops a game whose repo id is not a positive whole number', () => {
    const parsed = parseRegistry(file({ games: [game({ release: { ...release, repoId: -3 } })] }));
    expect(parsed).toMatchObject({ ok: true });
    if (parsed.ok) {
      expect(parsed.registry.games).toEqual([]);
      expect(parsed.problems).toHaveLength(1);
    }
  });

  test('skips a bad blocked entry with a problem and keeps the good ones', () => {
    const parsed = parseRegistry(file({ blocked: [{ repoId: 'x' }, { repoId: 11 }, 'oops'] }));
    expect(parsed).toMatchObject({ ok: true });
    if (parsed.ok) {
      expect(parsed.registry.blocked).toEqual([{ repoId: 11 }]);
      expect(parsed.problems).toHaveLength(2);
    }
  });

  test('a blocked value that is not a list is ignored with one problem', () => {
    const parsed = parseRegistry(file({ blocked: { repoId: 1 } }));
    expect(parsed).toMatchObject({ ok: true, problems: ['registry blocked is not a list'] });
  });
});
