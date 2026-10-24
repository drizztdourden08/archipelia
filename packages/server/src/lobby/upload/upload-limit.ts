/* @layer core @kind logic */
import type { Failure, UploadBegin } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { formatSize } from '../state/format-size';
import type { MemberFile } from '../state/member-files.type';

const tooLarge = (what: string, size: number, limit: number): Failure =>
  ({ code: 'upload-too-large', message: `${what} ${formatSize(size)}. This lobby takes ${formatSize(limit)}.` });

const uploadLimit = (lobby: Lobby, begin: UploadBegin, files: MemberFile[]): Failure | null => {
  const { worldBytes, yamlBytes, memberBytes } = lobby.options.limits;
  const limit = begin.kind === 'world' ? worldBytes : yamlBytes;
  if (begin.size > limit) return tooLarge(begin.kind === 'world' ? 'The world is' : 'The YAML is', begin.size, limit);
  const total = files.reduce((sum, file) => sum + file.size, 0);
  return total > memberBytes ? tooLarge('The files of this player are', total, memberBytes) : null;
};

export { uploadLimit };
