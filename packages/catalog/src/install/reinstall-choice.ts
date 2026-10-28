/* @layer core @kind logic */
import { releaseVersion } from '../first-party/release-version';
import type { createVersions } from '../versions/create-versions';
import type { ReinstallChoice, ReinstallChoiceParams } from './reinstall-choice.type';

const reinstallChoice = async (versions: ReturnType<typeof createVersions>, { entry, registry, ap, before }: ReinstallChoiceParams): Promise<ReinstallChoice> => {
  if (before?.release) {
    const { pinned, note } = await versions.repin({ entry, registry, ap, before: before.release });
    if (pinned) return { ...pinned, ...(note ? { note } : {}) };
  }
  return (await versions.current({ entry, registry, ap })) ?? { entry, version: releaseVersion(entry) ?? '' };
};

export { reinstallChoice };
