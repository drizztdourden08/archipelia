/* @layer core @kind config */

const SPECIAL = /[\^$.*+?()[\]{}|/-]/g;

const REF_WILDCARD = '*';

const REF_TAIL = String.raw`[^\s/]\S*`;

export { REF_TAIL, REF_WILDCARD, SPECIAL };
