/* @layer tests @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TrustedRoot } from '@sigstore/protobuf-specs';
import { describe, expect, test } from 'vitest';
import { verifyWorld } from '../src/verify/verify-world';
import { rotpClient } from './rotp-client';

const fixtures = join(import.meta.dirname, 'fixtures', 'rotp-release');

const read = (name: string) => readFileSync(join(fixtures, name));

describe('a real attested RotP release', () => {
  test.skip('PLACEHOLDER: needs tests/fixtures/rotp-release recorded from the first attested RotP release', () => {
    const bytes = new Uint8Array(read('relic_of_the_past.apworld'));
    const bundle: unknown = JSON.parse(read('relic_of_the_past.apworld.sigstore.json').toString('utf8'));
    const trustedRoot = TrustedRoot.fromJSON(JSON.parse(read('trusted_root.json').toString('utf8')));
    const verdict = verifyWorld(bytes, bundle, rotpClient(), trustedRoot);
    expect(verdict).toMatchObject({ ok: true, game: 'Relic of the Past', signer: { repo: 'drizztdourden08/relic-of-the-past' } });
    const changed = bytes.slice();
    changed[0] = (changed[0] ?? 0) ^ 1;
    expect(verifyWorld(changed, bundle, rotpClient(), trustedRoot)).toMatchObject({ ok: false, reason: 'digest-mismatch' });
  });
});
