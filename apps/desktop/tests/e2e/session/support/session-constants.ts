/* @layer tests @kind config */
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SESSION_PROOF_DIR = process.env.PROOF_DIR ?? join(tmpdir(), 'archipelia-proof', 'session');

const FIXTURES = join(import.meta.dirname, '../fixtures/rotp');

const YAML_B = join(FIXTURES, 'rotp-b.yaml');
const CHEST_INPUT = join(FIXTURES, 'links-house-chest.input');

const AUTO_STATE = 'test-links-house';

const LOOPBACK = '127.0.0.1';

const LOBBY_SERVER = 'local';

// The index entry bg3 is named "Baldur's Gate 3" and its schema game is the same. The search also finds the Trials of Tav and Baldur's Gate 2 entries, so the card is picked by its exact title.
const BALDUR = { search: 'Baldur', title: "Baldur's Gate 3", game: "Baldur's Gate 3", slot: 'Minsc' };

const RELIC = { search: 'Relic', title: 'Relic of the Past', game: 'Relic of the Past' };

const ROTP_A = { slot: 'RotP-A' };
const ROTP_B = { slot: 'RotP-B', yaml: YAML_B, fileName: 'rotp-b.yaml' };

// Every test stays within the e2e cap, so each wait here is shorter than E2E_TEST_TIMEOUT_MS and a long wait is split across ordered tests.
const E2E_TEST_TIMEOUT_MS = 120000;

const TIMEOUT = { install: 100000, join: 100000, chest: 100000, line: 60000 };

export { AUTO_STATE, BALDUR, CHEST_INPUT, E2E_TEST_TIMEOUT_MS, LOBBY_SERVER, LOOPBACK, RELIC, ROTP_A, ROTP_B, SESSION_PROOF_DIR, TIMEOUT };
