/* @layer core @kind logic */
import type { AdvertiseHandle } from './advertise.type';

const noOpAdvertiser = (): AdvertiseHandle => ({
  active: false,
  update: () => undefined,
  stop: () => Promise.resolve(),
});

export { noOpAdvertiser };
