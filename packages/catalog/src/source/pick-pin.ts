/* @layer core @kind logic */
import type { SourcePin } from '@archipelia/model';
import { compareVersions } from '@archipelia/engine';
import { COMMIT_SHA, NUMERIC_TAG } from './source.constants';
import type { TagFact } from './source.type';

const versionOf = (name: string) => NUMERIC_TAG.exec(name)?.[1];

const newestTag = (tags: readonly TagFact[]): TagFact | undefined =>
  tags
    .filter((tag) => COMMIT_SHA.test(tag.sha) && versionOf(tag.name) !== undefined)
    .sort((left, right) => compareVersions(versionOf(right.name) ?? '0', versionOf(left.name) ?? '0'))[0];

const pickPin = (tags: readonly TagFact[], head: TagFact): SourcePin => {
  const tag = newestTag(tags);
  return tag ? { kind: 'tag', ref: tag.name, sha: tag.sha } : { kind: 'head', ref: head.name, sha: head.sha };
};

export { pickPin };
