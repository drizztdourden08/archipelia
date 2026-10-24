/* @layer server @kind logic */
import { DOMAIN } from '@archipelia/model';
import { ADMIN_TOKEN_FILE } from '@archipelia/server';
import { createNodeDomains } from '@archipelia/server/node';
import type { CliCommand } from '../cli.type';

const tokenCommand: CliCommand = async (_command, { dataDir, out, err }) => {
  const files = createNodeDomains(dataDir).domain(DOMAIN.server);
  out(files.path(ADMIN_TOKEN_FILE));
  if (await files.exists(ADMIN_TOKEN_FILE)) return 0;
  err('That file does not exist yet. Start the server once and it makes the token.');
  return 1;
};

export { tokenCommand };
