/**
 * @file es5.ts
 * @author afcfzf(9301462@qq.com)
 */

import {
  BinaryExpression,
  Literal,
  Program,
  ExpressionStatement,
  VariableDeclaration,
} from 'estree';
import { Interpreter } from '../model/Interpreter';

export interface ES5NodeMap {
  BinaryExpression: BinaryExpression
  Literal: Literal,
  Program: Program,
  ExpressionStatement: ExpressionStatement,
  VariableDeclaration: VariableDeclaration,
};

export type ES5VisitorMap = {
  [name in keyof ES5NodeMap]: (node: Interpreter<ES5NodeMap[name]>) => any;
};

export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];

export const es5: ES5VisitorMap = {
  BinaryExpression(itprNode) {
    const { node: { operator, left, right } } = itprNode;

    if (operator === '+') {
      return itprNode.interpret(left) + itprNode.interpret(right);
    }
  },

  Literal(itprNode): RegExp | Literal['value'] {
    const { node } = itprNode;
    if ('regex' in node) {
      // (<RegExpLiteral>node).regex
      const { regex: { pattern, flags } } = node;
      return new RegExp(pattern, flags);
    }

    return node.value;
  },

  Program(itprNode) {
    const { node } = itprNode;
    return node.body.map(bodyNode => itprNode.interpret(bodyNode));
  },

  ExpressionStatement(itprNode) {
    const { node } = itprNode;
    return itprNode.interpret(node.expression);
  },

  VariableDeclaration(itprNode) {
    const { node, sc } = itprNode;

    return itprNode.interpret(node.)
  }
};
