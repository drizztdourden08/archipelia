/* @layer client-kit @kind logic */

const hasAsciiAt = (bytes: Uint8Array, offset: number, text: string): boolean =>
  bytes.length >= offset + text.length && [...text].every((character, index) => bytes[offset + index] === character.charCodeAt(0));

export { hasAsciiAt };
