/* @layer client-kit @kind logic */
import { readFile } from 'node:fs/promises';
import type { ReleaseExtras } from './release-extras.type';
import { checkDescription } from '../release-files/check-description';
import { inspectThumbnail } from '../release-files/inspect-thumbnail';

const readBytes = async (path: string): Promise<Uint8Array> => new Uint8Array(await readFile(path));

const readThumbnail = async (path: string | undefined): Promise<Pick<ReleaseExtras, 'thumbnail' | 'issues'>> => {
  if (path === undefined) return { issues: [] };
  const bytes = await readBytes(path);
  const { header, issues } = inspectThumbnail(bytes);
  return header === undefined ? { issues } : { thumbnail: { bytes, format: header.format }, issues };
};

const readDescription = async (path: string | undefined): Promise<Pick<ReleaseExtras, 'description' | 'issues' | 'warnings'>> => {
  if (path === undefined) return { issues: [], warnings: [] };
  const bytes = await readBytes(path);
  return { description: bytes, ...checkDescription(bytes) };
};

const readReleaseExtras = async (thumbnail: string | undefined, description: string | undefined): Promise<ReleaseExtras> => {
  const image = await readThumbnail(thumbnail);
  const text = await readDescription(description);
  return { ...image, ...text, issues: [...image.issues, ...text.issues] };
};

export { readReleaseExtras };
