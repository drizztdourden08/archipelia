/* @layer core @kind config */

const OPERATOR = '(?:===|==|~=|!=|>=|<=|>|<)';

const VERSION = '[A-Za-z0-9.*+!_-]+';

const CLAUSE = `${OPERATOR}\\s*${VERSION}`;

const PLAIN_REQUIREMENT = new RegExp(
  `^([A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?)(?:\\[[A-Za-z0-9,._ -]+\\])?\\s*(?:${CLAUSE}(?:\\s*,\\s*${CLAUSE})*)?$`,
);

const ARCHIVE_NAME = /\.(?:whl|zip|egg|tar|tgz|tbz2?|txz|gz|bz2|xz|zst|7z)$/i;

export { ARCHIVE_NAME, PLAIN_REQUIREMENT };
