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
  private rootScope: Scope;

  private globalThis: InterpreterOption['globalThis'];

  constructor(option?: InterpreterOption) {
    const {
      mode = 'expr',
      rootScope,
      globalThis,
    } = option || {};

    const scopeValue = rootScopeValueMap[mode];

    this.globalThis = globalThis;
    this.rootScope = new Scope(ScopeType.BLOCK, null, { ...scopeValue, ...rootScope });
  }

  public evaluate = (code: string): any => {
    const { globalThis, rootScope } = this;
    const ast = parse(code, { ecmaVersion: 2023 }) as ESTree.Node;

    new Walker({
      globalThis,
      scope: rootScope,
      node: ast,
      visitorMap: es5,
    });
  };
}
