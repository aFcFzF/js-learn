/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { es5 } from '../standard/es5';
import { Scope, ScopeType, ScopeValue, defaultFullScopeValue } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import * as ESTree from 'estree';

interface InterpreterOption {
  mode?: 'expr' | 'full' | 'custom';
  rootScope?: Record<string, any>;
  globalThis?: any;
}

const rootScopeValueMap: Record<Required<InterpreterOption>['mode'], ScopeValue> = {
  expr: {},
  full: defaultFullScopeValue,
  custom: {},
};

export class Interpreter {
  private option: Required<InterpreterOption>;

  constructor(option?: InterpreterOption) {
    const {
      mode = 'full',
      globalThis,
      rootScope = {},
    } = option || {};

    this.option = {
      mode,
      globalThis,
      rootScope,
    };
  }

  public evaluate = (code: string): any => {
    const { mode, globalThis, rootScope: rootScopeValue } = this.option;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    // 必须每次重新生成，否则实例化之后每次都在同1个作用域
    const scopeValue = rootScopeValueMap[mode];
    const rootScope = new Scope(ScopeType.BLOCK, null, { ...scopeValue, ...rootScopeValue });
    const ins = new Walker({
      globalThis,
      scope: rootScope,
      node: ast,
      visitorMap: es5,
    });

    const result = ins.evaluate();
    return result;
  };
}
