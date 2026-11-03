/* @layer renderer-app @kind component */
import { Box, Tabs } from '@drizztdourden08/tessera/primitives';
import type { SpoilerTrackerProps } from './SpoilerTracker.type';
import { SpoilerControls } from './sub-components/SpoilerControls';
import { SpoilerSummary } from './sub-components/SpoilerSummary';
import './SpoilerTracker.css';

const SpoilerTracker = ({ stats, tabs, activeTab, onTabChange, actions, filters, controls, subtotal, children }: SpoilerTrackerProps) => (
  <Box className="spoiler-tracker">
    <Box className="spoiler-tracker__header">
      <Box className="spoiler-tracker__top">
        <SpoilerSummary stats={stats} />
        {actions}
      </Box>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      {(filters || controls) && (
        <Box className="spoiler-tracker__tools">
          {filters}
          {controls && <SpoilerControls {...controls} />}
        </Box>
      )}
      {subtotal && <Box className="spoiler-tracker__subtotal">{subtotal}</Box>}
    </Box>
    <Box className="spoiler-tracker__body">{children}</Box>
  </Box>
);

export { SpoilerTracker };
