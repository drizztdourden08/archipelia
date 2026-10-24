/* @layer protocol @kind config */

const SHA256_PATTERN = '^[0-9a-f]{64}$';

const SEMVER_PATTERN =
  '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';

const AP_VERSION_PATTERN = '^\\d+\\.\\d+\\.\\d+$';

const TOKEN_PATTERN = '^[A-Za-z0-9_-]{43}$';

const LOBBY_CODE_PATTERN = '^[0-9A-Za-z]{4}-?[0-9A-Za-z]{4}$';

const CLIENT_ID_PATTERN = '^[a-z0-9][a-z0-9-]{1,63}$';

const MODULE_PATTERN = '^[a-z_][a-z0-9_]{0,63}$';

const PRINTABLE_PATTERN = '^[^\\u0000-\\u001f\\u007f]+$';

const HTTPS_PATTERN = '^https://\\S+$';

const BASE64_PATTERN = '^[A-Za-z0-9+/]*={0,2}$';

const TOKEN_LENGTH = 43;

export {
  AP_VERSION_PATTERN,
  BASE64_PATTERN,
  CLIENT_ID_PATTERN,
  HTTPS_PATTERN,
  LOBBY_CODE_PATTERN,
  MODULE_PATTERN,
  PRINTABLE_PATTERN,
  SEMVER_PATTERN,
  SHA256_PATTERN,
  TOKEN_LENGTH,
  TOKEN_PATTERN,
};
