/* @layer server @kind types */
type TlsIdentity = { key: string; cert: string; fingerprint: string; source: 'configured' | 'generated' };

type SubjectNames = { host: string; dns: string[]; ips: string[] };

type MadeCertificate = { key: string; cert: string };

export type { MadeCertificate, SubjectNames, TlsIdentity };
