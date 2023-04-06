/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Visitor } from './Visitor';
// import * as ESTree from 'estree';
import { Node } from 'acorn';

export class Interpreter {
  private visitor: Visitor;

  constructor(visitor: Visitor) {
    this.visitor = visitor;
  }

  run(node: Node): void {
    this.visitor.visitNode(node);
  }
}
