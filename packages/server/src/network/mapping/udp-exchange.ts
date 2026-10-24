/* @layer core @kind logic */
import type { UdpAnswer, UdpExchange } from './udp-exchange.type';
import { GATEWAY_PORT, RETRY_DELAYS_MS } from './mapping.constants';

const udpExchange = async ({ ports, gateways, payloadFor, accept }: UdpExchange): Promise<UdpAnswer | null> => {
  if (gateways.length === 0) return null;
  const delays = ports.retryDelaysMs ?? RETRY_DELAYS_MS;
  return new Promise<UdpAnswer | null>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let endpoint: Awaited<ReturnType<typeof ports.openUdp>> | undefined;

    const finish = (answer: UdpAnswer | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      void endpoint?.close();
      resolve(answer);
    };

    const sendRound = (round: number) => {
      if (settled) return;
      for (const gateway of gateways) {
        const payload = payloadFor(gateway);
        if (payload) endpoint?.send(payload, GATEWAY_PORT, gateway);
      }
      timer = setTimeout(() => (round + 1 < delays.length ? sendRound(round + 1) : finish(null)), delays[round]);
    };

    ports
      .openUdp({
        onMessage: (data, from) => {
          if (gateways.includes(from.address) && accept(data)) finish({ data, gateway: from.address });
        },
        onError: () => undefined,
      })
      .then((opened) => {
        endpoint = opened;
        if (settled) void opened.close();
        else sendRound(0);
      })
      .catch(() => finish(null));
  });
};

export { udpExchange };
