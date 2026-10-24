/* @layer server @kind logic */
import { hostname, networkInterfaces } from 'node:os';
import type { SubjectNames } from './tls-identity.type';

const subjectNames = (): SubjectNames => {
  const host = hostname() || 'archipelia';
  const ips = Object.values(networkInterfaces())
    .flatMap((list) => list ?? [])
    .filter((entry) => entry.family === 'IPv4')
    .map((entry) => entry.address);
  return { host, dns: [...new Set([host, 'localhost'])], ips: [...new Set(['127.0.0.1', ...ips])] };
};

export { subjectNames };
