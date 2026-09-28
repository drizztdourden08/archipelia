/* @layer core @kind types */
import type { createRecordStore } from './record-store';

type StoredRecord = { id: string };

type RecordStore<T extends StoredRecord> = ReturnType<typeof createRecordStore<T>>;

export type { RecordStore, StoredRecord };
