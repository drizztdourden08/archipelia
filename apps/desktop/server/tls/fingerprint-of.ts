/* @layer server @kind logic */
import { X509Certificate } from 'node:crypto';

const fingerprintOf = (certPem: string): string => new X509Certificate(certPem).fingerprint256;

export { fingerprintOf };
