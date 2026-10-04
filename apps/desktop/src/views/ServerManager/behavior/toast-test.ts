/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { ServerTest } from '@archipelia/model';

const toastTest = (label: string, test: ServerTest): void => {
  if (test.ok) toast(`${label} is ready`, { variant: 'success' });
  else toast(`${label} is not ready: ${test.message}`, { variant: 'danger' });
};

export { toastTest };
