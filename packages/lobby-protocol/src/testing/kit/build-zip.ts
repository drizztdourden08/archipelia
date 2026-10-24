/* @layer testing @kind logic */
import { crc32 } from 'node:zlib';
import type { ZipEntry } from './kit.type';
import { CENTRAL_SIZE, DOS_DATE, END_SIZE, LOCAL_SIZE } from './build-zip.constants';

const localHeader = (name: Buffer, data: Uint8Array): Buffer => {
  const header = Buffer.alloc(LOCAL_SIZE);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(DOS_DATE, 12);
  header.writeUInt32LE(crc32(data), 14);
  header.writeUInt32LE(data.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(name.length, 26);
  return Buffer.concat([header, name]);
};

const centralHeader = (name: Buffer, data: Uint8Array, offset: number): Buffer => {
  const header = Buffer.alloc(CENTRAL_SIZE);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(DOS_DATE, 14);
  header.writeUInt32LE(crc32(data), 16);
  header.writeUInt32LE(data.length, 20);
  header.writeUInt32LE(data.length, 24);
  header.writeUInt16LE(name.length, 28);
  header.writeUInt32LE(offset, 42);
  return Buffer.concat([header, name]);
};

const endRecord = (count: number, size: number, offset: number): Buffer => {
  const end = Buffer.alloc(END_SIZE);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(count, 8);
  end.writeUInt16LE(count, 10);
  end.writeUInt32LE(size, 12);
  end.writeUInt32LE(offset, 16);
  return end;
};

const buildZip = (entries: ZipEntry[]): Uint8Array => {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const local = Buffer.concat([localHeader(name, entry.data), entry.data]);
    centrals.push(centralHeader(name, entry.data, offset));
    locals.push(local);
    offset += local.length;
  }
  const central = Buffer.concat(centrals);
  return new Uint8Array(Buffer.concat([...locals, central, endRecord(entries.length, central.length, offset)]));
};

export { buildZip };
