/* @layer core @kind config */
import type { SourceToolBlock } from '@archipelia/model';

const TOOL_TEXT = {
  desktopOnly: 'Installing a build tool works in the desktop app only.',
  invalid: 'That tool request is not valid.',
  confirm: 'Click Install to start. Archipelia installs nothing until you do.',
  changed: 'The command changed since it was shown. Nothing was installed. Open the step again.',
  host: 'The installer address is not one Archipelia accepts, so it downloaded nothing.',
  download: 'Archipelia could not download the installer.',
  tooLarge: 'The installer is larger than Archipelia takes.',
  hops: 'The installer address sent Archipelia in a circle, so it downloaded nothing.',
  unsigned: 'Archipelia could not confirm that Microsoft signed the installer, so it will not run it.',
  checksum: 'The installer does not match the checksum its publisher shows, so Archipelia will not run it.',
  busy: 'Archipelia is already installing a build tool. Wait for it to finish.',
  notAsked: 'Archipelia installs a build tool only after you click Install for it.',
  failed: 'The installer did not finish. The log says why.',
  noPip: 'This tool is added to the build, not run as a program.',
} as const;

const BLOCKED_TEXT: Record<SourceToolBlock, string> = {
  immutable: 'This system keeps its programs read-only, so Archipelia cannot install a compiler here. Use the commands shown instead.',
  unsupported: 'Archipelia cannot install this tool on this system. Use the steps shown instead.',
};

export { BLOCKED_TEXT, TOOL_TEXT };
