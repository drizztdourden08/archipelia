/* @layer testing @kind logic */
import type { ChunkRequest } from './chunk-data.type';
import { CORRUPT_BYTE } from './chunk-data.constants';

const chunkData = (request: ChunkRequest): string => {
  const file = request.files.find((candidate) => candidate.sha256 === request.sha256);
  if (!file) throw new Error(`no scenario file has the hash ${request.sha256}`);
  const slice = file.bytes.subarray(request.offset, request.offset + request.size);
  const bytes = request.corrupt ? new Uint8Array(slice.length).fill(CORRUPT_BYTE) : slice;
  return Buffer.from(bytes).toString('base64');
};

export { chunkData };
