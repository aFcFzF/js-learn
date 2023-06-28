/**
 * @file Scope.ts
 * @author afcfzf(9301462@qq.com)
 */

import { ValueDetail, ValueDetailKind } from './ValueDetail';
import { hasOwnProperty } from '../utils';
import { ValueContainer, ValueRef } from './ValueRef';

export type ScopeValue = Record<string, unknown>;
export type ScopeDetail = Record<string, ValueDetail>;

export const DEFAULT_INTERNAL_FULL_SCOPE_DATA: ScopeValue = {
  console,
  undefined,
  ReferenceError,
  Array,
  Date,
  RegExp,
  Object,
  Number,
};

export enum ScopeType {
  FUNCTION = 'function',
  BLOCK = 'block',
  ENV = 'env',
}

export interface ScopeSearchResult {
  scope: Scope;
  valueRef: ValueRef;
}

interface ScopeValueRefOption {
  container: ValueContainer;
  name: string;
  scope: Scope;
}

export class ScopeValueRef extends ValueRef {
  private scope: Scope;

  constructor(option: ScopeValueRefOption) {
    const { container, name, scope } = option;
    super(container, name);
    this.scope = scope;
  }

  public setValue(val: any): void {
    const scopeDetail = this.scope.getScopeDetail();
    if (scopeDetail[this.getName()]?.getKind() === ValueDetailKind.CONST) {
      throw new TypeError('Assignment to constant variable.');
    }
    return super.setValue(val);
  }

  public getScope(): Scope {
    return this.scope;
  }
}

export class Scope {
  public type: ScopeType;

  /**
   * 父作用域
   */
  public parent: Scope | null;

  /**
   * 当前作用域
   * 必须存引用，场景: this === window;
   */
  protected scopeValue: ScopeValue;

  protected scopeDetail: ScopeDetail = {};

  constructor(type: ScopeType, parent: Scope | null = null, scopeValue: ScopeValue = {}) {
    this.type = type;
    this.parent = parent;
    this.scopeValue = scopeValue;

    Object.entries(scopeValue).forEach(([key]) => {
      this.scopeDetail[key] = new ValueDetail({
        kind: ValueDetailKind.VAR,
        name: key,
        scope: this,
      });
    });
  }

  public getScopeValue(): ScopeValue {
    return this.scopeValue;
  }

  /**
   * 这里setValue是给当前scope赋值；
   * 原因：不清楚是给block/function/root作用域赋值，调用该方法时, 只给current赋值；其他作用域需要自行判断
   * 注意；如果detail不存在，说明应该用declare申明而不是重新赋值;
   * @param val
   */
  public setValue(name: string, value: unknown): any {
    const valueDetail = this.scopeDetail[name];
    if (valueDetail == null) {
      throw new Error(`value detail not exist, name is ${name}`);
    }

    return this.scopeValue[name] = value;
  }

  public deleteScopeValue(name: string): void {
    const valueRef = this.search(name);
    const scope = valueRef.getScope();
    delete scope.scopeValue[name];
    delete scope.scopeDetail[name];
  }

  public getScopeDetail(): ScopeDetail {
    return this.scopeDetail;
  }

  /**
   * 先从自身scope找，然后从作用域链找，最后从global找
   * @param rawName
   * @returns
   */
  public search(rawName: string): ScopeValueRef {
    if (hasOwnProperty(this.scopeValue, rawName)) {
      return new ScopeValueRef({
        container: this.scopeValue,
        name: rawName,
        scope: this,
      });
    }

    if (this.parent) {
      return this.parent.search(rawName);
    }

    return new ScopeValueRef({
      container: this.scopeValue,
      name: rawName,
      scope: this,
    });
  }

  /**
   * rootScope在Scope里拿不到，原因是：一直递归到env，只能拿到最后一层，否则和search到的scope不一致
   */
  // public getRootScope(): Scope {
  //   // env 是rootEnvScope
  //   if (this.parent) {
  //     return this.parent.getRootScope();
  //   }

  //   return this;
  // }

  public declare(kind: ValueDetailKind, rawName: string, value: any): void {
    if (this.checkDefinition(kind, rawName)) {
      const errMsg = `Uncaught SyntaxError: Identifier '${rawName}' has already been declared`;
      throw new SyntaxError(errMsg);
    }

    switch (kind) {
      case ValueDetailKind.VAR:
        this.defineVar(rawName, value);
        break;
      case ValueDetailKind.LET:
        this.defineLet(rawName, value);
        break;
      case ValueDetailKind.CONST:
        this.defineConst(rawName, value);
        break;
      default :
        throw new Error('define error');
    }
  }

  private checkDefinition(kind: ValueDetailKind, rawName: string): boolean {
    return [ValueDetailKind.CONST, ValueDetailKind.LET].includes(kind) && hasOwnProperty(this.scopeValue, rawName);
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
    // 这里为啥筛选parent。如果是 fn => () => { var a = 1; } 是定义在Function还是Block
    while (scope.parent && scope.parent.type === ScopeType.BLOCK) {
      scope = scope.parent;
    }

    scope.scopeValue[rawName] = value;
    scope.scopeDetail[rawName] = new ValueDetail({
      kind: ValueDetailKind.VAR,
      name: rawName,
      scope,
    });
  }

  private defineLet(rawName: string, value: any): void {
    this.scopeValue[rawName] = value;
    this.scopeDetail[rawName] = new ValueDetail({
      kind: ValueDetailKind.LET,
      name: rawName,
      scope: this,
    });
  }

  private defineConst(rawName: string, value: any): void {
    this.scopeValue[rawName] = value;
    this.scopeDetail[rawName] = new ValueDetail({
      kind: ValueDetailKind.CONST,
      name: rawName,
      scope: this,
    });
  }
}
