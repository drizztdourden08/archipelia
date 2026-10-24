/* @layer server @kind entry */
import './shims/node-globals';
import { resolveDataDir, runServer } from '@drizztdourden08/brock-electron/server';
import { createNodeDomains } from '@archipelia/server/node';
import { SERVE_COMMANDS } from './cli/cli.constants';
import { parseCommand } from './cli/parse-command';
import { runCli } from './cli/run-cli';
import { startServer } from './start/start-server';

const argv = process.argv.slice(2);
const command = parseCommand(argv);

if (SERVE_COMMANDS.includes(command.name)) {
  void runServer(startServer, { domains: createNodeDomains });
} else {
  const write = (stream: NodeJS.WriteStream) => (line: string) => void stream.write(`${line}\n`);
  void runCli(command, {
    dataDir: resolveDataDir(argv, process.env, process.cwd()), args: argv, env: process.env, out: write(process.stdout), err: write(process.stderr),
  }).then(
    (code) => { process.exitCode = code; },
    (error: unknown) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    },
  );
}
