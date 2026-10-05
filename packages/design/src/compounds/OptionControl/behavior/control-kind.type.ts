/* @layer renderer-app @kind types */
type ControlKind =
  | 'toggle' | 'choice' | 'range' | 'named-range' | 'text' | 'set-picker' | 'set-tags' | 'tags' | 'counter'
  | 'key-values' | 'json-object' | 'json-list';

export type { ControlKind };
