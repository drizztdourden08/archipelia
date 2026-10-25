/* @layer core @kind config */

const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

const HEADING = /^#{1,6}\s+(.*?)\s*$/;

const SETEXT = /^(?:=+|-{2,})$/;

const RULE = /^(?:[-*_]\s*){3,}$/;

const LIST_ITEM = /^(?:[-*+]|\d{1,3}[.)])\s+/;

const QUOTE = /^>\s?/;

const TABLE = /^\|/;

const REFERENCE = /^\[[^\]]{1,100}\]:\s*\S/;

export { FENCE, HEADING, LIST_ITEM, QUOTE, REFERENCE, RULE, SETEXT, TABLE };
