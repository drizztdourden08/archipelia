/* @layer core @kind logic */
import { PASSED_ENV, SANDBOX_ENV } from './sandbox.constants';

const sandboxEnv = (env: NodeJS.ProcessEnv): NodeJS.ProcessEnv => {
  const passed: NodeJS.ProcessEnv = {};
  for (const key of PASSED_ENV) {
    const value = env[key];
    if (value !== undefined) passed[key] = value;
  }
  return { ...SANDBOX_ENV, ...passed };
};

export { sandboxEnv };
