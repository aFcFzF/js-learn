/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { DEFAULT_INTERPRETER_MODE } from '../const';
import { es5 } from '../standard/es5';
import { ModeType } from '../types';
import { Scope, ScopeType, DEFAULT_INTERNAL_FULL_SCOPE_DATA, ScopeValue } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import * as ESTree from 'estree';

export interface InterpreterOption {
  mode?: ModeType;
  rootScope?: Record<string, any>;
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
      rootScope = Object.create(null),
    } = option || {};

    this.option = {
      mode,
      globalThis,
      rootScope,
    };
  }

  public evaluate = (code: string, option?: Omit<InterpreterOption, 'rootScope'> & { scope?: InterpreterOption['rootScope'] | Scope }): any => {
    const { mode, globalThis: rootGlobalThis, rootScope: rootScopeValue } = this.option;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    const {
      mode: evalMode,
      globalThis: evalGlobalThis,
      scope: evalScopeValue,
    } = option || {};

    let scope: Scope;
    if (evalScopeValue instanceof Scope) {
      scope = evalScopeValue;
    } else {
      // 如果eval设置了scope，就将rootScope合并至scope，否则以rootScope作为scope
      const scopeValue = evalScopeValue ? Object.assign(evalScopeValue, rootScopeValue) : rootScopeValue;
      scope = new Scope(ScopeType.BLOCK, null, Object.assign(scopeValue, internalScopeValueMap[evalMode || mode]));
    }

    const ins = new Walker({
      sourceCode: code,
      globalThis: evalGlobalThis || rootGlobalThis || scope.getScopeValue(),
      scope,
      rootScope: scope,
      node: ast,
      visitorMap: es5,
    });

    ins.addScopeValue({
      eval: (code: string) => this.evaluate(code, { scope, globalThis: evalGlobalThis, mode }),
    });

    const result = ins.evaluate();
    return result;
  };
}
