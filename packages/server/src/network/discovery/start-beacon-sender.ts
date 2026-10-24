/* @layer core @kind logic */
import { BEACON_INTERVAL_MS, BEACON_PORT, buildBeacon } from '@archipelia/lobby-protocol';
import type { BeaconSenderOptions } from './advertise.type';
import { broadcastTargets } from './broadcast-targets';

const startBeaconSender = async ({ ports, current, intervalMs = BEACON_INTERVAL_MS, onError }: BeaconSenderOptions) => {
  const endpoint = await ports.openUdp({ broadcast: true, onError });
  const send = () => {
    try {
      const text = buildBeacon(current());
      for (const target of broadcastTargets(ports.interfaces())) endpoint.send(text, BEACON_PORT, target);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };
  send();
  const timer = setInterval(send, intervalMs);
  timer.unref();
  return {
    send,
    stop: async () => {
      clearInterval(timer);
      await endpoint.close();
    },
  };
};

export { startBeaconSender };
