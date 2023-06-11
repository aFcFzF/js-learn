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
  constructor(public kind: VariableKind, private innerValue: any) {}

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

/**
 * 可读/写obj，要保持引用。比如 obj.a.b = 1; RefPropertyIns[this.key] = 1;
 */
export class PropertyRef {
  constructor(private obj: Record<string, any>, private key: string) {}

  public get(): any {
    return this.obj[this.key];
  }

  public set(val: any): any {
    return this.obj[this.key] = val;
  }
}
