/* @layer renderer-app @kind logic */
import type { BuilderButton, ButtonsInput } from '../SessionBuilder.type';

const buttonsOf = ({ stored, dirty, hasTab }: ButtonsInput): BuilderButton[] => {
  if (hasTab) return dirty ? ['tab', 'save', 'discard'] : ['tab'];
  if (!stored) return ['save-run', 'save'];
  return dirty ? ['once', 'save-run', 'save', 'discard'] : ['run'];
};

export { buttonsOf };
