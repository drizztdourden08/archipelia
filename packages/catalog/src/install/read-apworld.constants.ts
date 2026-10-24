/* @layer core @kind config */

const INIT = /^([^/]+)\/__init__\.pyc?$/;

const MANIFEST = /(?:^|\/)archipelago\.json$/;

const MAX_MANIFEST_BYTES = 65536;

export { INIT, MANIFEST, MAX_MANIFEST_BYTES };
