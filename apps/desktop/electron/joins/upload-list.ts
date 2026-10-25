/* @layer electron-main @kind logic */
import type { JoinDeps, JoinRecord, UploadFile } from './joins.type';

const uploadList = (record: JoinRecord, deps: JoinDeps): UploadFile[] => {
  const { world, yaml } = record;
  const text: UploadFile = { sha256: yaml.sha256, kind: 'yaml', bytes: () => Promise.resolve(new TextEncoder().encode(yaml.text)) };
  return world ? [{ sha256: world.sha256, kind: 'world', bytes: () => deps.readWorld(world.path) }, text] : [text];
};

export { uploadList };
