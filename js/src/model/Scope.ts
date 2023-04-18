/**
 * @file Scope.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Variable, Kind } from './Variable';


export class Scope {
  private targetScope: Map<string, Variable>;

  public constructor(
    public readonly type: 'function',
    private parent: Scope | null = null,
  ) {
    this.targetScope = new Map<string, Variable>();
  }

  public search(rawName: string): Variable | null {
    const value = this.targetScope.get(rawName);
    if (value) {
      return value;
    }

    if (this.parent) {
      return this.parent.search(rawName);
    }

    return null;
  }

  public declare(kind: Kind, rawName: string, value: any): void {
    if (this.hasDefinition(rawName)) {
      console.error(`Uncaught SyntaxError: Identifier '${rawName}' has already been declared`);
      return;
    }

    switch (kind) {
      case Kind.VAR:
        this.defineVar(rawName, value);
        break;
      case Kind.LET:
        this.defineLet(rawName, value);
        break;
      case Kind.CONST:
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

    scope.targetScope.set(rawName, new Variable(Kind.VAR, value));
  }

  private defineLet(rawName: string, value: any): void {
    this.targetScope.set(rawName, new Variable(Kind.LET, value));
  }

  private defineConst(rawName: string, value: any): void {
    this.targetScope.set(rawName, new Variable(Kind.CONST, value));
  }
}
