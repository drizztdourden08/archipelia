/* @layer core @kind types */
type GgHostOptions = {
  ownerId: string;
  baseUrl?: string;
  pollMs?: number;
  passwordTimeoutMs?: number;
  stopTimeoutMs?: number;
  fetch?: typeof fetch;
};

export type { GgHostOptions };
