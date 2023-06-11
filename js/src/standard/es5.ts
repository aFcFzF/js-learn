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
  Identifier,
  BinaryOperator,
  ForStatement,
  UpdateExpression,
  Expression,
  BlockStatement,
  AssignmentExpression,
  MemberExpression,
  ObjectExpression,
  Property,
  BreakStatement,
  ContinueStatement,
  ReturnStatement,
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
  CallExpression,
  ThisExpression,
  NewExpression,
} from 'estree';
import { Interpreter } from '../model/Interpreter';
import { Scope, ScopeType } from '../model/Scope';
import { Variable, VariableKind } from '../model/Variable';
import { Signal, SignalType } from '../model/Signal';
import { createFunction } from '../model/Function';

export interface ES5NodeMap {
  BinaryExpression: BinaryExpression
  Literal: Literal,
  Program: Program,
  ExpressionStatement: ExpressionStatement,
  VariableDeclaration: VariableDeclaration,
  Identifier: Identifier,
  ForStatement: ForStatement,
  UpdateExpression: UpdateExpression,
  BlockStatement: BlockStatement,
  AssignmentExpression: AssignmentExpression,
  MemberExpression: MemberExpression,
  ObjectExpression: ObjectExpression,
  BreakStatement: BreakStatement,
  ContinueStatement: ContinueStatement,
  ReturnStatement: ReturnStatement,
  ArrowFunctionExpression: ArrowFunctionExpression,
  FunctionDeclaration: FunctionDeclaration,
  CallExpression: CallExpression,
  FunctionExpression: FunctionExpression,
  ThisExpression: ThisExpression,
  NewExpression: NewExpression,
};

export type ES5VisitorMap = {
  [name in keyof ES5NodeMap]: (node: Interpreter<ES5NodeMap[name]>) => any;
};

export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];

const operateMap: Record<BinaryOperator, (itprNode: Interpreter<BinaryExpression>) => any> = {
  '+': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) + itprNode.interpret(itprNode.node.right),
  '-': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) - itprNode.interpret(itprNode.node.right),
  '*': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) * itprNode.interpret(itprNode.node.right),
  '/': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) / itprNode.interpret(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '==': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) == itprNode.interpret(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '!=': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) != itprNode.interpret(itprNode.node.right),
  '===': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) === itprNode.interpret(itprNode.node.right),
  '!==': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) !== itprNode.interpret(itprNode.node.right),
  '<': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) < itprNode.interpret(itprNode.node.right),
  '<=': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) <= itprNode.interpret(itprNode.node.right),
  '>': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) > itprNode.interpret(itprNode.node.right),
  '>=': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) >= itprNode.interpret(itprNode.node.right),
  '<<': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) << itprNode.interpret(itprNode.node.right),
  '>>': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) >> itprNode.interpret(itprNode.node.right),
  '>>>': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) >>> itprNode.interpret(itprNode.node.right),
  '%': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) % itprNode.interpret(itprNode.node.right),
  '**': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) ** itprNode.interpret(itprNode.node.right),
  '|': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) | itprNode.interpret(itprNode.node.right),
  '^': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) ^ itprNode.interpret(itprNode.node.right),
  '&': (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) & itprNode.interpret(itprNode.node.right),
  in: (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) in itprNode.interpret(itprNode.node.right),
  instanceof: (itprNode: Interpreter<BinaryExpression>) => itprNode.interpret(itprNode.node.left) instanceof itprNode.interpret(itprNode.node.right),
};

// const assignOperator: Record<AssignmentOperator, >;


const getVariable = (identifier: Identifier, scope: Scope): Variable => {
  const { name } = identifier;

  const variable = scope.search(name);
  if (!variable) {
    throw new Error(`UpdateExpression 未找到变量: ${name} --- ${JSON.stringify(identifier)}`);
  }

  return variable;
};

const getVariableValue = (identifier: Identifier, scope: Scope): any => getVariable(identifier, scope).get();

