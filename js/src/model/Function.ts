/**
 * @file Function.ts
 * @author afcfzf(9301462@qq.com)
 */

import { FunctionDeclaration, FunctionExpression } from 'estree';
import { Interpreter } from './Interpreter';
import { Scope, ScopeType } from './Scope';
import { VariableKind } from './Variable';
import { Signal } from './Signal';

export const createFunction = (itprNode: Interpreter<FunctionExpression | FunctionDeclaration>): Function => {
  const { node: { params, body }, scope } = itprNode;
  const fn = function (...args: unknown[]): any {
    const fnScope = new Scope(ScopeType.FUNCTION, scope);
    params.forEach((param, idx) => {
      if (param.type !== 'Identifier') {
        throw new Error(`function param type not support: ${param}`);
      }

      // fn运行时，再定义
      fnScope.declare(VariableKind.VAR, param.name, args[idx]);
    });

    // @ts-ignore
    fnScope.declare(VariableKind.VAR, 'this', this);

    const result = itprNode.interpret(body, fnScope);
    if (Signal.isReturn(result)) {
      return result.val;
    }
  };

  return fn;
};
