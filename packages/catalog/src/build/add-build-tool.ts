/* @layer core @kind logic */
import type { SourceBuildPlan } from '@archipelia/model';
import { resolvePackages, venvPython } from '@archipelia/engine';
import type { BuildDeps, BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { buildPlanOf } from './build-plan-of';
import { assertPinsHashed } from './assert-pins-hashed';
import { isConfined } from './is-confined';

const addBuildTool = async (deps: Pick<BuildDeps, 'sandbox' | 'toolsDir'>, session: BuildSession, id: string, name: string): Promise<SourceBuildPlan> => {
  const build = session.current();
  const archive = build?.archive;
  if (build?.id !== id || build.phase !== 'ready' || archive === undefined) throw new Error(BUILD_TEXT.none);
  if (!build.pins.some((pin) => pin.name.toLowerCase() === name)) {
    const found = await resolvePackages({ ...build.runtime, python: venvPython(build.dirs.venv) }, [name], { signal: build.controller.signal });
    assertPinsHashed(found);
    build.pins = [...build.pins, ...found.filter((added) => !build.pins.some((pin) => pin.name === added.name))];
  }
  return buildPlanOf(build, archive, await isConfined(deps, build));
};

export { addBuildTool };
