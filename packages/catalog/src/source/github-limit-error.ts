/* @layer core @kind logic */

const timeText = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

class GithubLimitError extends Error {
  override readonly name = 'GithubLimitError';
  readonly resetAt: number;

  constructor(resetAt: number) {
    super(`GitHub asks Archipelia to wait. Try again at ${timeText(resetAt)}.`);
    this.resetAt = resetAt;
  }
}

export { GithubLimitError };
