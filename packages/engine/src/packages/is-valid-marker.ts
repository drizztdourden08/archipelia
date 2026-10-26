/* @layer core @kind logic */
import type { MarkerToken as Token } from './is-valid-marker.type';
import { TOKEN, VARIABLES } from './is-valid-marker.constants';

const tokenize = (marker: string): Token[] | undefined => {
  const tokens: Token[] = [];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < marker.length) {
    const from = TOKEN.lastIndex;
    const found = TOKEN.exec(marker);
    if (!found) return marker.slice(from).trim() === '' ? tokens : undefined;
    const [, open, close, string, op, word] = found;
    if (open) tokens.push({ kind: 'open', text: open });
    else if (close) tokens.push({ kind: 'close', text: close });
    else if (string) tokens.push({ kind: 'string', text: string.slice(1, -1) });
    else if (op) tokens.push({ kind: 'op', text: op });
    else if (word) tokens.push({ kind: 'word', text: word });
  }
  return tokens;
};

class MarkerParser {
  private at = 0;

  constructor(private readonly tokens: Token[]) {}

  done() {
    return this.at === this.tokens.length;
  }

  or(): boolean {
    if (!this.and()) return false;
    while (this.word('or')) if (!this.and()) return false;
    return true;
  }

  private and(): boolean {
    if (!this.expression()) return false;
    while (this.word('and')) if (!this.expression()) return false;
    return true;
  }

  private expression(): boolean {
    if (this.tokens[this.at]?.kind === 'open') {
      this.at += 1;
      if (!this.or() || this.tokens[this.at]?.kind !== 'close') return false;
      this.at += 1;
      return true;
    }
    return this.value() && this.operator() && this.value();
  }

  private value(): boolean {
    const token = this.tokens[this.at];
    if (!token) return false;
    const ok = (token.kind === 'string' && !token.text.startsWith('-')) || (token.kind === 'word' && VARIABLES.has(token.text));
    if (ok) this.at += 1;
    return ok;
  }

  private operator(): boolean {
    const token = this.tokens[this.at];
    if (token?.kind === 'op') {
      this.at += 1;
      return true;
    }
    if (this.word('in')) return true;
    return this.word('not') && this.word('in');
  }

  private word(text: string): boolean {
    const token = this.tokens[this.at];
    const match = token?.kind === 'word' && token.text === text;
    if (match) this.at += 1;
    return match;
  }
}

const isValidMarker = (marker: string): boolean => {
  const tokens = tokenize(marker);
  if (!tokens || tokens.length === 0) return false;
  const parser = new MarkerParser(tokens);
  return parser.or() && parser.done();
};

export { isValidMarker };
