/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { DEFAULT_INTERPRETER_MODE } from '../const';
import { es5 } from '../standard/es5';
import { ModeType } from '../types';
import { Scope, ScopeType, ScopeData, defaultFullScopeData } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import * as ESTree from 'estree';

export interface InterpreterOption {
  mode?: ModeType;
  rootScope?: Record<string, any> | Scope;
  globalThis?: any;
}

const rootScopeValueMap: Record<Required<InterpreterOption>['mode'], ScopeData> = {
  expr: {},
  full: defaultFullScopeData,
  custom: {},
};

export class Interpreter {
  private option: Required<InterpreterOption>;

  constructor(option?: InterpreterOption) {
    const {
      mode = DEFAULT_INTERPRETER_MODE,
      globalThis,
      rootScope = {},
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
    const evalModeScopeValue = new Scope(ScopeType.BLOCK, null, rootScopeValueMap[evalMode || mode]);
    const rootScope = rootScopeData instanceof Scope ? rootScopeData : new Scope(ScopeType.BLOCK, evalModeScopeValue, rootScopeData);
    const scope = evalScopeData instanceof Scope ? evalScopeData : new Scope(ScopeType.BLOCK, rootScope, evalScopeData);
    const ins = new Walker({
      sourceCode: code,
      globalThis: evalGlobalThis || rootGlobalThis,
      scope,
      rootScope,
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
