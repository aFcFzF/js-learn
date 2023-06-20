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
  EmptyStatement,
  Statement,
  WithStatement,
} from 'estree';
import { Walker } from '../model/Walker';
import { Scope, ScopeType } from '../model/Scope';
import { PropertyRef, Variable, VariableKind } from '../model/Variable';
import { Signal, SignalType } from '../model/Signal';
import { createFunction, updateFuncInfo } from '../model/Function';
import { getHostingStatements } from '../utils';

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
  EmptyStatement: EmptyStatement;
  WithStatement: WithStatement;
};

export type ES5VisitorMap = {
  [name in keyof ES5NodeMap]: (node: Walker<ES5NodeMap[name]>) => any;
};

export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];

const operateMap: Record<BinaryOperator, (itprNode: Walker<BinaryExpression>) => any> = {
  '+': itprNode => itprNode.walk(itprNode.node.left) + itprNode.walk(itprNode.node.right),
  '-': itprNode => itprNode.walk(itprNode.node.left) - itprNode.walk(itprNode.node.right),
  '*': itprNode => itprNode.walk(itprNode.node.left) * itprNode.walk(itprNode.node.right),
  '/': itprNode => itprNode.walk(itprNode.node.left) / itprNode.walk(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '==': itprNode => itprNode.walk(itprNode.node.left) == itprNode.walk(itprNode.node.right),
  // eslint-disable-next-line eqeqeq
  '!=': itprNode => itprNode.walk(itprNode.node.left) != itprNode.walk(itprNode.node.right),
  '===': itprNode => itprNode.walk(itprNode.node.left) === itprNode.walk(itprNode.node.right),
  '!==': itprNode => itprNode.walk(itprNode.node.left) !== itprNode.walk(itprNode.node.right),
  '<': itprNode => itprNode.walk(itprNode.node.left) < itprNode.walk(itprNode.node.right),
  '<=': itprNode => itprNode.walk(itprNode.node.left) <= itprNode.walk(itprNode.node.right),
  '>': itprNode => itprNode.walk(itprNode.node.left) > itprNode.walk(itprNode.node.right),
  '>=': itprNode => itprNode.walk(itprNode.node.left) >= itprNode.walk(itprNode.node.right),
  '<<': itprNode => itprNode.walk(itprNode.node.left) << itprNode.walk(itprNode.node.right),
  '>>': itprNode => itprNode.walk(itprNode.node.left) >> itprNode.walk(itprNode.node.right),
  '>>>': itprNode => itprNode.walk(itprNode.node.left) >>> itprNode.walk(itprNode.node.right),
  '%': itprNode => itprNode.walk(itprNode.node.left) % itprNode.walk(itprNode.node.right),
  // eslint-disable-next-line no-restricted-properties
  '**': itprNode => Math.pow(itprNode.walk(itprNode.node.left), itprNode.walk(itprNode.node.right)),
  '|': itprNode => itprNode.walk(itprNode.node.left) | itprNode.walk(itprNode.node.right),
  '^': itprNode => itprNode.walk(itprNode.node.left) ^ itprNode.walk(itprNode.node.right),
  '&': itprNode => itprNode.walk(itprNode.node.left) & itprNode.walk(itprNode.node.right),
  in: itprNode => itprNode.walk(itprNode.node.left) in itprNode.walk(itprNode.node.right),
  instanceof: itprNode => itprNode.walk(itprNode.node.left) instanceof itprNode.walk(itprNode.node.right),
};

//
const assignOperator: Record<AssignmentOperator, (lhsRef: PropertyRef | Variable, rshValue: any) => any> = {
  '%=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() % rhsValue),
  '+=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() + rhsValue),
  '-=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() - rhsValue),
  '*=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() * rhsValue),
  '/=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() / rhsValue),
  '=': (lhsRef, rhsValue) => lhsRef.setValue(rhsValue),
  '<<=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() << rhsValue),
  '>>=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() >> rhsValue),
  '>>>=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() >>> rhsValue),
  '&&=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() && rhsValue),
  // eslint-disable-next-line no-restricted-properties
  '**=': (lhsRef, rhsValue) => lhsRef.setValue(Math.pow(lhsRef.getValue(), rhsValue)),
  '||=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() || rhsValue),
  '|=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() | rhsValue),
  '&=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() & rhsValue),
  '^=': (lhsRef, rhsValue) => lhsRef.setValue(lhsRef.getValue() ^ rhsValue),
  '??=': (lhsRef, rhsValue) => {
    const lValue = lhsRef.getValue();
    return lhsRef.setValue(lValue == null ? rhsValue : lValue);
  },
};

const logicalOperatorMap: Record<LogicalOperator, (itprNode: Walker<LogicalExpression>) => any> = {
  '&&': itprNode => itprNode.walk(itprNode.node.left) && itprNode.walk(itprNode.node.right),
  '||': itprNode => itprNode.walk(itprNode.node.left) || itprNode.walk(itprNode.node.right),
  '??': (itprNode) => {
    const leftVal = itprNode.walk(itprNode.node.left);
    return leftVal == null ? itprNode.walk(itprNode.node.right) : leftVal;
  },
};

const unaryOperatorMap: Record<UnaryOperator, (itprNode: Walker<UnaryExpression>) => any> = {
  typeof: (itprNode) => {
    try {
      return typeof itprNode.walk(itprNode.node.argument);
    } catch (err) {
      if (err instanceof ReferenceError) {
        return 'undefined';
      }

      throw err;
    }
  },
  '!': itprNode => !itprNode.walk(itprNode.node.argument),
  '+': itprNode => +itprNode.walk(itprNode.node.argument),
  '-': itprNode => -itprNode.walk(itprNode.node.argument),
  '~': itprNode => ~itprNode.walk(itprNode.node.argument),
  delete: (itprNode) => {
    const { node: { argument } } = itprNode;
    if (argument.type === 'Literal') {
      return delete argument.value;
    }

    if (argument.type === 'Identifier') {
      try {
        const variable = getVariable(argument, itprNode) as Variable;
        variable.dispose();
        return true;
      } catch (err) {
        return false;
      }
    } else if (argument.type === 'MemberExpression') {
      const { obj, key } = getVariable(argument, itprNode) as PropertyRef;
      return delete obj[key];
    }

    throw new Error('unSupport delete operation!');
  },
  void: itprNode => void itprNode.walk(itprNode.node.argument),
};

const getDefineVariableName = (node: Identifier | MemberExpression): string => {
  if (node.type === 'Identifier') {
    return node.name;
  }

  const { object } = node;
  return getDefineVariableName(object as Identifier | MemberExpression);
};

/**
 * 分为两种节点：1. identifier、MemberExpression
 * @param node
 * @param itprNode
 * @returns
 */
const getVariable = (node: Identifier | MemberExpression, itprNode: Walker<Expression>): Variable | PropertyRef => {
  const { scope } = itprNode;

  if (node.type === 'Identifier') {
    const { name } = node;
    const variable = scope.search(name);
    if (!variable) {
      throw new ReferenceError(`name is not find: ${name}`);
    }

    return variable;
  }

  const { object, property, computed } = node;
  const obj = itprNode.walk(object);
  let propName;
  if (computed) {
    propName = itprNode.walk(property);
  } else if (property.type === 'Identifier') {
    propName = property.name;
  }

  if (propName == null) {
    throw new Error(`unSupport variable type: ${JSON.stringify(property)}`);
  }

  const propRef = new PropertyRef(obj, propName);
  return propRef;
};

// const getVariableValue = (node: Identifier | MemberExpression, itprNode: Walker<Expression>): any => getVariable(node, itprNode).getValue();

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
    const { node: { body } } = itprNode;
    return itprNode.walk({
      type: 'BlockStatement',
      body: body as Statement[],
      start: 0,
      end: 0,
    });
  },

  ExpressionStatement(itprNode) {
    const { node } = itprNode;
    return itprNode.walk(node.expression);
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
      const { id, init, start, end } = decl;
      const key = (id as Identifier).name;
      const value = init ? itprNode.walk(init) : undefined;
      /**
       * var a = 1;
       * var a;
       * a;
       *
       * 如果已经有申明，那么init不存在时，不要写。
       */
      if (scope.type === ScopeType.BLOCK && kind === VariableKind.VAR && scope.parent) {
        const variable = scope.parent.search(key);
        /**
         * 首先，var a = 1; 直接就是declaration, 而不是拆成Assignment,所以先检测是否存在，然后在申明；
         * 已经存在变量，且又申明了，不赋值
         */
        if (variable == null || init != null) {
          scope.parent.declare(VariableKind.VAR, key, value);
        }
      } else {
        scope.declare(kind as VariableKind, key, value);
      }

      /**
       * var a = function() {}
       * var a = (1, function() {})
       *  TODO: 注意FunctionExpression
       */
      if (init?.type === 'FunctionExpression' || init?.type === 'ArrowFunctionExpression') {
        updateFuncInfo({
          fn: value as Function,
          name: key,
          sourceCode: itprNode.sourceCode,
          start,
          end,
        });
      }
    });
  },

  Identifier(itprNode) {
    const { node } = itprNode;
    const variable = getVariable(node, itprNode);
    return variable.getValue();
  },

  ForStatement(itprNode) {
    const { node: { init, test, update, body } } = itprNode;
    const forScope = new Scope(ScopeType.BLOCK, itprNode.scope);
    let result;

    for (
      init && itprNode.walk(init as VariableDeclaration, forScope);
      test ? itprNode.walk(test as Expression, forScope) : true;
      update && itprNode.walk(update, forScope)
    ) {
      result = itprNode.walk(body, forScope);
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
    const prevVal = variable.getValue();
    let afterVal;
    if (operator === '++') {
      afterVal = prevVal + 1;
    } else if (operator === '--') {
      afterVal = prevVal - 1;
    } else {
      throw new Error('unSupport val');
    }

    variable.setValue(afterVal);
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

    const rightVal = itprNode.walk(right);

    let result;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in rightVal) {
      const assignmentExp: AssignmentExpression = {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: propName,
          start: 0,
          end: 0,
        },
        right: {
          type: 'Literal',
          value: prop,
          start: 0,
          end: 0,
        },
        start: 0,
        end: 0,
      };
      itprNode.walk(assignmentExp, forScope);

      result = itprNode.walk(body, forScope);
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
    const pass = itprNode.walk(test);
    if (pass) {
      return itprNode.walk(consequent);
    }

    if (alternate) {
      return itprNode.walk(alternate);
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
    const statements = getHostingStatements(body);

    let result;
    /**
     * block、Program 先扫描一遍body
     * 出现var
     */
    for (const statement of statements) {
      result = itprNode.walk(statement, blockScope);
      /**
        * 发现signal就返回
        * while (test) {
        *  try {}
        *  finally {
        *    break; // finally 如果有signal，要上传
        *    console.log(11); // 可以执行到吗
        *  }
        *  console.log(11); // 执行不到
        * }
       */
      if (Signal.isSignal(result)) {
        return result;
      }
    }

    return result;
  },

  AssignmentExpression(itprNode) {
    const { node: { left, right, operator }, scope } = itprNode;
    // lsh找Variable: 值的容器
    let leftVariable;
    try {
      leftVariable = getVariable(left as Identifier | MemberExpression, itprNode);
    } catch (err) {
      // 变量说明不存在；创建一个
      if (err instanceof ReferenceError && operator === '=' && left.type === 'Identifier') {
        const rootScope = scope.getRootScope();
        const name = getDefineVariableName(left);
        leftVariable = new Variable({
          kind: VariableKind.VAR,
          value: undefined,
          name,
          scope: rootScope,
        });
        rootScope.scopeValue[name] = leftVariable;
      } else {
        throw err;
      }
    }

    // rhs直接赋值，例如const a = 111; 是identifier；否则是MemberExpression: const a = this.b;
    const rightValue = itprNode.walk(right);
    return assignOperator[operator](leftVariable, rightValue);
  },

  MemberExpression(itprNode) {
    const { node: { object, property, computed } } = itprNode;
    const key = computed
      ? itprNode.walk(property)
      : (property as Identifier).name;

    const obj = itprNode.walk(object);
    return obj[key];
  },

  ObjectExpression(itprNode) {
    const { node: { properties }, sourceCode } = itprNode;
    const obj: Record<string, unknown> = {};
    properties.forEach((prop) => {
      // const obj = {name: 'xxx'}; 都是property
      if (prop.type === 'Property') {
        const { key, value } = prop as Property;
        let propName: string;
        // TODO: 忘了是啥场景？
        if (key.type === 'Identifier') {
          propName = key.name;
          // 字面量
        } else if (key.type === 'Literal') {
          propName = itprNode.walk(key);
        } else {
          throw new Error(`${key.type} not exist! detail: ${JSON.stringify(key)}`);
        }

        const descriptor: PropertyDescriptor = {
          configurable: true,
          enumerable: true,
        };

        if (prop.kind === 'get') {
          descriptor.get = itprNode.walk(value);
        } else if (prop.kind === 'set') {
          descriptor.set = itprNode.walk(value);
        } else {
          descriptor.value = itprNode.walk(value);
          descriptor.writable = true;
          // 函数要更新length和fn名，因为函数node拿不到
          if (value.type === 'FunctionExpression') {
            /**
             * obj = {v: function v3() {}}
             * 此时，fnName是v3
             */
            const fnName = value.id?.name || propName;
            updateFuncInfo({
              fn: descriptor.value,
              name: fnName,
              length: value.params.length,
              start: value.start,
              end: value.end,
              sourceCode,
            });
          }
        }

        Object.defineProperty(obj, propName, descriptor);
      }
    });
    return obj;
  },

  ArrayExpression(itprNode) {
    const { node: { elements } } = itprNode;
    return elements.map(el => el && itprNode.walk(el));
  },

  BreakStatement() {
    return new Signal(SignalType.BREAK);
  },

  ContinueStatement() {
    return new Signal(SignalType.CONTINUE);
  },

  ReturnStatement(itprNode) {
    const { node: { argument } } = itprNode;
    const value = argument ? itprNode.walk(argument) : undefined;
    return new Signal(SignalType.RETURN, value);
  },

  ArrowFunctionExpression(itprNode) {
    return createFunction(itprNode);
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
    const argsVal = args.map(arg => itprNode.walk(arg));
    // 有可能是fn()或者obj.fn()
    const fn = itprNode.walk(callee as Identifier | MemberExpression, scope);
    let context = itprNode.globalThis;
    if (callee.type === 'MemberExpression') {
      // obj.fn会是这种类型，所以this会指向object
      context = itprNode.walk(callee.object, scope);
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

    return variable.getValue();
  },

  // 返回的是实例
  NewExpression(itprNode) {
    const { node: { callee, arguments: args } } = itprNode;
    const Constructor = itprNode.walk(callee);
    const argsValue = args.map(arg => itprNode.walk(arg));
    return new Constructor(...argsValue);
  },

  ThrowStatement(itprNode) {
    const { node: { argument } } = itprNode;
    const err = itprNode.walk(argument);
    throw err;
  },

  TryStatement(itprNode) {
    const { node: { block, handler, finalizer } } = itprNode;
    let result;

    try {
      result = itprNode.walk(block);
    } catch (err) {
      if (handler) {
        const fn = itprNode.walk(handler);
        result = fn(err);
      }
    } finally {
      /**
       * while (test) {
       *  try {}
       *  finally {
       *    break; // finally 如果有signal，要上传
       *    console.log(11); // 可以执行到吗
       *  }
       *  console.log(11); // 执行不到
       * }
       */
      if (finalizer) {
        const signal = itprNode.walk(finalizer);
        if (Signal.isSignal(signal)) {
          result = signal;
        }
      }
    }

    return result;
  },

  CatchClause(itprNode) {
    const { node: { param, body }, scope } = itprNode;
    return (err: any) => {
      const { name } = (param as Identifier);
      scope.declare(VariableKind.VAR, name, err);
      return itprNode.walk(body);
    };
  },

  UnaryExpression(itprNode) {
    const { node: { operator } } = itprNode;
    return unaryOperatorMap[operator](itprNode);
  },

  ConditionalExpression(itprNode) {
    const { node: { test, consequent, alternate } } = itprNode;
    return itprNode.walk(test) ? itprNode.walk(consequent) : itprNode.walk(alternate);
  },

  DoWhileStatement(itprNode) {
    const { node: { body, test } } = itprNode;
    // 记得返回值
    let result;
    do {
      result = itprNode.walk(body);
      if (Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (Signal.isReturn(result)) {
        return result;
      }
    } while (itprNode.walk(test));
    return result;
  },

  SequenceExpression(itprNode) {
    const { node: { expressions } } = itprNode;

    const results = expressions.map(expr => itprNode.walk(expr));
    return results.pop();
  },

  SwitchStatement(itprNode) {
    const { node: { discriminant, cases } } = itprNode;
    const discValue = itprNode.walk(discriminant);
    let result;
    for (const caseNode of cases) {
      const { test } = caseNode;
      const condition = test == null ? true : itprNode.walk(test) === discValue;
      if (condition) {
        result = itprNode.walk(caseNode);
        if (Signal.isBreak(result)) {
          result = void 0;
          break;
        } else if (Signal.isReturn(result)) {
          return result;
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
      result = itprNode.walk(con);
      if (Signal.isBreak(result)) {
        result = void 0;
        break;
        // 遇到return，说明在function里，直接返回signal
      } else if (Signal.isReturn(result)) {
        return result;
      }
    }

    return result;
  },

  WhileStatement(itprNode) {
    const { node: { test, body } } = itprNode;
    let result;
    while (itprNode.walk(test)) {
      result = itprNode.walk(body);
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

  WithStatement(itprNode) {
    const { node: { object, body }, scope } = itprNode;
    const objValue = itprNode.walk(object);
    const scopeValue: Record<string, any> = {};
    /**
     * function o1(){}
     * o1.prototype.x = 100;
     * var z = new o1();
     * for in 遍历可以找出x
     */
    // eslint-disable-next-line no-restricted-syntax
    for (const key in objValue) {
      scopeValue[key] = objValue[key];
    }
    const withScope = new Scope(ScopeType.BLOCK, scope, scopeValue);
    const result = itprNode.walk(body, withScope);

    // obj = {a, b, c} 枚举出来的所有变量，进行遍历；如果在作用域有值，就更新值；
    Object.keys(scopeValue).forEach((key) => {
      const variable = withScope.scopeValue[key];
      if (variable && objValue[key]) {
        // objValue 是
        objValue[key] = variable.getValue();
      }
    });

    return result;
  },

  EmptyStatement() {},
};
