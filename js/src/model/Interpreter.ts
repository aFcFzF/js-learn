/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import * as ESTree from 'estree';
import { ES5NodeType, ES5NodeVisitor, ES5VisitorMap, es5 } from '../standard/es5';

interface InterpreterOptions {
  standard?: 'es5' | 'esNext';
}

export class Interpreter<T extends ESTree.Node> {
  public node: T;

  private visitorMap: ES5VisitorMap = es5;
  private options: InterpreterOptions;

  constructor(node: T, options?: InterpreterOptions) {
    this.node = node;
    this.options = options || { standard: 'esNext' };
  }

  public interpret(esNode?: ESTree.Node): any {
    const instance = new Interpreter(esNode || this.node, this.options);

    if (instance.node.type in this.visitorMap) {
      const visitor: ES5NodeVisitor = this.visitorMap[instance.node.type as ES5NodeType];
      return visitor(instance as any);
    }

    throw `${instance.node.type} not supported!`;
  }
}
