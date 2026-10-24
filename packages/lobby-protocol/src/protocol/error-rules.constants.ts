/* @layer protocol @kind config */
import type { ErrorRule } from './error-rules.type';
import { CLOSE_CODES } from './close-codes.constants';

const ERROR_RULES = {
  'bad-message': { fatal: 'before-welcome', close: CLOSE_CODES.badMessage },
  'protocol-unsupported': { fatal: 'always', close: CLOSE_CODES.protocolUnsupported },
  'metadata-missing': { fatal: 'always', close: CLOSE_CODES.badMessage },
  'lobby-not-found': { fatal: 'always', close: CLOSE_CODES.notFound },
  'lobby-closed': { fatal: 'always', close: CLOSE_CODES.lobbyEnded },
  'lobby-locked': { fatal: 'before-welcome', close: CLOSE_CODES.lobbyEnded },
  'lobby-full': { fatal: 'always', close: CLOSE_CODES.lobbyEnded },
  'version-mismatch': { fatal: 'before-welcome', close: CLOSE_CODES.versionConflict },
  'world-version-conflict': { fatal: 'before-welcome', close: CLOSE_CODES.versionConflict },
  'trust-failed': { fatal: 'always', close: CLOSE_CODES.forbidden },
  'client-revoked': { fatal: 'always', close: CLOSE_CODES.forbidden },
  'unlisted-not-allowed': { fatal: 'always', close: CLOSE_CODES.forbidden },
  refused: { fatal: 'always', close: CLOSE_CODES.forbidden },
  'resume-invalid': { fatal: 'always', close: CLOSE_CODES.forbidden },
  'resume-replaced': { fatal: 'always', close: CLOSE_CODES.resumeReplaced },
  'slot-name-taken': { fatal: 'never', close: null },
  'upload-unexpected': { fatal: 'never', close: null },
  'upload-too-large': { fatal: 'never', close: null },
  'upload-hash-mismatch': { fatal: 'never', close: null },
  'yaml-invalid': { fatal: 'never', close: null },
  'world-invalid': { fatal: 'never', close: null },
  'consent-refused': { fatal: 'never', close: null },
  'rate-limited': { fatal: 'always', close: CLOSE_CODES.rateLimited },
  internal: { fatal: 'never', close: null },
} satisfies Record<string, ErrorRule>;

const ERROR_CODE_LIST = Object.keys(ERROR_RULES);

export { ERROR_CODE_LIST, ERROR_RULES };
