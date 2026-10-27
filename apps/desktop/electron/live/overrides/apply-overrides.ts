/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { SessionOverrides } from '../../../src/live/live.type';

const withDirect = (template: SessionTemplate, direct: SessionOverrides['direct']): SessionTemplate => {
  if (direct === undefined) return template;
  const { direct: _kept, ...rest } = template;
  return direct === null ? rest : { ...rest, direct };
};

const applyOverrides = (saved: SessionTemplate, overrides: SessionOverrides): SessionTemplate =>
  withDirect({
    ...saved,
    players: overrides.players ?? saved.players,
    ...(overrides.lan === undefined ? {} : { lan: overrides.lan }),
    server: { ...saved.server, ...overrides.server },
    generator: { ...saved.generator, ...overrides.generator },
  }, overrides.direct);

export { applyOverrides };
