/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'General', icon: 'settings', order: 1, keywords: ['window', 'fullscreen', 'developer', 'logging'] };

const windowModes = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen without a frame or a title bar.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the display until you leave fullscreen.' },
];

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      {
        key: 'windowMode',
        label: 'Window mode',
        description: 'Windowed, borderless or fullscreen.',
        hint: 'Borderless and fullscreen hide the title bar.',
        control: { kind: 'choice', options: windowModes },
      },
      {
        key: 'startFullscreen',
        label: 'Start fullscreen',
        description: 'Open in fullscreen on launch.',
        hint: 'Applies the next time Archipelia starts.',
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    items: [
      {
        key: 'developerToolsEnabled',
        label: 'Developer tools',
        description: 'Allow opening the developer tools.',
        hint: 'Adds the developer console to the menu.',
      },
      {
        key: 'allowDebugLogging',
        label: 'Debug logging',
        description: 'Write debug lines to the session log.',
        hint: 'Makes the log larger; turn it on to report a problem.',
      },
    ],
  },
];

export default sections;
export { meta };
