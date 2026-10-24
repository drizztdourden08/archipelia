/* @layer server @kind logic */
import { DOMAIN } from '@archipelia/model';
import { ADMIN_TOKEN_FILE } from '@archipelia/server';
import { createNodeDomains } from '@archipelia/server/node';
import { loadConfig } from '../../config/load-config';
import type { CliCommand } from '../cli.type';
import { readHealth } from '../read-health';
import { tlsLine } from '../tls-line';
import { withCore } from '../with-core';

const statusCommand: CliCommand = async (_command, context) => {
  const { dataDir, args, env, out } = context;
  const { config, file } = loadConfig(dataDir, args, env);
  const health = await readHealth(dataDir);
  const files = createNodeDomains(dataDir).domain(DOMAIN.server);
  const engine = await withCore({ ...context, out: () => undefined }, (core) => core.engine.status());
  out(`data folder: ${dataDir}`);
  out(`configuration: ${file ?? 'none, the defaults and the environment apply'}`);
  out(`lobby port: ${config.port}, network: ${config.network}, public address lookup: ${config.publicLookup ? 'on' : 'off'}`);
  out(`health: ${health.text}`);
  out(`admin token: ${files.path(ADMIN_TOKEN_FILE)} (${(await files.exists(ADMIN_TOKEN_FILE)) ? 'present' : 'not made yet'})`);
  out(await tlsLine(dataDir, config.tls));
  out(`engine: ${engine.state}${engine.apVersion ? `, Archipelago ${engine.apVersion}, Python ${engine.pythonVersion ?? '?'}` : ''}${engine.error ? ` (${engine.error})` : ''}`);
  return health.healthy ? 0 : 1;
};

export { statusCommand };
