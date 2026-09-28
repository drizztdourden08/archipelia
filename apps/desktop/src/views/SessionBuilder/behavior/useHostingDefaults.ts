/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '../../../settings.type';
import { hostingDefaults } from './hosting-defaults';

const useHostingDefaults = () => {
  const { settings } = useSettings<AppSettings>();
  return useMemo(() => hostingDefaults(settings), [settings]);
};

export { useHostingDefaults };
