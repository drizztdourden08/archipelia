/* @layer core @kind config */
import type { SourceBuildJob } from '@archipelia/model';

const BUILD_TEXT = {
  desktopOnly: 'Building from source works in the desktop app only.',
  busy: 'Archipelia is already building a package. Wait for it to finish or cancel it.',
  confirm: 'Confirm that you trust this project before Archipelia downloads its source.',
  notPlanned: 'Archipelia only builds a project you opened from the list. Open the project again.',
  none: 'There is no build to continue. Start it again.',
  invalid: 'That build request is not valid.',
  archiveChanged: 'The downloaded source changed on disk. Nothing was built.',
  oneWheel: 'The build did not make exactly one wheel, so Archipelia installs nothing.',
  noFit: 'The wheel that was built does not fit this engine, so Archipelia installs nothing.',
  tooLarge: 'The wheel that was built is larger than Archipelia takes.',
  noRust: 'The Rust of Archipelia is not installed, so there are no crates to download.',
} as const;

const STEP_FAILED: Record<SourceBuildJob, string> = {
  venv: 'Archipelia could not set up a private build folder with the engine Python.',
  tools: 'Archipelia could not install the build tools into the private build folder.',
  crates: 'Archipelia could not download the Rust crates of this project.',
  wheel: 'The build failed. The log says why.',
};

export { BUILD_TEXT, STEP_FAILED };
