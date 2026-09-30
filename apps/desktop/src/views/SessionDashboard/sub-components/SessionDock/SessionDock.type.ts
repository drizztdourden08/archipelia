/* @layer renderer-app @kind types */
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { ReactNode } from 'react';

type SessionDockProps = {
  layout: WidgetLayout;
  content: Record<string, ReactNode>;
  onLayoutChange: (layout: WidgetLayout) => void;
};

export type { SessionDockProps };
