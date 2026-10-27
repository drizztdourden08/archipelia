/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import { MODULE_NAME } from '../manifest/manifest.constants';
import { badValue } from './bad-value';

const checkModule = (module: string): KitIssue[] =>
  MODULE_NAME.test(module) ? [] : [badValue('module', `module "${module}" must be a Python package name.`)];

export { checkModule };
