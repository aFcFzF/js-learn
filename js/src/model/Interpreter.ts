/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { DEFAULT_INTERPRETER_MODE } from '../const';
import { es5 } from '../standard/es5';
import { ModeType } from '../types';
import { Scope, ScopeType, ScopeData, DEFAULT_INTERNAL_FULL_SCOPE_DATA } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import * as ESTree from 'estree';

export interface InterpreterOption {
  mode?: ModeType;
  rootScope?: Record<string, any> | Scope;
  globalThis?: any;
}

const internalScopeDataMap: Record<Required<InterpreterOption>['mode'], ScopeData> = {
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

  public evaluate = (code: string, option?: Omit<InterpreterOption, 'rootScope'> & { scope?: InterpreterOption['rootScope'] }): any => {
    const { mode, globalThis: rootGlobalThis, rootScope: rootScopeData } = this.option;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    const {
      mode: evalMode,
      globalThis: evalGlobalThis,
      scope: evalScopeData,
    } = option || {};

    // 必须每次重新生成，否则实例化之后每次都在同1个作用域
    let scope!: Scope;
    const descOrderScopeDataList = [internalScopeDataMap[evalMode || mode], rootScopeData, evalScopeData];
    descOrderScopeDataList.forEach((scopeData) => {
      if (scopeData) {
        scope = scopeData instanceof Scope ? scopeData : new Scope(ScopeType.BLOCK, scope, scopeData);
      }
    });

    const ins = new Walker({
      sourceCode: code,
      globalThis: evalGlobalThis || rootGlobalThis,
      scope,
      rootScope: scope,
      node: ast,
      visitorMap: es5,
    });

    ins.addScopeData({
      eval: (code: string) => this.evaluate(code, { scope, globalThis: evalGlobalThis, mode }),
    });

    const result = ins.evaluate();
    return result;
  };
}
