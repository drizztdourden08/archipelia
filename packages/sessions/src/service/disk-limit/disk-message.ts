/* @layer core @kind logic */
import { GIB, MIB } from './disk-limit.constants';

const diskMessage = (bytes: number): string => {
  const size = bytes >= GIB ? `${Number((bytes / GIB).toFixed(1))} GiB` : `${Math.round(bytes / MIB)} MiB`;
  return `Generate filled more than ${size} of disk and was stopped.`;
};

export { diskMessage };
