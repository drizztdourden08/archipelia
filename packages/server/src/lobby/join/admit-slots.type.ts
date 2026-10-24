/* @layer core @kind types */
import type { Failure, SlotEntry, WorldEntry } from '@archipelia/lobby-protocol';
import type { SlotUpload, UploadTrust, WorldUpload } from '@archipelia/model';

type SlotRequest = { slots: SlotEntry[]; worlds: WorldEntry[]; trust: UploadTrust };

type Admitted = { slots: SlotUpload[]; worlds: WorldUpload[]; notices: Failure[] };

export type { Admitted, SlotRequest };
