/* @layer tests @kind test */
import registryFile from 'archipelia/registry/registry.json' with { type: 'json' };
import schema from 'archipelia/registry/registry.schema.json' with { type: 'json' };
import Ajv2020 from 'ajv/dist/2020';
import { describe, expect, test } from 'vitest';
import { floorRegistry } from '../src/registry/floor-registry';
import { findClient } from '../src/registry/find-client';
import { parseRegistry } from '../src/registry/parse-registry';

const validate = new Ajv2020({ allErrors: true, validateFormats: false }).compile(schema);

type Draft = { clients: Record<string, unknown>[]; games: Record<string, unknown>[] };

const edited = (change: (draft: Draft) => void) => {
  const draft = JSON.parse(JSON.stringify(registryFile)) as Draft;
  change(draft);
  return draft;
};

describe('registry/registry.json', () => {
  test('parses with no problem', () => {
    expect(parseRegistry(registryFile)).toMatchObject({ ok: true, problems: [] });
  });

  test('lists Relic of the Past as the first client', () => {
    const parsed = parseRegistry(registryFile);
    if (!parsed.ok) throw new Error('the registry does not parse');
    expect(parsed.registry.clients[0]).toMatchObject({
      id: 'relic-of-the-past',
      status: 'active',
      games: ['Relic of the Past'],
      trust: {
        method: 'github-attestation',
        repo: 'drizztdourden08/relic-of-the-past',
        workflow: '.github/workflows/release.yml',
        refs: ['refs/heads/master', 'refs/heads/main'],
        issuer: 'https://token.actions.githubusercontent.com',
      },
    });
    expect(parsed.registry.games[0]).toMatchObject({ game: 'Relic of the Past', module: 'relic_of_the_past', client: 'relic-of-the-past' });
  });

  test('says Relic of the Past is a builds index', () => {
    const parsed = parseRegistry(registryFile);
    if (!parsed.ok) throw new Error('the registry does not parse');
    expect(parsed.registry.games[0]?.release).toMatchObject({ manifest: 'relic_of_the_past.apworld.json', kind: 'builds' });
  });

  test('is the floor the app ships', () => {
    expect(findClient(floorRegistry(), 'relic-of-the-past')?.trust.repo).toBe('drizztdourden08/relic-of-the-past');
  });

  test('validates against registry.schema.json', () => {
    expect(validate(registryFile)).toBe(true);
  });

  test.each([
    ['a client with no trust repo', edited((draft) => { delete (draft.clients[0]?.trust as Record<string, unknown>).repo; })],
    ['a client with an unknown status', edited((draft) => { Object.assign(draft.clients[0] ?? {}, { status: 'pending' }); })],
    ['a field the schema does not name', edited((draft) => { Object.assign(draft.clients[0] ?? {}, { secret: 1 }); })],
    ['a game with a bad module name', edited((draft) => { Object.assign(draft.games[0] ?? {}, { module: 'Bad-Name' }); })],
    ['a release kind the schema does not name', edited((draft) => { Object.assign(draft.games[0]?.release as Record<string, unknown>, { kind: 'other' }); })],
    ['another format number', { ...registryFile, format: 2 }],
  ])('the schema rejects %s', (_name, value) => {
    expect(validate(value)).toBe(false);
  });
});
