/* @layer core @kind logic */
import type { ActiveBuild, BuildDeps } from './build.type';
import { wrapOf } from './wrap-of';

const isConfined = async (deps: Pick<BuildDeps, 'sandbox'>, build: ActiveBuild): Promise<boolean> => (await wrapOf(deps, build, 'wheel')) !== undefined;

export { isConfined };
