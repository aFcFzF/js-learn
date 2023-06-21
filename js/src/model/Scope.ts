/**
 * @file Scope.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Variable, VariableKind } from './Variable';
import { hasOwnProperty } from '../utils';

export type ScopeData = Record<string, any>;

export const DEFAULT_INTERNAL_FULL_SCOPE_DATA: ScopeData = {
  console,
  undefined,
  ReferenceError,
  Array,
  Date,
  RegExp,
  Object,
};

export enum ScopeType {
  FUNCTION = 'function',
  BLOCK = 'block',
}

export type ScopeValue = Record<string, Variable>;

export class Scope {
  public type: ScopeType;

  /**
   * 父作用域
   */
  public parent: Scope | null;

  /**
   * 当前作用域
   */
  public scopeValue: ScopeValue = {};

  constructor(type: ScopeType, parent: Scope | null = null, scopeValue: Record<string, any> = {}) {
    this.type = type;
    this.parent = parent;
    Object.entries(scopeValue).forEach(([key, value]) => {
      this.scopeValue[key] = new Variable({
        kind: VariableKind.VAR,
        value,
        name: key,
        scope: this,
      });
    });
  }

  /**
   * 先从自身scope找，然后从作用域链找，最后从global找
   * @param rawName
   * @returns
   */
  public search(rawName: string): Variable | null {
    if (hasOwnProperty(this.scopeValue, rawName)) {
      return this.scopeValue[rawName];
    }

    if (this.parent) {
      return this.parent.search(rawName);
    }

    return null;
  }

  /**
   * 直接读取变量时，不存在就创建
   * @param rawName
   * @returns
   */
  public getRootScope(): Scope {
    if (this.parent) {
      return this.parent.getRootScope();
    }

    return this;
  }

  public declare(kind: VariableKind, rawName: string, value: any): void {
    if (this.hasDefinition(kind, rawName)) {
      console.error(`Uncaught SyntaxError: Identifier '${rawName}' has already been declared`);
      return;
    }

    switch (kind) {
      case VariableKind.VAR:
        this.defineVar(rawName, value);
        break;
      case VariableKind.LET:
        this.defineLet(rawName, value);
        break;
      case VariableKind.CONST:
        this.defineConst(rawName, value);
        break;
      default :
        throw new Error('define error');
    }
  }

  private hasDefinition(kind: VariableKind, rawName: string): boolean {
    return [VariableKind.CONST, VariableKind.LET].includes(kind) && hasOwnProperty(this.scopeValue, rawName);
  }

  /**
   * ctx.fn = () => 1
   * 那么 function fn() { return 2 } 应该覆盖ctx
   * @param rawName
   * @param value
   */
  private defineVar(rawName: string, value: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let scope: Scope = this;
    while (scope.parent && scope.type !== ScopeType.FUNCTION && scope.scopeValue[rawName] == null) {
      scope = scope.parent;
    }

    scope.scopeValue[rawName] = new Variable({
      kind: VariableKind.VAR,
      value,
      name: rawName,
      scope,
    });
  }

  private defineLet(rawName: string, value: any): void {
    this.scopeValue[rawName] = new Variable({
      kind: VariableKind.LET,
      value,
      name: rawName,
      scope: this,
    });
  }

  private defineConst(rawName: string, value: any): void {
    this.scopeValue[rawName] = new Variable({
      kind: VariableKind.CONST,
      value,
      name: rawName,
      scope: this,
    });
  }
}
