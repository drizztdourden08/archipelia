/* @layer renderer-app @kind types */
import type { WidgetLayout, WidgetState } from '@drizztdourden08/tessera/composites';
import type { ReactNode } from 'react';

type SessionDockProps = {
  layout: WidgetLayout;
  content: Record<string, ReactNode>;
  onUpdate: (id: string, patch: Partial<WidgetState>) => void;
  onClose: (id: string) => void;
};

export type { SessionDockProps };
