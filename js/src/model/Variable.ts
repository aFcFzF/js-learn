/**
 * @file Variable.ts
 * @author afcfzf(9301462@qq.com)
 */

export enum Kind {
  VAR = 'var',
  LET = 'let',
  CONST = 'const',
}

export class Variable {
  private innerValue: any;

  public constructor(public kind: Kind, val: any) {
    this.innerValue = val;
  }

  public get value(): any {
    return this.innerValue;
  }

  public set value(val: any) {
    this.innerValue = val;
  }
}
