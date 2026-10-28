/* @layer tests @kind test */
const API = 'https://api.github.com/repos';

const releasesUrl = (repo: string) => `${API}/${repo}/releases?per_page=30`;

const downloadUrl = (repo: string, tag: string, asset: string) => `https://github.com/${repo}/releases/download/${tag}/${asset}`;

type ReleaseSpec = { tag: string; prerelease?: boolean; draft?: boolean; assets: string[] };

const releaseItem = ({ tag, prerelease = false, draft = false, assets }: ReleaseSpec, at: number) => ({
  tag_name: tag,
  draft,
  prerelease,
  published_at: `2026-10-${String(20 - at).padStart(2, '0')}T00:00:00Z`,
  assets: assets.map((name, index) => ({ id: at * 100 + index + 1, name, state: 'uploaded' })),
});

const releasesBody = (specs: ReleaseSpec[]) => specs.map(releaseItem);

type Seen = { url: string; etag: string | undefined };

const recording = (inner: typeof fetch, seen: Seen[]): typeof fetch => (input, init) => {
  const headers = (init?.headers ?? {}) as Record<string, string>;
  seen.push({ url: String(input), etag: headers['if-none-match'] });
  return inner(input, init);
};

const etagged = (inner: typeof fetch, url: string, body: unknown, etag: string): typeof fetch => (input, init) => {
  if (String(input) !== url) return inner(input, init);
  const headers = (init?.headers ?? {}) as Record<string, string>;
  if (headers['if-none-match'] === etag) return Promise.resolve(new Response(null, { status: 304 }));
  return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { etag } }));
};

export { downloadUrl, etagged, recording, releasesBody, releasesUrl };
export type { ReleaseSpec, Seen };
