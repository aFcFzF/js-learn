/**
 * @file Visitor.ts
 * @author afcfzf(9301462@qq.com)
 */

// import * as EStree from 'estree';
import { Node } from 'acorn';

export class Visitor {
  public visitNode(node: Node): void {
    console.log('node', node);
  }
}


