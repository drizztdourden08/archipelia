/* @layer client-kit @kind logic */
import { runCli } from './run-cli';

const main = async (): Promise<void> => {
  process.exitCode = await runCli(process.argv.slice(2), {
    cwd: process.cwd(),
    out: (text) => process.stdout.write(text),
    err: (text) => process.stderr.write(text),
  });
};

await main();
