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
import {ValueDetailKind} from './ValueDetail';

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

    const rootScope = new Scope(ScopeType.BLOCK, null, internalScopeValueMap[mode]);
    const contextScope = context instanceof Scope ? context : new Scope(ScopeType.READONLY, rootScope, context);

    const ins = new Walker({
      sourceCode: code,
      globalThis: globalThis || contextScope.getScopeValue(),
      scope: contextScope,
      rootScope,
      node: ast,
      visitorMap: es5,
    });

    rootScope.declare(ValueDetailKind.VAR, 'eval', () => (code: string) => this.evaluate(code));

    const result = ins.run();
    return result;
  };
}
