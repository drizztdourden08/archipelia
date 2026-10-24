/* @layer testing @kind logic */
import type { FakeClient, FakeClientOptions } from './fake.type';
import { createScenarioKit } from '../kit/create-scenario-kit';
import { playScript } from '../play/play-script';
import { DEFAULT_TIMEOUT_MS } from './fake.constants';

const createFakeClient = (options: FakeClientOptions): FakeClient => {
  const kit = options.kit ?? createScenarioKit();
  const play = () =>
    playScript({
      role: 'client',
      lines: options.scenario.lines,
      values: kit.values,
      files: kit.files,
      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      host: options.host,
      ignore: options.ignore ?? [],
      io: {
        open: options.connect,
        reopen: (current) => {
          current.close(1000);
          return options.connect();
        },
      },
    });
  return { play };
};

export { createFakeClient };
