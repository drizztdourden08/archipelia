/* @layer tests @kind test */
import registryFile from 'archipelia/registry/registry.json' with { type: 'json' };
import schema from 'archipelia/registry/registry.schema.json' with { type: 'json' };
import Ajv2020 from 'ajv/dist/2020';
import { describe, expect, test } from 'vitest';
import { parseRegistry } from '../src/registry/parse-registry';

const validate = new Ajv2020({ allErrors: true, validateFormats: false }).compile(schema);

type Draft = { clients: Record<string, unknown>[]; games: Record<string, unknown>[] };

const edited = (change: (draft: Draft) => void) => {
  const draft = JSON.parse(JSON.stringify(registryFile)) as Draft;
  change(draft);
  return draft;
};

describe('K2 registry/registry.json', { tags: ['critical'] }, () => {
  test('parses with no problem', () => {
    expect(parseRegistry(registryFile)).toMatchObject({ ok: true, problems: [] });
  });

  test('the schema accepts a blocked list with a reason', () => {
    expect(validate({ ...registryFile, blocked: [{ repoId: 5, reason: 'spam' }, { repoId: 6 }] })).toBe(true);
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
    ['a repo id that is not a whole number', edited((draft) => { Object.assign(draft.games[0]?.release as Record<string, unknown>, { repoId: 1.5 }); })],
    ['a blocked entry with no repo id', { ...registryFile, blocked: [{ reason: 'spam' }] }],
  ])('the schema rejects %s', (_name, value) => {
    expect(validate(value)).toBe(false);
  });
});
