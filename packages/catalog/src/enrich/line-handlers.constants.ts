/* @layer core @kind config */
import type { LineHandler, LineKind } from './blocks-of.type';
import { HEADING, LIST_ITEM, QUOTE } from './blocks-of.constants';

const flushLine: LineHandler = (builder) => builder.flush();

const LINE_HANDLERS: Record<LineKind, LineHandler> = {
  blank: flushLine,
  skip: flushLine,
  rule: flushLine,
  heading: (builder, trimmed) => builder.setHeading(trimmed.replace(HEADING, '$1').replace(/\s#+\s*$/, '')),
  setext: (builder) => (builder.hasProse() ? builder.promote() : builder.flush()),
  list: (builder, trimmed) => {
    builder.flush();
    builder.add(trimmed.replace(LIST_ITEM, ''), false);
  },
  quote: (builder, trimmed) => builder.add(trimmed.replace(QUOTE, ''), false),
  indented: () => undefined,
  text: (builder, trimmed) => builder.add(trimmed, !builder.isOpen() || builder.hasProse()),
};

export { LINE_HANDLERS };
