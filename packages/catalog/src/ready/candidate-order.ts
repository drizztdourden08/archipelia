/* @layer core @kind logic */
import type { Candidate } from './resolve-ready.type';

const candidateOrder = (a: Candidate, b: Candidate): number =>
  b.repo.stars - a.repo.stars || a.repo.createdAt.localeCompare(b.repo.createdAt) || a.repo.id - b.repo.id;

export { candidateOrder };
