/* @layer renderer-app @kind types */
import type { WidgetDef } from '@drizztdourden08/brock-react';

type LiveWidgetId = 'players' | 'hints' | 'room';

type SessionWidgetId = LiveWidgetId | 'log' | 'console' | 'spoiler';

type SessionWidgetInput = Pick<WidgetDef, 'label' | 'icon' | 'defaultSide' | 'defaultDockedSize' | 'defaultFloatingSize'> & { id: SessionWidgetId };

export type { LiveWidgetId, SessionWidgetId, SessionWidgetInput };
