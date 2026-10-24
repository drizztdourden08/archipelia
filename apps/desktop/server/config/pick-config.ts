/* @layer server @kind logic */
import { asTable } from './as-table';
import { choose } from './choose';
import { CONFIG_ENV, DEFAULT_CONFIG } from './config.constants';
import { readFlag } from './read-flag';
import { readNetwork } from './read-network';
import { readPort } from './read-port';
import { readText } from './read-text';
import type { ConfigSource, ServerConfig } from './server-config.type';

const pickConfig = (fileValues: unknown, env: ConfigSource): ServerConfig => {
  const file = asTable(fileValues);
  const engine = asTable(file.engine);
  const tls = asTable(file.tls);
  const base = DEFAULT_CONFIG;
  return {
    port: choose({ key: 'port', env: env[CONFIG_ENV.port], file: file.port, fallback: base.port, read: readPort }),
    network: choose({ key: 'network', env: env[CONFIG_ENV.network], file: file.network, fallback: base.network, read: readNetwork }),
    loopback: choose({ key: 'loopback', env: env[CONFIG_ENV.loopback], file: file.loopback, fallback: base.loopback, read: readFlag }),
    publicLookup: choose({ key: 'publicLookup', env: env[CONFIG_ENV.publicLookup], file: file.publicLookup, fallback: base.publicLookup, read: readFlag }),
    engine: {
      version: choose({ key: 'engine.version', env: env[CONFIG_ENV.engine], file: engine.version, fallback: base.engine.version, read: readText }),
      python: choose({ key: 'engine.python', env: env[CONFIG_ENV.python], file: engine.python, fallback: base.engine.python, read: readText }),
      auto: choose({ key: 'engine.auto', env: env[CONFIG_ENV.engineAuto], file: engine.auto, fallback: base.engine.auto, read: readFlag }),
    },
    tls: {
      key: choose({ key: 'tls.key', env: env[CONFIG_ENV.tlsKey], file: tls.key, fallback: base.tls.key, read: readText }),
      cert: choose({ key: 'tls.cert', env: env[CONFIG_ENV.tlsCert], file: tls.cert, fallback: base.tls.cert, read: readText }),
      selfSigned: choose({ key: 'tls.selfSigned', env: env[CONFIG_ENV.tlsSelfSigned], file: tls.selfSigned, fallback: base.tls.selfSigned, read: readFlag }),
    },
  };
};

export { pickConfig };
