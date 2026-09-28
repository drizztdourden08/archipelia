type BuildEngineOptions = { buildDir?: string; onLine?: (line: string) => void };

declare const buildEngine: (options?: BuildEngineOptions) => Promise<string>;

export { buildEngine };
export type { BuildEngineOptions };
