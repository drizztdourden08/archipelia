/* @layer electron-main @kind types */

type SecretReader = { get: (name: string) => Promise<string | null> };

export type { SecretReader };
