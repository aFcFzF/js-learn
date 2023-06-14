/**
 * @file Function.ts
 * @author afcfzf(9301462@qq.com)
 */

import { FunctionDeclaration, FunctionExpression } from 'estree';
import { Walker } from './Walker';
import { Scope, ScopeType } from './Scope';
import { VariableKind } from './Variable';
import { Signal } from './Signal';

export const createFunction = (itprNode: Walker<FunctionExpression | FunctionDeclaration>): Function => {
  const { node: { params, body, id }, scope } = itprNode;
  const fn = function (...args: unknown[]): any {
    const fnScope = new Scope(ScopeType.FUNCTION, scope);

    params.forEach((param, idx) => {
      if (param.type !== 'Identifier') {
        throw new Error(`function param type not support: ${param}`);
      }

      // fn运行时，再定义
      fnScope.declare(VariableKind.VAR, param.name, args[idx]);
    });

    // 用于内部访问
    if (id) {
      const { name } = id;
      fnScope.declare(VariableKind.VAR, name, fn);
    }

    // @ts-ignore
    fnScope.declare(VariableKind.VAR, 'this', this);

    const result = itprNode.walk(body, fnScope);
    if (Signal.isReturn(result)) {
      return result.val;
    }

    // result 不应该返回, 例如: new Person
  };

  Object.defineProperty(fn, 'length', {
    value: params.length,
    writable: false,
    enumerable: false,
    configurable: true,
  });

  if (id?.name) {
    Object.defineProperty(fn, 'name', {
      value: id.name,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }

  return fn;
};
