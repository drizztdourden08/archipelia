/* @layer core @kind logic */

class FeedError extends Error {
  readonly kind: 'rate-limited' | 'http';

  readonly retryAt?: number;

  constructor(kind: 'rate-limited' | 'http', message: string, retryAt?: number) {
    super(message);
    this.kind = kind;
    this.retryAt = retryAt;
  }
}

export { FeedError };
