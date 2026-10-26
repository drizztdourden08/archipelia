/* @layer renderer-app @kind logic */
import type { InstallFailure } from '@archipelia/model';
import type { GameDetailsProps } from '@archipelia/design';

const needProps = (need: InstallFailure | undefined): Pick<GameDetailsProps, 'need'> => {
  if (!need) return {};
  const href = need.packages.find((found) => found.githubUrl)?.githubUrl;
  return { need: { message: need.message, ...(href ? { href } : {}) } };
};

export { needProps };
