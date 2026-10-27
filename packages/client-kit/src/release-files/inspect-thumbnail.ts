/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { ImageHeader, ThumbnailCheck } from './release-files.type';
import { badValue } from '../index-manifest/bad-value';
import { MAX_THUMBNAIL_BYTES, MAX_THUMBNAIL_SIDE } from './release-files.constants';
import { readPngHeader } from './read-png-header';
import { readWebpHeader } from './read-webp-header';

const problem = (message: string): KitIssue => badValue('thumbnail', message);

const checkShape = ({ width, height, animated }: ImageHeader): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (width === 0 || height === 0) issues.push(problem('the thumbnail has no pixels.'));
  if (width !== height) issues.push(problem(`the thumbnail must be square, not ${width} by ${height}.`));
  if (width > MAX_THUMBNAIL_SIDE || height > MAX_THUMBNAIL_SIDE) {
    issues.push(problem(`the thumbnail must be at most ${MAX_THUMBNAIL_SIDE} by ${MAX_THUMBNAIL_SIDE}, not ${width} by ${height}.`));
  }
  if (animated) issues.push(problem('an animated WebP is not accepted.'));
  return issues;
};

const inspectThumbnail = (bytes: Uint8Array): ThumbnailCheck => {
  const issues: KitIssue[] = [];
  if (bytes.length > MAX_THUMBNAIL_BYTES) issues.push(problem(`the thumbnail is ${bytes.length} bytes, over the ${MAX_THUMBNAIL_BYTES} byte limit.`));
  const header = readPngHeader(bytes) ?? readWebpHeader(bytes);
  if (header === undefined) return { issues: [...issues, problem('the thumbnail is not a PNG or a WebP image.')] };
  return { header, issues: [...issues, ...checkShape(header)] };
};

export { inspectThumbnail };
