/* @layer renderer-app @kind logic */
import { useScreenStateStore } from '@drizztdourden08/brock-react';

const isUnder = (scope: string, prefix: string): boolean => scope === prefix || scope.startsWith(`${prefix}/`);

const resetScreens = (...prefixes: readonly string[]) => (): void => {
  const { byScope, hydrate } = useScreenStateStore.getState();
  hydrate(Object.fromEntries(Object.entries(byScope).filter(([scope]) => !prefixes.some((prefix) => isUnder(scope, prefix)))));
};

export { resetScreens };
