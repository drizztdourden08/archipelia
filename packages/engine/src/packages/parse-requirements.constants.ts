/* @layer core @kind config */

const OPERATOR = '(?:===|==|~=|!=|>=|<=|>|<)';

const VERSION = '[A-Za-z0-9.*+!_-]+';

const CLAUSE = `${OPERATOR}\\s*${VERSION}`;

const PLAIN_REQUIREMENT = new RegExp(
  `^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?(?:\\[[A-Za-z0-9,._ -]+\\])?\\s*(?:${CLAUSE}(?:\\s*,\\s*${CLAUSE})*)?\\s*(?:;[\\w\\s.'"()<>=!~,*-]+)?$`,
);

export { PLAIN_REQUIREMENT };
