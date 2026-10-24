/* @layer core @kind types */

type FetchedResponse = {
  ok: boolean;
  status: number;
  headers: { get: (name: string) => string | null };
  json: () => Promise<unknown>;
  text: () => Promise<string>;
};

type FetchLike = (url: string, init?: { headers?: Record<string, string> }) => Promise<FetchedResponse>;

export type { FetchLike, FetchedResponse };
