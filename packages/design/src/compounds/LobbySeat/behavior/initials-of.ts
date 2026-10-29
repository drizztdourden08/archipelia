/* @layer renderer-app @kind logic */
import { INITIALS_LENGTH } from '../LobbySeat.constants';

const capitalsOf = (word: string): string => word.replace(/[^A-Z0-9]/g, '');

const initialsOf = (label: string): string => {
  const [first = '', second] = label.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (second !== undefined) return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  if (!first) return '?';
  const capitals = capitalsOf(first);
  return (capitals.length >= INITIALS_LENGTH ? capitals : first).slice(0, INITIALS_LENGTH).toUpperCase();
};

export { initialsOf };
