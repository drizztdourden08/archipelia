/* @layer core @kind logic */
const passwordSecret = (id: string) => `server-${id}-password`;

const passphraseSecret = (id: string) => `server-${id}-passphrase`;

export { passphraseSecret, passwordSecret };
