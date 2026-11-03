/* @layer renderer-app @kind types */
import type { useSavedTemplate } from '../../../../hooks/useSavedTemplate';
import type { LiveTab } from '../../../../live/live.type';

type TemplateStateProps = { tab: LiveTab; saved: ReturnType<typeof useSavedTemplate> };

export type { TemplateStateProps };
