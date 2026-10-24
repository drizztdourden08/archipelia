/* @layer server @kind logic */
import { readFile } from 'node:fs/promises';
import { DOMAIN } from '@archipelia/model';
import { createNodeDomains } from '@archipelia/server/node';
import type { ServerConfig } from '../config/server-config.type';
import { fingerprintOf } from '../tls/fingerprint-of';
import { TLS_CERT_FILE } from '../tls/tls.constants';

const tlsLine = async (dataDir: string, tls: ServerConfig['tls']): Promise<string> => {
  try {
    if (tls.cert !== '') return `TLS: certificate ${tls.cert}, SHA-256 fingerprint ${fingerprintOf(await readFile(tls.cert, 'utf8'))}`;
    const kept = await createNodeDomains(dataDir).domain(DOMAIN.server).readText(TLS_CERT_FILE);
    if (kept) return `TLS: self-signed, SHA-256 fingerprint ${fingerprintOf(kept)}`;
    return tls.selfSigned ? 'TLS: a self-signed certificate is made on the first start' : 'TLS: off';
  } catch (error) {
    return `TLS: the certificate cannot be read: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export { tlsLine };
