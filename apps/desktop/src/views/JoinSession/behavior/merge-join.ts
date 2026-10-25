/* @layer renderer-app @kind logic */
import type { JoinView } from '../../../joins/joins.type';

const mergeJoin = (joins: readonly JoinView[], view: JoinView): JoinView[] =>
  joins.some((join) => join.id === view.id) ? joins.map((join) => (join.id === view.id ? view : join)) : [view, ...joins];

export { mergeJoin };
