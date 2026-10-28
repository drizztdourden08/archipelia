/* @layer core @kind types */
import type { ReadySearch } from './ready.type';
import type { Candidate } from './resolve-ready.type';

type ReadyRead = { search: ReadySearch; candidates: Candidate[] };

export type { ReadyRead };
