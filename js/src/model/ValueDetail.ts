/**
 * @file ValueDetail.ts
 * @author afcfzf(9301462@qq.com)
 */

import type { Scope } from './Scope';

export enum ValueDetailKind {
  VAR = 'var',
  LET = 'let',
  CONST = 'const',
}

interface ValueDetailOption {
  kind: ValueDetailKind;
  name: string;
  value: any;
  scope: Scope;
}

export class ValueDetail {
  private name: ValueDetailOption['name'];

  private kind: ValueDetailOption['kind'];

  private scope: ValueDetailOption['scope'];

  constructor(option: ValueDetailOption) {
    const { name, kind, scope } = option;
    this.name = name;
    this.kind = kind;
    this.scope = scope;
  }

  public getKind(): ValueDetailOption['kind'] {
    return this.kind;
  }

  public getName(): string {
    return this.name;
  }

  public getScope(): Scope {
    return this.scope;
  }

  public dispose(): void {
    const valueDetail = this.scope.getScopeDetail();
    if (!valueDetail) {
      throw new Error('unreachable: valueDetail is null');
    }

    delete valueDetail[this.name];
  }
}
