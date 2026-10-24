/* @layer server @kind logic */
import { chmod, readFile } from 'node:fs/promises';
import { X509Certificate } from 'node:crypto';
import type { DataFiles } from '@archipelia/model';
import type { ServerConfig } from '../config/server-config.type';
import { fingerprintOf } from './fingerprint-of';
import { makeCertificate } from './make-certificate';
import { subjectNames } from './subject-names';
import { CERT_RENEW_DAYS, DAY_MS, OWNER_ONLY, TLS_CERT_FILE, TLS_KEY_FILE } from './tls.constants';
import type { TlsIdentity } from './tls-identity.type';

const keptCertificate = async (files: DataFiles, now: number) => {
  const [key, cert] = await Promise.all([files.readText(TLS_KEY_FILE), files.readText(TLS_CERT_FILE)]);
  if (!key || !cert) return null;
  try {
    const expires = new Date(new X509Certificate(cert).validTo).getTime();
    return expires - now > CERT_RENEW_DAYS * DAY_MS ? { key, cert } : null;
  } catch {
    return null;
  }
};

const generated = async (files: DataFiles, now: number): Promise<TlsIdentity> => {
  const kept = await keptCertificate(files, now);
  if (kept) return { ...kept, fingerprint: fingerprintOf(kept.cert), source: 'generated' };
  const made = await makeCertificate(subjectNames(), now);
  await files.writeText(TLS_KEY_FILE, made.key);
  await files.writeText(TLS_CERT_FILE, made.cert);
  await chmod(files.path(TLS_KEY_FILE), OWNER_ONLY).catch(() => undefined);
  return { ...made, fingerprint: fingerprintOf(made.cert), source: 'generated' };
};

const resolveTls = async (tls: ServerConfig['tls'], files: DataFiles, now = Date.now()): Promise<TlsIdentity | null> => {
  if (tls.key !== '' || tls.cert !== '') {
    if (tls.key === '' || tls.cert === '') throw new Error('tls.key and tls.cert are set together: one of them is missing');
    const [key, cert] = await Promise.all([readFile(tls.key, 'utf8'), readFile(tls.cert, 'utf8')]);
    return { key, cert, fingerprint: fingerprintOf(cert), source: 'configured' };
  }
  return tls.selfSigned ? generated(files, now) : null;
};

export { resolveTls };
