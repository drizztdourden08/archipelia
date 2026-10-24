/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';

const seqOf = (text: string): number | undefined => {
  try {
    const value: unknown = JSON.parse(text);
    return isRecord(value) && typeof value.seq === 'number' ? value.seq : undefined;
  } catch {
    return undefined;
  }
};

export { seqOf };
