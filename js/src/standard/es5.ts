/**
 * @file es5.ts
 * @author afcfzf(9301462@qq.com)
 */

import { BinaryExpression, Literal } from 'estree';
import { Interpreter } from '../model/Interpreter';

export interface ES5NodeMap {
  BinaryExpression: BinaryExpression
  Literal: Literal,
};

export type ES5VisitorMap = {
  [name in keyof ES5NodeMap]: (node: Interpreter<ES5NodeMap[name]>) => any;
};

export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];

export const es5: ES5VisitorMap = {
  BinaryExpression(intrNode) {
    const { node: { operator, left, right } } = intrNode;

    if (operator === '+') {
      return intrNode.interpret(left) + intrNode.interpret(right);
    }
  },

  Literal(intrNode): RegExp | Literal['value'] {
    const { node } = intrNode;
    if ('regex' in node) {
      // (<RegExpLiteral>node).regex
      const { regex: { pattern, flags } } = node;
      return new RegExp(pattern, flags);
    }

    return node.value;
  },
};
