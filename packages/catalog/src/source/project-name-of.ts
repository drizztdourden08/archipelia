/* @layer core @kind logic */
import { parse } from 'smol-toml';
import { isRecord } from '@archipelia/model';
import { SETUP_CFG_NAME, SETUP_PY_NAME } from './source.constants';
import type { SetupFiles } from './source.type';

const textName = (value: unknown): string | undefined => (typeof value === 'string' && value !== '' ? value : undefined);

const fromPyproject = (text: string | undefined): string | undefined => {
  if (!text) return undefined;
  try {
    const doc = parse(text);
    const poetry = isRecord(doc.tool) && isRecord(doc.tool.poetry) ? doc.tool.poetry.name : undefined;
    return textName(isRecord(doc.project) ? doc.project.name : undefined) ?? textName(poetry);
  } catch {
    return undefined;
  }
};

const projectNameOf = ({ pyproject, setupCfg, setupPy }: SetupFiles): string | undefined =>
  fromPyproject(pyproject) ?? (setupCfg ? SETUP_CFG_NAME.exec(setupCfg)?.[1] : undefined) ?? (setupPy ? SETUP_PY_NAME.exec(setupPy)?.[1] : undefined);

export { projectNameOf };
