/* @layer core @kind logic */
const passphraseSecret = (id: string) => `server-${id}-passphrase`;

export { passphraseSecret };
