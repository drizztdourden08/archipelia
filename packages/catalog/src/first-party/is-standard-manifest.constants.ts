/* @layer core @kind config */

const APWORLD_FILE = /^[A-Za-z0-9][A-Za-z0-9._-]*\.apworld$/;

const BUNDLE_FILE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const SHA256 = /^[0-9a-f]{64}$/i;

const MODULE_NAME = /^[a-z][a-z0-9_]*$/;

export { APWORLD_FILE, BUNDLE_FILE, MODULE_NAME, SHA256 };
