/**
 * @file Variable.ts
 * @author afcfzf(9301462@qq.com)
 */

import type { Scope } from './Scope';

export enum VariableKind {
  VAR = 'var',
  LET = 'let',
  CONST = 'const',
}

interface VariableOption {
  kind: VariableKind;
  name: string;
  value: any;
  scope: Scope;
}

export class Variable {
  private value: VariableOption['value'];

  private name: VariableOption['name'];

  private kind: VariableOption['kind'];

  private scope: VariableOption['scope'];

  constructor(option: VariableOption) {
    const { value, name, kind, scope } = option;
    this.value = value;
    this.name = name;
    this.kind = kind;
    this.scope = scope;
  }

  public getValue<T = any>(): T {
    return this.value;
  }

  public setValue(val: any): boolean {
    if (this.kind === VariableKind.CONST) {
      throw new TypeError('Assignment to constant variable.');
    }

    return this.value = val;
  }

  public getName(): string {
    return this.name;
  }

  public getScope(): Scope {
    return this.scope;
  }

  public dispose(): void {
    delete this.scope.scopeValue[this.name];
  }
}

/**
 * 可读/写obj，要保持引用。比如 obj.a.b = 1; RefPropertyIns[this.key] = 1;
 */
export class PropertyRef {
  constructor(public obj: Record<string, any>, public key: string) {}

  public getValue(): any {
    return this.obj[this.key];
  }

  public setValue(val: any): any {
    return this.obj[this.key] = val;
  }
}
