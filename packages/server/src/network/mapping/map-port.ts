/* @layer core @kind logic */
import type { MapAttempt, Mapper, MapPortOptions, PortMapResult } from './mapping.type';
import { assessCgnat } from './assess-cgnat';
import { describeCgnat } from './describe-cgnat';
import { describeMapFailure } from './describe-map-failure';
import { DEFAULT_DESCRIPTION } from './mapping.constants';
import { natpmpMapper } from './natpmp/natpmp-mapper';
import { noOpMap } from './no-op-map';
import { pcpMapper } from './pcp/pcp-mapper';
import { startRenewal } from './start-renewal';
import { upnpMapper } from './upnp/upnp-mapper';

const lookup = async (find: (() => Promise<string | null>) | undefined): Promise<string | null> => {
  try {
    return find ? await find() : null;
  } catch {
    return null;
  }
};

const mapPort = async (options: MapPortOptions): Promise<PortMapResult> => {
  if (options.automation) return noOpMap();
  const { port, protocol, ttl, ports, onChange, description = DEFAULT_DESCRIPTION } = options;
  const attempts: MapAttempt[] = [];
  const mappers: Mapper[] = [pcpMapper, natpmpMapper, upnpMapper];
  for (const mapper of mappers) {
    const outcome = await mapper.open({ port, protocol, ttl, description, ports }).catch((error: unknown) => ({
      ok: false as const,
      kind: 'error' as const,
      detail: error instanceof Error ? error.message : String(error),
    }));
    if (!outcome.ok) {
      attempts.push({ method: mapper.method, outcome: outcome.kind, detail: outcome.detail });
      continue;
    }
    const { session } = outcome;
    const cgnat = assessCgnat(session.external.address, await lookup(ports.lookupPublicAddress));
    if (cgnat) {
      await session.release().catch(() => undefined);
      return { ok: false, reason: 'cgnat', message: describeCgnat(cgnat), attempts, cgnat, stop: () => Promise.resolve() };
    }
    const renewal = startRenewal({ method: mapper.method, session, onChange });
    const where = session.external.address ?? 'your router';
    return {
      ok: true,
      method: mapper.method,
      external: session.external,
      ttl: session.lifetime,
      message: `Port ${port} opened on your router (${mapper.method}). Players reach you at ${where}:${session.external.port}.`,
      state: renewal.state,
      stop: renewal.stop,
    };
  }
  const refused = attempts.some((attempt) => attempt.outcome === 'refused');
  return {
    ok: false,
    reason: refused ? 'refused' : 'no-router',
    message: describeMapFailure(attempts, port),
    attempts,
    cgnat: null,
    stop: () => Promise.resolve(),
  };
};

export { mapPort };
