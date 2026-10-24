/* @layer protocol @kind logic */
import type { Schema, SchemaProblem, Walk } from './validate.type';
import { checkArray } from './check-array';
import { checkLiteral } from './check-literal';
import { checkNumber } from './check-number';
import { checkObject } from './check-object';
import { checkOneOf } from './check-one-of';
import { checkString } from './check-string';
import { checkType } from './check-type';
import { resolveRef } from './resolve-ref';

const validateSchema = (root: Schema, value: unknown): SchemaProblem[] => {
  const walk: Walk = (node, data, path) => {
    const target = typeof node.$ref === 'string' ? resolveRef(root, node.$ref) : node;
    const typeProblems = checkType(target, data, path);
    if (typeProblems.length > 0) return typeProblems;
    return [
      ...checkLiteral(target, data, path),
      ...checkString(target, data, path),
      ...checkNumber(target, data, path),
      ...checkObject(target, data, path, walk),
      ...checkArray(target, data, path, walk),
      ...checkOneOf(target, data, path, walk),
    ];
  };
  return walk(root, value, '');
};

export { validateSchema };
