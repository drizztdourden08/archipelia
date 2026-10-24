/* @layer core @kind logic */
import { KIB, MIB } from './format-size.constants';

const formatSize = (bytes: number): string => {
  const [unit, label] = bytes >= MIB ? [MIB, 'MiB'] : [KIB, 'KiB'];
  return `${Math.round((bytes / unit) * 10) / 10} ${label}`;
};

export { formatSize };
