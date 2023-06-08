/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import * as ESTree from 'estree';
import { ES5NodeType, ES5NodeVisitor, ES5VisitorMap, es5 } from '../standard/es5';
import { Scope } from './Scope';

interface InterpreterOptions {
  standard?: 'es5' | 'esNext';
}

export class Interpreter<T extends ESTree.Node> {
  private visitorMap: ES5VisitorMap = es5;

  constructor(
    public node: T,
    public scope: Scope,
    private options: InterpreterOptions = { standard: 'esNext' },
  ) {}

  public interpret(esNode: ESTree.Node, scope: Scope = this.scope): any {
    const instance = new Interpreter(esNode, scope, this.options);

    if (instance.node.type in this.visitorMap) {
      const visitor: ES5NodeVisitor = this.visitorMap[instance.node.type as ES5NodeType];
      return visitor(instance as any);
    }

    throw `${instance.node.type} not supported!`;
  }

  public evaluate(): any {
    return this.interpret(this.node);
  }
}
