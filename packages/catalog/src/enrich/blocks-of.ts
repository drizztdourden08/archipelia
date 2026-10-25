/* @layer core @kind logic */
import type { TextBlock } from './enrich.type';
import type { BlockBuilder } from './blocks-of.type';
import { createBlockBuilder } from './create-block-builder';
import { LINE_HANDLERS } from './line-handlers.constants';
import { lineKindOf } from './line-kind';
import { stepComment } from './step-comment';
import { stepFence } from './step-fence';

const addLine = (builder: BlockBuilder, line: string): void => {
  LINE_HANDLERS[lineKindOf(line, builder.isOpen())](builder, line.trim());
};

const blocksOf = (markdown: string): TextBlock[] => {
  const builder = createBlockBuilder();
  let fence = '';
  let comment = false;
  for (const raw of markdown.split(/\r?\n/)) {
    const stepped = stepComment(raw, comment);
    comment = stepped.comment;
    const fenced = stepFence(stepped.line, fence);
    fence = fenced.fence;
    if (fenced.skip) builder.flush();
    else addLine(builder, stepped.line);
  }
  builder.flush();
  return builder.blocks;
};

export { blocksOf };
