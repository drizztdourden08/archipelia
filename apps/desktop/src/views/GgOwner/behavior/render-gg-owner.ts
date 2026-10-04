/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { AppSettings } from '../../../settings.type';
import { GgOwner } from '../GgOwner';
import { GG_OWNER_ROW } from '../GgOwner.constants';

const renderGgOwner = (key: string, settings: AppSettings): ReactNode | null =>
  (key === GG_OWNER_ROW ? createElement(GgOwner, { baseUrl: settings.ggBaseUrl }) : null);

export { renderGgOwner };
