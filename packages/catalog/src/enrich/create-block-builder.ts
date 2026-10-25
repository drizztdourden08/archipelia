/* @layer core @kind logic */
import type { TextBlock } from './enrich.type';
import type { BlockBuilder } from './blocks-of.type';
import { stripInline } from './strip-inline';

const createBlockBuilder = (): BlockBuilder => {
  const blocks: TextBlock[] = [];
  let heading = '';
  let lines: string[] = [];
  let prose = true;

  const flush = () => {
    const clean = stripInline(lines.join(' '));
    if (clean !== '') blocks.push({ heading, text: clean, prose });
    lines = [];
    prose = true;
  };
  const add = (line: string, isProse: boolean) => {
    if (lines.length > 0 && prose !== isProse) flush();
    prose = isProse;
    lines.push(line);
  };
  const setHeading = (text: string) => {
    flush();
    heading = stripInline(text);
  };

  const promote = () => {
    const text = lines.join(' ');
    lines = [];
    prose = true;
    heading = stripInline(text);
  };

  return { blocks, flush, add, setHeading, promote, hasProse: () => lines.length > 0 && prose, isOpen: () => lines.length > 0 };
};

export { createBlockBuilder };
