/* @layer core @kind logic */
import { createSocket } from 'node:dgram';
import type { UdpEndpoint, UdpOptions } from './network-ports.type';

const openNodeUdp = ({ port, broadcast = false, onMessage, onError }: UdpOptions): Promise<UdpEndpoint> =>
  new Promise((resolve, reject) => {
    const socket = createSocket({ type: 'udp4', reuseAddr: true });
    const failBind = (error: Error) => {
      socket.close();
      reject(error);
    };
    socket.once('error', failBind);
    socket.on('message', (data, from) => onMessage?.(data, { address: from.address, port: from.port }));
    socket.bind(port ?? 0, () => {
      socket.off('error', failBind);
      socket.on('error', (error) => onError?.(error));
      if (broadcast) socket.setBroadcast(true);
      resolve({
        send: (data, targetPort, address) => {
          socket.send(data, targetPort, address, (error) => {
            if (error) onError?.(error);
          });
        },
        close: () => new Promise<void>((done) => {
          try {
            socket.close(() => done());
          } catch {
            done();
          }
        }),
      });
    });
  });

export { openNodeUdp };
