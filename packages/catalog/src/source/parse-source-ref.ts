/* @layer core @kind logic */
import type { SourceRef } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { OWNER, REPO } from '../enrich/parse-github-home.constants';
import { moduleNameOf } from './module-name-of';
import { MODULE_NAME } from './source.constants';

const parseSourceRef = (value: unknown): SourceRef => {
  const input: Record<string, unknown> = isRecord(value) ? value : {};
  const { owner, repo, module } = input;
  const valid = typeof owner === 'string' && OWNER.test(owner) && typeof repo === 'string' && REPO.test(repo) && repo !== '.' && repo !== '..'
    && typeof module === 'string' && MODULE_NAME.test(module);
  if (!valid) throw new Error('That package request is not valid.');
  return { owner, repo, module: moduleNameOf(module) };
};

export { parseSourceRef };
