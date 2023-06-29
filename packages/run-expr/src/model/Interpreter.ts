/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { DEFAULT_INTERPRETER_MODE, EVAL_FUNCTION_IDENTIFIER } from '../const';
import { es5 } from '../standard/es5';
import { ModeType } from '../types';
import { Scope, ScopeType, DEFAULT_INTERNAL_FULL_SCOPE_DATA, ScopeValue } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import * as ESTree from 'estree';
import { ValueDetailKind } from './ValueDetail';

export interface InterpreterOption {
  mode?: ModeType;
  context?: Record<string, any>;
  globalThis?: any;
}

const internalScopeValueMap: Record<Required<InterpreterOption>['mode'], ScopeValue> = {
  expr: {},
  full: DEFAULT_INTERNAL_FULL_SCOPE_DATA,
  custom: {},
};

export class Interpreter {
  private option: Required<InterpreterOption>;

  constructor(option?: InterpreterOption) {
    const {
      mode = DEFAULT_INTERPRETER_MODE,
      globalThis,
      context = Object.create(null),
    } = option || {};

    this.option = {
      mode,
      globalThis,
      context,
    };
  }

  public evaluate = (code: string): any => {
    const { mode, globalThis, context } = this.option;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    /**
     * envScope和rootScope区别：
     * envScope定义了执行环境，比如Number、Array、Object、Date等，是只读终点；
     * rootScope是可读可写，是declare终点。
     * 原因：用户传进来一个自定义context，不要合并，不要添加env到里面
     */
    const envScope = new Scope(ScopeType.ENV, null, internalScopeValueMap[mode]);
    const rootScope = context instanceof Scope ? context : new Scope(ScopeType.BLOCK, envScope, context);

    const ins = new Walker({
      sourceCode: code,
      globalThis: globalThis === undefined ? context : globalThis,
      scope: rootScope,
      rootScope,
      envScope,
      node: ast,
      visitorMap: es5,
    });

    const evalFunction = (code: string, scope: Scope): any => {
      const itpr = new Interpreter({
        mode,
        globalThis,
        context: scope,
      });

      return itpr.evaluate(code);
    };

    Object.defineProperty(evalFunction, EVAL_FUNCTION_IDENTIFIER, {
      value: EVAL_FUNCTION_IDENTIFIER,
      writable: false,
      enumerable: true,
    });

    envScope.declare(ValueDetailKind.VAR, 'eval', evalFunction);

    const result = ins.run();
    return result;
  };
}
