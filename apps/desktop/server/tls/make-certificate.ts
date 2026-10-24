/* @layer server @kind logic */
import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import * as x509 from '@peculiar/x509';
import { CERT_VALID_DAYS, DAY_MS, KEY_CURVE, SERIAL_BYTES, SIGNING } from './tls.constants';
import type { MadeCertificate, SubjectNames } from './tls-identity.type';

const makeCertificate = async (names: SubjectNames, now = Date.now()): Promise<MadeCertificate> => {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: KEY_CURVE }, true, ['sign', 'verify']);
  const cert = await x509.X509CertificateGenerator.createSelfSigned({
    serialNumber: randomBytes(SERIAL_BYTES).toString('hex'),
    name: `CN=${names.host}`,
    notBefore: new Date(now - DAY_MS),
    notAfter: new Date(now + CERT_VALID_DAYS * DAY_MS),
    signingAlgorithm: SIGNING,
    keys,
    extensions: [
      new x509.BasicConstraintsExtension(false, undefined, true),
      new x509.KeyUsagesExtension(x509.KeyUsageFlags.digitalSignature, true),
      new x509.ExtendedKeyUsageExtension([x509.ExtendedKeyUsage.serverAuth]),
      new x509.SubjectAlternativeNameExtension([
        ...names.dns.map((value) => ({ type: 'dns' as const, value })),
        ...names.ips.map((value) => ({ type: 'ip' as const, value })),
      ]),
    ],
  });
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
  return { cert: cert.toString('pem'), key: x509.PemConverter.encode(pkcs8, 'PRIVATE KEY') };
};

export { makeCertificate };
