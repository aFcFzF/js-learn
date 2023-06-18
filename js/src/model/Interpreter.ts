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
  rootScope?: Record<string, any>;
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

  public evaluate = (code: string, option?: InterpreterOption): any => {
    const { mode, globalThis: rootGlobalThis, rootScope: rootScopeData } = this.option;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    const {
      mode: evalMode,
      globalThis: evalGlobalThis,
      rootScope: evalRootScope,
    } = option || {};

    // 必须每次重新生成，否则实例化之后每次都在同1个作用域
    const scopeValue = rootScopeValueMap[evalMode || mode];
    const rootScopeIns = new Scope(ScopeType.BLOCK, null, { ...scopeValue, ...rootScopeData, ...evalRootScope });
    const rootScope = new Scope(ScopeType.BLOCK, rootScopeIns);
    const ins = new Walker({
      globalThis: evalGlobalThis || rootGlobalThis,
      scope: rootScope,
      rootScope,
      node: ast,
      visitorMap: es5,
    });

    const result = ins.evaluate();
    return result;
  };
}
