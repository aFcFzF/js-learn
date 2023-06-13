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
  ArrayExpression,
  IfStatement,
  LogicalOperator,
  LogicalExpression,
  ThrowStatement,
  TryStatement,
  CatchClause,
  UnaryExpression,
  UnaryOperator,
  ConditionalExpression,
  AssignmentOperator,
  DoWhileStatement,
  ForInStatement,
  SequenceExpression,
  SwitchStatement,
  SwitchCase,
  WhileStatement,
} from 'estree';
import { Interpreter } from '../model/Interpreter';
import { Scope, ScopeType } from '../model/Scope';
import { PropertyRef, Variable, VariableKind } from '../model/Variable';
import { Signal, SignalType } from '../model/Signal';
import { createFunction } from '../model/Function';

export interface ES5NodeMap {
  BinaryExpression: BinaryExpression;
  Literal: Literal;
  Program: Program;
  ExpressionStatement: ExpressionStatement;
  VariableDeclaration: VariableDeclaration;
  Identifier: Identifier;
  ForStatement: ForStatement;
  UpdateExpression: UpdateExpression;
  BlockStatement: BlockStatement;
  AssignmentExpression: AssignmentExpression;
  MemberExpression: MemberExpression;
  ObjectExpression: ObjectExpression;
  BreakStatement: BreakStatement;
  ContinueStatement: ContinueStatement;
  ReturnStatement: ReturnStatement;
  ArrowFunctionExpression: ArrowFunctionExpression;
  FunctionDeclaration: FunctionDeclaration;
  CallExpression: CallExpression;
  FunctionExpression: FunctionExpression;
  ThisExpression: ThisExpression;
  NewExpression: NewExpression;
  ArrayExpression: ArrayExpression;
  IfStatement: IfStatement;
  LogicalExpression: LogicalExpression;
  ThrowStatement: ThrowStatement;
  TryStatement: TryStatement;
  CatchClause: CatchClause;
  UnaryExpression: UnaryExpression;
  ConditionalExpression: ConditionalExpression;
  DoWhileStatement: DoWhileStatement;
  ForInStatement: ForInStatement;
  SequenceExpression: SequenceExpression;
  SwitchStatement: SwitchStatement;
  SwitchCase: SwitchCase;
  WhileStatement: WhileStatement;
};

export type ES5VisitorMap = {
  [name in keyof ES5NodeMap]: (node: Interpreter<ES5NodeMap[name]>) => any;
};

export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];

