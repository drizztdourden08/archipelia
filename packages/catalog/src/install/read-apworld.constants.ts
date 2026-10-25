/* @layer core @kind config */

const INIT = /^([^/]+)\/__init__\.pyc?$/;

const MANIFEST = /(?:^|\/)archipelago\.json$/;

const REQUIREMENTS = /^([^/]+)\/requirements\.txt$/;

const MAX_MANIFEST_BYTES = 65536;

const MAX_REQUIREMENTS_BYTES = 65536;

export { INIT, MANIFEST, MAX_MANIFEST_BYTES, MAX_REQUIREMENTS_BYTES, REQUIREMENTS };
