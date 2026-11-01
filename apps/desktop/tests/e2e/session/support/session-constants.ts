/* @layer tests @kind config */
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SESSION_PROOF_DIR = process.env.PROOF_DIR ?? join(tmpdir(), 'archipelia-proof', 'session');

const FIXTURES = join(import.meta.dirname, '../fixtures/rotp');

const YAML_A = join(FIXTURES, 'rotp-a.yaml');
const YAML_B = join(FIXTURES, 'rotp-b.yaml');
const CHEST_INPUT = join(FIXTURES, 'links-house-chest.input');

const AUTO_STATE = 'test-links-house';

const LOOPBACK = '127.0.0.1';

const LOBBY_SERVER = 'local';

// TODO: confirm the exact title and game name the Archipelago index gives Baldur's Gate.
const BALDUR = { search: 'Baldur', title: /Baldur/i, game: "Baldur's Gate", slot: 'Minsc' };

const RELIC = { search: 'Relic', title: 'Relic of the Past', game: 'Relic of the Past' };

const ROTP_A = { slot: 'RotP-A', yaml: YAML_A };
const ROTP_B = { slot: 'RotP-B', yaml: YAML_B, fileName: 'rotp-b.yaml' };

const TIMEOUT = { install: 300000, join: 120000, chest: 300000, line: 60000 };

export { AUTO_STATE, BALDUR, CHEST_INPUT, LOBBY_SERVER, LOOPBACK, RELIC, ROTP_A, ROTP_B, SESSION_PROOF_DIR, TIMEOUT };
