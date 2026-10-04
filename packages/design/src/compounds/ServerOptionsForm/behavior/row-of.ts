/* @layer renderer-app @kind logic */
import type { RowText } from '../ServerOptionsForm.type';

const rowOf = (id: string, text: RowText) => ({ id, title: text.label, description: text.description, hint: text.hint, keywords: text.keywords });

export { rowOf };
