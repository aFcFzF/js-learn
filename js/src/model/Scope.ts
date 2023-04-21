/**
 * @file Scope.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Variable, VariableKind } from './Variable';
import { defaultContext } from './Context';
import { hasOwnProperty } from '../utils';

export enum ScopeType {
  FUNCTION = 'function',
  BLOCK = 'block',
}

export class Scope {
  private type: ScopeType;

  /**
   * 父作用域
   */
  private parent: Scope | null;

  /**
   * 当前作用域
   */
  private scope: Record<string, Variable>;

  /**
   * 全局作用域环境申明变量/方法:
   */
  private globalContext: Object & Record<string, Variable> = defaultContext;

  public constructor(type: ScopeType, parent: Scope | null = null) {
    this.type = type;
    this.parent = parent;
    this.scope = {};
    this.globalContext = defaultContext;
  }

  /**
   * 先从自身scope找，然后从作用域链找，最后从global找
   * @param rawName
   * @returns
   */
  public search(rawName: string): Variable | null {
    if (hasOwnProperty(this.scope, rawName)) {
      return this.scope[rawName];
    }

    if (this.parent) {
      return this.parent.search(rawName);
    }

    return null;
  }

  public declare(kind: VariableKind, rawName: string, value: any): void {
    if (this.hasDefinition(rawName)) {
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

  private hasDefinition(rawName: string): boolean {
    return Boolean(this.search(rawName));
  }

  private defineVar(rawName: string, value: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let scope: Scope = this;
    while (scope.parent && scope.type !== 'function') {
      scope = scope.parent;
    }

    scope.scope[rawName] = new Variable(VariableKind.VAR, value);
  }

  private defineLet(rawName: string, value: any): void {
    this.scope[rawName] = new Variable(VariableKind.LET, value);
  }

  private defineConst(rawName: string, value: any): void {
    this.scope[rawName] = new Variable(VariableKind.CONST, value);
  }
}
