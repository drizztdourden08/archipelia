/* @layer electron-main @kind logic */
import { MAX_BUILD_LINES } from './builds.constants';

const createBuildLines = () => {
  const logs = new Map<string, string[]>();
  return {
    reset: (id: string): void => { logs.set(id, []); },
    add: (id: string, line: string): void => {
      const lines = logs.get(id);
      if (!lines) return;
      lines.push(line);
      if (lines.length > MAX_BUILD_LINES) lines.shift();
    },
    take: (id: string): string[] => logs.get(id) ?? [],
  };
};

export { createBuildLines };
