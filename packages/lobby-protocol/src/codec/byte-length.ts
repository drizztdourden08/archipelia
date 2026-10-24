/* @layer protocol @kind logic */

const encoder = new TextEncoder();

const byteLength = (text: string): number => encoder.encode(text).length;

export { byteLength };
