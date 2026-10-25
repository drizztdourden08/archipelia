/* @layer core @kind config */

const ACTIVE = /<(script|style)\b[^>]{0,200}>[^<]{0,4000}<\/\1\s*>/gi;

const TAG = /<\/?[A-Za-z][^<>]{0,300}>/g;

const INLINE_RULES: readonly (readonly [RegExp, string])[] = [
  [/!\[[^\]]{0,300}\]\([^)]{0,500}\)/g, ''],
  [/!\[[^\]]{0,300}\]\[[^\]]{0,100}\]/g, ''],
  [/\[([^\]]{0,300})\]\([^)]{0,500}\)/g, '$1'],
  [/\[([^\]]{0,300})\]\[[^\]]{0,100}\]/g, '$1'],
  [/https?:\/\/\S+/g, ''],
  [/`+([^`]{0,500})`+/g, '$1'],
  [/\*{1,3}|~~|__/g, ''],
];

const ENTITIES: readonly (readonly [string, string])[] = [
  ['&nbsp;', ' '], ['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'], ['&#39;', "'"], ['&amp;', '&'],
];

export { ACTIVE, ENTITIES, INLINE_RULES, TAG };
