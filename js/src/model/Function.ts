/**
 * @file Function.ts
 * @author afcfzf(9301462@qq.com)
 */

import { FunctionDeclaration, FunctionExpression } from 'estree';
import { Walker } from './Walker';
import { Scope, ScopeType } from './Scope';
import { VariableKind } from './Variable';
import { Signal } from './Signal';

interface UpdateFuncInfoOption {
  fn: Function;
  sourceCode: string;
  start: number;
  end: number;
  name?: string;
  length?: number;
}

export const updateFuncInfo = (option: UpdateFuncInfoOption): void => {
  const { fn, name, length, sourceCode, start, end } = option;
  if (name) {
    Object.defineProperty(fn, 'name', {
      value: name,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }

  if (length) {
    Object.defineProperty(fn, 'length', {
      value: length,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  }

  Object.defineProperty(fn, 'toString', {
    value: () => sourceCode.slice(start, end),
    writable: true,
    configurable: true,
    enumerable: false,
  });
};

export const createFunction = (itprNode: Walker<FunctionExpression | FunctionDeclaration>): Function => {
  const { node: { params, body, id, start = 0, end = 0 }, scope, sourceCode } = itprNode;
  const fn = function (...args: unknown[]): any {
    const fnScope = new Scope(ScopeType.FUNCTION, scope);

    const argsValue: unknown[] = [];
    let argumentsIsDefined = false;
    params.forEach((param, idx) => {
      if (param.type !== 'Identifier') {
        throw new Error(`function param type not support: ${param}`);
      }

      if (!argumentsIsDefined) {
        argumentsIsDefined = param.name === 'arguments';
      }

      // fn运行时，再定义
      const value = args[idx];
      fnScope.declare(VariableKind.VAR, param.name, args[idx]);
      argsValue.push(value);
    });

    // 用于内部访问
    if (id) {
      const { name } = id;
      fnScope.declare(VariableKind.VAR, name, fn);
    }

    // @ts-ignore
    fnScope.declare(VariableKind.VAR, 'this', this);
    if (!argumentsIsDefined) {
      fnScope.declare(VariableKind.VAR, 'arguments', argsValue);
    }

    const result = itprNode.walk(body, fnScope);
    if (Signal.isReturn(result)) {
      return result.val;
    }

    // result 不应该返回, 例如: new Person
  };

  updateFuncInfo({
    fn,
    name: id?.name,
    length: params.length,
    sourceCode,
    start,
    end,
  });

  return fn;
};

// export const scanVariable
