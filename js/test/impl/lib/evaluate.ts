/**
 * @file evaluate.ts
 * @author afcfzf(9301462@qq.com)
 */

import { parse } from 'acorn';
import { Interpreter } from '@/src/model/Interpreter';
import { Node } from 'estree';
import { Scope, ScopeType } from '@/src/model/Scope';

const globalScope = new Scope(ScopeType.BLOCK, null, {
  test0011: 'hh',
  console,
});


export const testEval = (code: string): any => {
  const root = parse(code, {
    ecmaVersion: 8,
    sourceType: 'script',
  });

  return new Interpreter(root as Node, globalScope).evaluate();
};