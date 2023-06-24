/**
 * @file Function.ts
 * @author afcfzf(9301462@qq.com)
 */

import {
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
} from 'estree';
import { Walker } from './Walker';
import { Scope, ScopeType } from './Scope';
import { ValueDetailKind } from './ValueDetail';
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

export const createFunction = (itprNode: Walker<FunctionExpression | FunctionDeclaration | ArrowFunctionExpression>): Function => {
  const { node, scope, sourceCode, globalThis } = itprNode;
  const { params, body, start = 0, end = 0 } = node;

  let fnName: string | undefined;
  if ('id' in node && node.id) {
    const { name } = node.id;
    fnName = name;
  }

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
      fnScope.declare(ValueDetailKind.VAR, param.name, args[idx]);
      argsValue.push(value);
    });

    // 箭头函数一定无id
    if (fnName) {
      fnScope.declare(ValueDetailKind.VAR, fnName, fn);
    }
    // 箭头函数无this，因此箭头函数找this -> fnScope
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let context = this;
    if (node.type === 'ArrowFunctionExpression') {
      const scopeValueRef = scope.search('this');
      try {
        context = scopeValueRef.getValue();
      } catch (err) {
        if (err instanceof ReferenceError) {
          context = globalThis;
        }
      }
    }

    fnScope.declare(ValueDetailKind.VAR, 'this', context);

    if (!argumentsIsDefined) {
      fnScope.declare(ValueDetailKind.VAR, 'arguments', argsValue);
    }

    const result = itprNode.walk(body, fnScope);
    if (Signal.isReturn(result)) {
      return result.val;
    }

    // result 不应该返回, 例如: new Person
  };

  updateFuncInfo({
    fn,
    name: fnName,
    length: params.length,
    sourceCode,
    start,
    end,
  });

  return fn;
};

// export const scanVariable