export const es5: ES5VisitorMap = {
  BinaryExpression(itprNode) {
    const { node: { operator } } = itprNode;

    if (operateMap[operator] == null) {
      throw new Error(`operator not allow: ${operator}`);
    }

    return operateMap[operator](itprNode);
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

  /**
   * 变量申明
   * @param itprNode
   * @returns
   */
  VariableDeclaration(itprNode) {
    const { node, scope } = itprNode;
    const { declarations, kind } = node;

    declarations.forEach((decl) => {
      const { id, init } = decl;
      const key = (id as Identifier).name;
      const value = init ? itprNode.interpret(init) : undefined;
      if (scope.type === ScopeType.BLOCK && kind === VariableKind.VAR && scope.parent) {
        scope.parent.declare(VariableKind.VAR, key, value);
      } else {
        scope.declare(kind as VariableKind, key, value);
      }
    });
  },

  Identifier(itprNode) {
    const { node, scope } = itprNode;
    const { name } = node;
    const variable = scope.search(name);
    if (variable == null) {
      throw new Error(`variable ${name} not exist!`);
    }

    return variable.get();
  },

  ForStatement(itprNode) {
    const { node: { init, test, update, body } } = itprNode;
    itprNode.interpret(init as VariableDeclaration);
    const forScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    for (
      itprNode.interpret(init as VariableDeclaration, forScope);
      itprNode.interpret(test as Expression, forScope) || test;
      update && itprNode.interpret(update, forScope)
    ) {
      const val = itprNode.interpret(body);
      if (Signal.isBreak(val)) break;
      if (Signal.isContinue(val)) continue;
      if (Signal.isReturn(val)) return val.val;
    }
  },

  UpdateExpression(itprNode) {
    const { node: { operator, argument }, scope } = itprNode;
    const variable = getVariable(argument as Identifier, scope);
    if (operator === '++') {
      variable.set(variable.get() + 1);
    } else if (operator === '--') {
      variable.set(variable.get() - 1);
    }
  },

  // for循环使用，支持 break、continue、return语句
  BlockStatement(itprNode) {
    const { node: { body } } = itprNode;
    const blockScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    for (const statement of body) {
      const signal = itprNode.interpret(statement, blockScope);
      if (Signal.isSignal(signal)) {
        return signal;
      }
    }
  },

  AssignmentExpression(itprNode) {
    const { node: { left, right, operator }, scope } = itprNode;
    const leftVariable = getVariable(left as Identifier, scope);
    // rhs直接赋值，例如const a = 111; 是identifier；否则是MemberExpression
    const rightValue = getVariableValue(right as Identifier, scope);
    if (operator === '=') {
      leftVariable.set(rightValue);
    }
  },

  MemberExpression(itprNode) {
    const { node: { object, property, computed } } = itprNode;
    const key = computed
      ? itprNode.interpret(property)
      : (property as Identifier).name;

    const obj = itprNode.interpret(object);
    return obj[key];
  },

  ObjectExpression(itprNode) {
    const { node: { properties } } = itprNode;
    const obj: Record<string, unknown> = {};
    properties.forEach((prop) => {
      // const obj = {name: 'xxx'}; 都是property
      if (prop.type === 'Property') {
        const { key, value } = prop as Property;
        const result = itprNode.interpret(value);
        let propName: string;
        // TODO: 忘了是啥场景？
        if (key.type === 'Identifier') {
          propName = key.name;
          // 字面量
        } else if (key.type === 'Literal') {
          propName = itprNode.interpret(key);
        } else {
          throw new Error(`${key.type} not exist! detail: ${JSON.stringify(key)}`);
        }
        obj[propName] = result;
      }
    });
    return obj;
  },

  BreakStatement() {
    return new Signal(SignalType.BREAK);
  },

  ContinueStatement() {
    return new Signal(SignalType.CONTINUE);
  },

  ReturnStatement(itprNode) {
    const { node: { argument } } = itprNode;
    const value = argument ? itprNode.interpret(argument) : undefined;
    return new Signal(SignalType.RETURN, value);
  },

  ArrowFunctionExpression(itprNode) {
    const { node: { body } } = itprNode;
  },

  /**
   * 核心：运行时再通过闭包定义arguments
   * this: 运行时，找到this再定义
   * @param itprNode
   * @returns
   */
  FunctionDeclaration(itprNode) {
    const { node: { id }, scope } = itprNode;
    // 一定有name
    const fnName = id?.name;
    if (!fnName) {
      throw new Error('fetal error: function declare fail, must has name');
    }

    const fn = createFunction(itprNode);
    scope.declare(VariableKind.VAR, fnName, fn);
  },

  CallExpression(itprNode) {
    const { node: { callee, arguments: args }, scope } = itprNode;
    // 遇到MemberExpression.ThisExpression
    const argsVal = args.map(arg => itprNode.interpret(arg));
    // 有可能是fn()或者obj.fn()
    const fn = itprNode.interpret(callee as Identifier | MemberExpression, scope);
    let context;
    if (callee.type === 'MemberExpression') {
      // obj.fn会是这种类型，所以this会指向object
      context = itprNode.interpret(callee.object, scope);
      // fn = getVariableValue(property as Identifier, scope);
    }

    if (!fn) {
      throw new Error(`function not exist callee.name！${JSON.stringify(callee)}`);
    }
    return fn.call(context, ...argsVal);
  },

  FunctionExpression(itprNode) {
    return createFunction(itprNode);
  },

  ThisExpression(itprNode) {
    const { scope } = itprNode;
    const variable = scope.search('this');
    if (variable == null) {
      throw new Error('ThisExpression not valid!');
    }

    return variable.get();
  },

  // 返回的是实例
  NewExpression(itprNode) {
    const { node: { callee } } = itprNode;
    const Constructor = itprNode.interpret(callee);
    return new Constructor();
  },
};
