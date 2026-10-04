/* @layer renderer-app @kind types */
type ControlKind =
  | 'toggle' | 'choice' | 'range' | 'named-range' | 'text' | 'set-picker' | 'set-tags' | 'tags' | 'counter'
  | 'json-object' | 'json-list';

export type { ControlKind };
