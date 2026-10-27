/* @layer electron-main @kind logic */
import { readFile } from 'node:fs/promises';

const readBuildLog = async (logFile: string | undefined): Promise<string[]> => {
  if (logFile === undefined) return [];
  try {
    return (await readFile(logFile, 'utf8')).split(/\r?\n/).filter((line) => line.length > 0);
  } catch {
    return [];
  }
};

export { readBuildLog };
