/* @layer protocol @kind types */
import type { UploadKind } from '../protocol/protocol.type';
import type { SlotEntry, WorldEntry } from './hello.type';

type Ready = { type: 'ready'; seq?: number; ready: boolean };

type Leave = { type: 'leave'; seq?: number };

type SlotsSet = { type: 'slots.set'; seq?: number; slots: SlotEntry[]; worlds: WorldEntry[] };

type SlotsOk = { type: 'slots.ok'; re?: number; need: string[] };

type UploadBegin = { type: 'upload.begin'; seq?: number; sha256: string; kind: UploadKind; size: number };

type UploadReady = { type: 'upload.ready'; re?: number; sha256: string; offset: number };

type UploadChunk = { type: 'upload.chunk'; sha256: string; offset: number; data: string };

type UploadDone = { type: 'upload.done'; sha256: string; ok: boolean };

type FileGet = { type: 'file.get'; seq?: number; fileId: string };

type FileChunk = { type: 'file.chunk'; re?: number; fileId: string; offset: number; data: string };

type FileDone = { type: 'file.done'; re?: number; fileId: string; sha256: string };

export type {
  FileChunk,
  FileDone,
  FileGet,
  Leave,
  Ready,
  SlotsOk,
  SlotsSet,
  UploadBegin,
  UploadChunk,
  UploadDone,
  UploadReady,
};
