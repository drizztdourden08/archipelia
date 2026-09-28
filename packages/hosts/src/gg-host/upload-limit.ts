/* @layer core @kind logic */
import { MAX_UPLOAD_BYTES } from './upload-limit.constants';

const assertUploadSize = (bytes: number, limit = MAX_UPLOAD_BYTES) => {
  if (bytes <= limit) return;
  const mib = (n: number) => (n / 1024 / 1024).toFixed(1);
  throw new Error(`the seed is ${mib(bytes)} MiB and archipelago.gg accepts at most ${mib(limit)} MiB per upload`);
};

export { assertUploadSize };
