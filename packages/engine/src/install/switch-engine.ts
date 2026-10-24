/* @layer core @kind logic */
import type { CarryResult } from '@archipelia/model';
import type { SwitchDeps, SwitchRequest } from './install-engine.type';

const switchEngine = async (deps: SwitchDeps, { id, from, since, guard }: SwitchRequest): Promise<CarryResult | undefined> => {
  const records = guard ?? await deps.guardRecords();
  try {
    const target = await deps.runtimeOf(id);
    const pass = from && from.id !== id ? await deps.carry({ from, to: target, since }) : undefined;
    if (pass) await records.note(pass);
    await deps.activate(id);
    return pass;
  } catch (err) {
    await records.restore();
    throw err;
  }
};

export { switchEngine };
