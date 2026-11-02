/* @layer tests @kind config */
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SESSION_PROOF_DIR = process.env.PROOF_DIR ?? join(tmpdir(), 'archipelia-proof', 'session');

const FIXTURES = join(import.meta.dirname, '../fixtures/rotp');

const YAML_B = join(SESSION_PROOF_DIR, 'rotp', 'RotP-B.yaml');
const CHEST_INPUT = join(FIXTURES, 'links-house-chest.json');

const AUTO_STATE = 'test-links-house';

const LOOPBACK = '127.0.0.1';

const LOBBY_SERVER = 'local';

const ROTP_COMMAND = 'rotp';

const BALDUR = { search: 'Baldur', title: "Baldur's Gate 3", game: "Baldur's Gate 3", slot: 'Minsc' };

const RELIC = { search: 'Relic', title: 'Relic of the Past', game: 'Relic of the Past' };

const ROTP_A = { slot: 'RotP-A' };
const ROTP_B = { slot: 'RotP-B', yaml: YAML_B, fileName: 'RotP-B.yaml' };

const ROTP_B_OPTIONS = ['death_link=true', 'pot_shuffle=true', 'bush_shuffle=true', 'killable_thieves=true'];

const E2E_TEST_TIMEOUT_MS = 120000;

const TIMEOUT = { install: 100000, join: 100000, chest: 100000, line: 60000 };

export { AUTO_STATE, BALDUR, CHEST_INPUT, E2E_TEST_TIMEOUT_MS, LOBBY_SERVER, LOOPBACK, RELIC, ROTP_A, ROTP_B, ROTP_B_OPTIONS, ROTP_COMMAND, SESSION_PROOF_DIR, TIMEOUT };
