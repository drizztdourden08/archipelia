/* @layer tests @kind helper */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures');

const readFixture = (name: string): string => readFileSync(join(FIXTURES, name), 'utf8');

const readJsonFixture = (name: string): unknown => JSON.parse(readFixture(name));

export { readFixture, readJsonFixture };
