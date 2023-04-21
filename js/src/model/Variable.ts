/**
 * @file Variable.ts
 * @author afcfzf(9301462@qq.com)
 */

export enum VariableKind {
  VAR = 'var',
  LET = 'let',
  CONST = 'const',
}

export class Variable {
  private kind: VariableKind;
  private innerValue: any;

  public constructor(kind: VariableKind, val: any) {
    this.kind = kind;
    this.innerValue = val;
  }

  public get<T = any>(): T {
    return this.innerValue;
  }

  public set(val: any): boolean {
    if (this.kind === VariableKind.CONST) {
      return false;
    }

    this.innerValue = val;
    return true;
  }
}