const operateMap: Record<BinaryOperator, (itprNode: Interpreter<BinaryExpression>) => any> = {
  '+': itprNode => itprNode.interpret(itprNode.node.left) + itprNode.interpret(itprNode.node.right),
  '-': itprNode => itprNode.interpret(itprNode.node.left) - itprNode.interpret(itprNode.node.right),
  '*': itprNode => itprNode.interpret(itprNode.node.left) * itprNode.interpret(itprNode.node.right),
  '/': itprNode => itprNode.interpret(itprNode.node.left) / itprNode.interpret(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '==': itprNode => itprNode.interpret(itprNode.node.left) == itprNode.interpret(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '!=': itprNode => itprNode.interpret(itprNode.node.left) != itprNode.interpret(itprNode.node.right),
  '===': itprNode => itprNode.interpret(itprNode.node.left) === itprNode.interpret(itprNode.node.right),
  '!==': itprNode => itprNode.interpret(itprNode.node.left) !== itprNode.interpret(itprNode.node.right),
  '<': itprNode => itprNode.interpret(itprNode.node.left) < itprNode.interpret(itprNode.node.right),
  '<=': itprNode => itprNode.interpret(itprNode.node.left) <= itprNode.interpret(itprNode.node.right),
  '>': itprNode => itprNode.interpret(itprNode.node.left) > itprNode.interpret(itprNode.node.right),
  '>=': itprNode => itprNode.interpret(itprNode.node.left) >= itprNode.interpret(itprNode.node.right),
  '<<': itprNode => itprNode.interpret(itprNode.node.left) << itprNode.interpret(itprNode.node.right),
  '>>': itprNode => itprNode.interpret(itprNode.node.left) >> itprNode.interpret(itprNode.node.right),
  '>>>': itprNode => itprNode.interpret(itprNode.node.left) >>> itprNode.interpret(itprNode.node.right),
  '%': itprNode => itprNode.interpret(itprNode.node.left) % itprNode.interpret(itprNode.node.right),
  // eslint-disable-next-line no-restricted-properties
  '**': itprNode => Math.pow(itprNode.interpret(itprNode.node.left), itprNode.interpret(itprNode.node.right)),
  '|': itprNode => itprNode.interpret(itprNode.node.left) | itprNode.interpret(itprNode.node.right),
  '^': itprNode => itprNode.interpret(itprNode.node.left) ^ itprNode.interpret(itprNode.node.right),
  '&': itprNode => itprNode.interpret(itprNode.node.left) & itprNode.interpret(itprNode.node.right),
  in: itprNode => itprNode.interpret(itprNode.node.left) in itprNode.interpret(itprNode.node.right),
  instanceof: itprNode => itprNode.interpret(itprNode.node.left) instanceof itprNode.interpret(itprNode.node.right),
};

//
const assignOperator: Record<AssignmentOperator, (lhsRef: PropertyRef | Variable, rshValue: any) => any> = {
  '%=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() % rhsValue),
  '+=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() + rhsValue),
  '-=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() - rhsValue),
  '*=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() * rhsValue),
  '/=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() / rhsValue),
  '=': (lhsRef, rhsValue) => lhsRef.set(rhsValue),
  '<<=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() << rhsValue),
  '>>=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() >> rhsValue),
  '>>>=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() >>> rhsValue),
  '&&=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() && rhsValue),
  // eslint-disable-next-line no-restricted-properties
  '**=': (lhsRef, rhsValue) => lhsRef.set(Math.pow(lhsRef.get(), rhsValue)),
  '||=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() || rhsValue),
  '|=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() | rhsValue),
  '&=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() & rhsValue),
  '^=': (lhsRef, rhsValue) => lhsRef.set(lhsRef.get() ^ rhsValue),
  '??=': (lhsRef, rhsValue) => {
    const lValue = lhsRef.get();
    return lhsRef.set(lValue == null ? rhsValue : lValue);
  },
};

const logicalOperatorMap: Record<LogicalOperator, (itprNode: Interpreter<LogicalExpression>) => any> = {
  '&&': itprNode => itprNode.interpret(itprNode.node.left) && itprNode.interpret(itprNode.node.right),
  '||': itprNode => itprNode.interpret(itprNode.node.left) || itprNode.interpret(itprNode.node.right),
  '??': (itprNode) => {
    const leftVal = itprNode.interpret(itprNode.node.left);
    return leftVal == null ? itprNode.interpret(itprNode.node.right) : leftVal;
  },
};

const unaryOperatorMap: Record<UnaryOperator, (itprNode: Interpreter<UnaryExpression>) => any> = {
  typeof: itprNode => typeof itprNode.interpret(itprNode.node.argument),
  '!': itprNode => !itprNode.interpret(itprNode.node.argument),
  '+': itprNode => +itprNode.interpret(itprNode.node.argument),
  '-': itprNode => -itprNode.interpret(itprNode.node.argument),
  '~': itprNode => ~itprNode.interpret(itprNode.node.argument),
  delete: (itprNode) => {
    const { node: { argument } } = itprNode;
    if (argument.type === 'Literal') {
      return delete argument.value;
    }

    if (argument.type === 'Identifier' || argument.type === 'MemberExpression') {
      const { obj, key } = getVariable(argument, itprNode) as PropertyRef;
      return delete obj[key];
    }

    throw new Error('unSupport delete operation!');
  },
  void: itprNode => void itprNode.interpret(itprNode.node.argument),
};

/**
 * 分为两种节点：1. identifier、MemberExpression
 * @param node
 * @param itprNode
 * @returns
 */
const getVariable = (node: Identifier | MemberExpression, itprNode: Interpreter<Expression>): Variable | PropertyRef => {
  const { scope } = itprNode;

  if (node.type === 'Identifier') {
    const { name } = node;
    const variable = scope.search(name);
    if (!variable) {
      throw new Error(`name is not find: ${name}`);
    }
    return variable;
  }

  const { object, property, computed } = node;
  const obj = itprNode.interpret(object);
  let propName;
  if (property.type === 'Identifier') {
    propName = computed ? itprNode.interpret(property) : property.name;
  } else if (property.type === 'Literal') {
    propName = String(property.value);
  }

  if (propName == null) {
    throw new Error(`unSupport variable type: ${property}`);
  }

  const propRef = new PropertyRef(obj, propName);
  return propRef;
};

const getVariableValue = (node: Identifier | MemberExpression, itprNode: Interpreter<Expression>): any => getVariable(node, itprNode).get();

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
    // 这里相当于每一条语句都执行并返回
    const statements = node.body.map(bodyNode => itprNode.interpret(bodyNode));
    // 最终结果
    return statements[statements.length - 1];
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
      // 这里好像不对
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
    // (true ? undefined : true) 这里undefined翻译成identifier.{name: 'undeinfed' }相当于变量。
    if (variable === null) {
      throw new ReferenceError(`${name} is not defined`);
    }

    return variable.get();
  },

  ForStatement(itprNode) {
    const { node: { init, test, update, body } } = itprNode;
    const forScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    let result;
    for (
      init && itprNode.interpret(init as VariableDeclaration, forScope);
      test ? itprNode.interpret(test as Expression, forScope) : true;
      update && itprNode.interpret(update, forScope)
    ) {
      result = itprNode.interpret(body, forScope);
      if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (Signal.isReturn(result)) {
        return result.val;
      }
    }
    return result;
  },

  UpdateExpression(itprNode) {
    const { node: { operator, argument, prefix } } = itprNode;
    const variable = getVariable(argument as Identifier, itprNode);
    const prevVal = variable.get();
    let afterVal;
    if (operator === '++') {
      afterVal = prevVal + 1;
    } else if (operator === '--') {
      afterVal = prevVal - 1;
    } else {
      throw new Error('unSupport val');
    }

    variable.set(afterVal);
    return prefix ? afterVal : prevVal;
  },

  ForInStatement(itprNode) {
    const { node: { left, right, body } } = itprNode;
    const forScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    /**
     * left可能是两种：VariableDeclaration | Pattern;
     * for (var a in obj) | for (a in obj)
     */
    let propName;
    if (left.type === 'VariableDeclaration') {
      const { kind, declarations } = left;
      const { name: identifierName } = declarations[0].id as Identifier;
      propName = identifierName;
      forScope.declare(kind as VariableKind, propName, null);
    } else if (left.type === 'Identifier') {
      propName = left.name;
    } else {
      throw new Error('for in unSupport name');
    }

    const rightVal = itprNode.interpret(right);

    let result;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in rightVal) {
      const assignmentExp: AssignmentExpression = {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: propName,
        },
        right: {
          type: 'Literal',
          value: prop,
        },
      };
      itprNode.interpret(assignmentExp, forScope);

      result = itprNode.interpret(body, forScope);
      if (Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isReturn(result)) {
        return result.val;
      }
    }

    return result;
  },

  IfStatement(itprNode) {
    const { node: { test, consequent, alternate } } = itprNode;
    const pass = itprNode.interpret(test);
    if (pass) {
      return itprNode.interpret(consequent);
    }

    if (alternate) {
      return itprNode.interpret(alternate);
    }
  },

  LogicalExpression(itprNode) {
    const { node: { operator } } = itprNode;
    return logicalOperatorMap[operator](itprNode);
  },

  // for循环使用，支持 break、continue、return语句
  BlockStatement(itprNode) {
    const { node: { body } } = itprNode;
    const blockScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    let result;
    for (const statement of body) {
      result = itprNode.interpret(statement, blockScope);
      if (Signal.isSignal(result)) {
        return result;
      }
    }

    return result;
  },

  AssignmentExpression(itprNode) {
    const { node: { left, right, operator } } = itprNode;
    // lsh找Variable: 值的容器
    const leftVariable = getVariable(left as Identifier | MemberExpression, itprNode);
    if (leftVariable instanceof Variable && leftVariable.kind === VariableKind.CONST) {
      throw new TypeError('const not reassign value');
    }

    // rhs直接赋值，例如const a = 111; 是identifier；否则是MemberExpression: const a = this.b;
    const rightValue = itprNode.interpret(right);
    return assignOperator[operator](leftVariable, rightValue);
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

  ArrayExpression(itprNode) {
    const { node: { elements } } = itprNode;
    return elements.map(el => el && itprNode.interpret(el));
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

  // TODO: FunctionExpression定义的函数，只能内部访问。除非是VariableDeclarator
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
    const { node: { callee, arguments: args } } = itprNode;
    const Constructor = itprNode.interpret(callee);
    const argsValue = args.map(arg => itprNode.interpret(arg));
    return new Constructor(...argsValue);
  },

  ThrowStatement(itprNode) {
    const { node: { argument } } = itprNode;
    const err = itprNode.interpret(argument);
    throw err;
  },

  TryStatement(itprNode) {
    const { node: { block, handler, finalizer } } = itprNode;
    let result;

    try {
      result = itprNode.interpret(block);
    } catch (err) {
      if (handler) {
        const fn = itprNode.interpret(handler);
        result = fn(err);
      }
    } finally {
      if (finalizer) {
        itprNode.interpret(finalizer);
      }
    }

    return result;
  },

  CatchClause(itprNode) {
    const { node: { param, body }, scope } = itprNode;
    return (err: any) => {
      const { name } = (param as Identifier);
      scope.declare(VariableKind.VAR, name, err);
      return itprNode.interpret(body);
    };
  },

  UnaryExpression(itprNode) {
    const { node: { operator } } = itprNode;
    return unaryOperatorMap[operator](itprNode);
  },

  ConditionalExpression(itprNode) {
    const { node: { test, consequent, alternate } } = itprNode;
    return itprNode.interpret(test) ? itprNode.interpret(consequent) : itprNode.interpret(alternate);
  },

  DoWhileStatement(itprNode) {
    const { node: { body, test } } = itprNode;
    // 记得返回值
    let result;
    do {
      result = itprNode.interpret(body);
      if (Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isReturn(result)) {
        return result.val;
      }
    } while (itprNode.interpret(test));
    return result;
  },

  SequenceExpression(itprNode) {
    const { node: { expressions } } = itprNode;

    const results = expressions.map(expr => itprNode.interpret(expr));
    return results.pop();
  },

  SwitchStatement(itprNode) {
    const { node: { discriminant, cases } } = itprNode;
    const discValue = itprNode.interpret(discriminant);
    let result;
    for (const caseNode of cases) {
      const { test } = caseNode;
      const condition = test == null ? true : itprNode.interpret(test) === discValue;
      if (condition) {
        result = itprNode.interpret(caseNode);
        if (Signal.isBreak(result)) {
          result = void 0;
          break;
        } else if (Signal.isReturn(result)) {
          return result.val;
        }
        // 只要有1个条件符合，就退出
        break;
      }
    }

    return result;
  },

  SwitchCase(itprNode) {
    const { node: { consequent } } = itprNode;
    let result;
    /**
     * case default: {
     *  break;
     *  console.log(1); // 不应该被执行
     * }
     */
    for (const con of consequent) {
      result = itprNode.interpret(con);
      if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isReturn(result)) {
        return result.val;
      }
    }

    return result;
  },

  WhileStatement(itprNode) {
    const { node: { test, body } } = itprNode;
    let result;
    while (itprNode.interpret(test)) {
      result = itprNode.interpret(body);
      if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (Signal.isReturn(result)) {
        return result.val;
      }
    }

    return result;
  },
};
