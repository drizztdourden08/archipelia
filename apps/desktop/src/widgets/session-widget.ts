/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import { defineWidget } from '@drizztdourden08/brock-react';
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';
import type { SessionWidgetInput } from './session-widget.type';

const sessionWidget = (input: SessionWidgetInput): WidgetDef => defineWidget({
  ...input,
  render: () => createElement(SessionWidget, { id: input.id }),
  defaultVisibility: 'context-only',
  popOut: true,
});

export { sessionWidget };
