"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.es5 = void 0;
var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _typeof3 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _Scope = require("../model/Scope");
var _ValueDetail = require("../model/ValueDetail");
var _Signal = require("../model/Signal");
var _Function = require("../model/Function");
var _utils = require("../utils");
var _ValueRef = require("../model/ValueRef");
var _const = require("../const");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
;
var operateMap = {
  '+': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) + itprNode.walk(itprNode.node.right);
  },
  '-': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) - itprNode.walk(itprNode.node.right);
  },
  '*': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) * itprNode.walk(itprNode.node.right);
  },
  '/': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) / itprNode.walk(itprNode.node.right);
  },
  '==': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) == itprNode.walk(itprNode.node.right);
  },
  '!=': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) != itprNode.walk(itprNode.node.right);
  },
  '===': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) === itprNode.walk(itprNode.node.right);
  },
  '!==': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) !== itprNode.walk(itprNode.node.right);
  },
  '<': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) < itprNode.walk(itprNode.node.right);
  },
  '<=': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) <= itprNode.walk(itprNode.node.right);
  },
  '>': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) > itprNode.walk(itprNode.node.right);
  },
  '>=': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) >= itprNode.walk(itprNode.node.right);
  },
  '<<': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) << itprNode.walk(itprNode.node.right);
  },
  '>>': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) >> itprNode.walk(itprNode.node.right);
  },
  '>>>': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) >>> itprNode.walk(itprNode.node.right);
  },
  '%': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) % itprNode.walk(itprNode.node.right);
  },
  '**': function _(itprNode) {
    return Math.pow(itprNode.walk(itprNode.node.left), itprNode.walk(itprNode.node.right));
  },
  '|': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) | itprNode.walk(itprNode.node.right);
  },
  '^': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) ^ itprNode.walk(itprNode.node.right);
  },
  '&': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) & itprNode.walk(itprNode.node.right);
  },
  in: function _in(itprNode) {
    return itprNode.walk(itprNode.node.left) in itprNode.walk(itprNode.node.right);
  },
  instanceof: function _instanceof(itprNode) {
    return itprNode.walk(itprNode.node.left) instanceof itprNode.walk(itprNode.node.right);
  }
};
var assignOperator = {
  '%=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() % rhsValue);
  },
  '+=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() + rhsValue);
  },
  '-=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() - rhsValue);
  },
  '*=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() * rhsValue);
  },
  '/=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() / rhsValue);
  },
  '=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(rhsValue);
  },
  '<<=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() << rhsValue);
  },
  '>>=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() >> rhsValue);
  },
  '>>>=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() >>> rhsValue);
  },
  '&&=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() && rhsValue);
  },
  '**=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(Math.pow(lhsRef.getValue(), rhsValue));
  },
  '||=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() || rhsValue);
  },
  '|=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() | rhsValue);
  },
  '&=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() & rhsValue);
  },
  '^=': function _(lhsRef, rhsValue) {
    return lhsRef.setValue(lhsRef.getValue() ^ rhsValue);
  },
  '??=': function _(lhsRef, rhsValue) {
    var lValue = lhsRef.getValue();
    return lhsRef.setValue(lValue == null ? rhsValue : lValue);
  }
};
var logicalOperatorMap = {
  '&&': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) && itprNode.walk(itprNode.node.right);
  },
  '||': function _(itprNode) {
    return itprNode.walk(itprNode.node.left) || itprNode.walk(itprNode.node.right);
  },
  '??': function _(itprNode) {
    var leftVal = itprNode.walk(itprNode.node.left);
    return leftVal == null ? itprNode.walk(itprNode.node.right) : leftVal;
  }
};
var unaryOperatorMap = {
  typeof: function _typeof(itprNode) {
    try {
      return (0, _typeof3.default)(itprNode.walk(itprNode.node.argument));
    } catch (err) {
      if (err instanceof ReferenceError) {
        return 'undefined';
      }
      throw err;
    }
  },
  '!': function _(itprNode) {
    return !itprNode.walk(itprNode.node.argument);
  },
  '+': function _(itprNode) {
    return +itprNode.walk(itprNode.node.argument);
  },
  '-': function _(itprNode) {
    return -itprNode.walk(itprNode.node.argument);
  },
  '~': function _(itprNode) {
    return ~itprNode.walk(itprNode.node.argument);
  },
  delete: function _delete(itprNode) {
    var argument = itprNode.node.argument;
    if (argument.type === 'Literal') {
      return delete argument.value;
    }
    var valueRef;
    if (argument.type === 'Identifier') {
      valueRef = getScopeValueRef(argument, itprNode);
    } else if (argument.type === 'MemberExpression') {
      valueRef = getMemberValueRef(argument, itprNode);
    } else {
      throw new Error("unSupported delete type: ".concat(argument.type));
    }
    var container = valueRef.getContainer();
    var name = valueRef.getName();
    return delete container[name];
  },
  void: function _void(itprNode) {
    return void itprNode.walk(itprNode.node.argument);
  }
};
var getScopeValueRef = function getScopeValueRef(node, itprNode) {
  var scope = itprNode.scope;
  var name = node.name;
  return scope.search(name);
};
var getMemberValueRef = function getMemberValueRef(node, itprNode) {
  var object = node.object,
    property = node.property,
    computed = node.computed;
  var obj = itprNode.walk(object);
  var propName;
  if (computed) {
    propName = itprNode.walk(property);
  } else if (property.type === 'Identifier') {
    propName = property.name;
  }
  if (propName == null) {
    throw new Error("unSupport variable type: ".concat(JSON.stringify(property)));
  }
  var propRef = new _ValueRef.ValueRef(obj, propName);
  return propRef;
};
var es5 = {
  BinaryExpression: function BinaryExpression(itprNode) {
    var operator = itprNode.node.operator;
    if (operateMap[operator] == null) {
      throw new Error("operator not allow: ".concat(operator));
    }
    return operateMap[operator](itprNode);
  },
  Literal: function Literal(itprNode) {
    var node = itprNode.node;
    if ('regex' in node) {
      var _node$regex = node.regex,
        pattern = _node$regex.pattern,
        flags = _node$regex.flags;
      return new RegExp(pattern, flags);
    }
    return node.value;
  },
  Program: function Program(itprNode) {
    var body = itprNode.node.body;
    return itprNode.walk({
      type: 'BlockStatement',
      body: body,
      start: 0,
      end: 0
    });
  },
  ExpressionStatement: function ExpressionStatement(itprNode) {
    var node = itprNode.node;
    return itprNode.walk(node.expression);
  },
  VariableDeclaration: function VariableDeclaration(itprNode) {
    var node = itprNode.node,
      scope = itprNode.scope;
    var declarations = node.declarations,
      kind = node.kind;
    declarations.forEach(function (decl) {
      var id = decl.id,
        init = decl.init,
        start = decl.start,
        end = decl.end;
      var key = id.name;
      var value = init ? itprNode.walk(init) : undefined;
      if (scope.type === _Scope.ScopeType.BLOCK && kind === _ValueDetail.ValueDetailKind.VAR) {
        var searchResult = scope.search(key);
        var variableHasDeclared = true;
        try {
          searchResult.getValue();
        } catch (err) {
          if (err instanceof ReferenceError) {
            variableHasDeclared = false;
          }
        }
        if (!variableHasDeclared || init != null) {
          scope.declare(_ValueDetail.ValueDetailKind.VAR, key, value);
        }
      } else {
        scope.declare(kind, key, value);
      }
      if ((init === null || init === void 0 ? void 0 : init.type) === 'FunctionExpression' || (init === null || init === void 0 ? void 0 : init.type) === 'ArrowFunctionExpression') {
        (0, _Function.updateFuncInfo)({
          fn: value,
          name: key,
          sourceCode: itprNode.sourceCode,
          start: start,
          end: end
        });
      }
    });
  },
  Identifier: function Identifier(itprNode) {
    var node = itprNode.node;
    var scopeValueRef = getScopeValueRef(node, itprNode);
    return scopeValueRef.getValue();
  },
  ForStatement: function ForStatement(itprNode) {
    var _itprNode$node = itprNode.node,
      init = _itprNode$node.init,
      test = _itprNode$node.test,
      update = _itprNode$node.update,
      body = _itprNode$node.body;
    var forScope = new _Scope.Scope(_Scope.ScopeType.BLOCK, itprNode.scope);
    var result;
    for (init && itprNode.walk(init, forScope); test ? itprNode.walk(test, forScope) : true; update && itprNode.walk(update, forScope)) {
      result = itprNode.walk(body, forScope);
      if (_Signal.Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (_Signal.Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (_Signal.Signal.isReturn(result)) {
        return result.val;
      }
    }
    return result;
  },
  UpdateExpression: function UpdateExpression(itprNode) {
    var _itprNode$node2 = itprNode.node,
      operator = _itprNode$node2.operator,
      argument = _itprNode$node2.argument,
      prefix = _itprNode$node2.prefix;
    var valueRef;
    if (argument.type === 'Identifier') {
      valueRef = getScopeValueRef(argument, itprNode);
    } else if (argument.type === 'MemberExpression') {
      valueRef = getMemberValueRef(argument, itprNode);
    } else {
      throw new Error("unSupport type ".concat(JSON.stringify(argument)));
    }
    var prevVal = valueRef.getValue();
    var afterVal;
    if (operator === '++') {
      afterVal = prevVal + 1;
    } else if (operator === '--') {
      afterVal = prevVal - 1;
    } else {
      throw new Error('unSupport val');
    }
    valueRef.setValue(afterVal);
    return prefix ? afterVal : prevVal;
  },
  ForInStatement: function ForInStatement(itprNode) {
    var _itprNode$node3 = itprNode.node,
      left = _itprNode$node3.left,
      right = _itprNode$node3.right,
      body = _itprNode$node3.body;
    var forScope = new _Scope.Scope(_Scope.ScopeType.BLOCK, itprNode.scope);
    var propName;
    if (left.type === 'VariableDeclaration') {
      var kind = left.kind,
        declarations = left.declarations;
      var identifierName = declarations[0].id.name;
      propName = identifierName;
      forScope.declare(kind, propName, null);
    } else if (left.type === 'Identifier') {
      propName = left.name;
    } else {
      throw new Error('for in unSupport name');
    }
    var rightVal = itprNode.walk(right);
    var result;
    for (var prop in rightVal) {
      var assignmentExp = {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: propName,
          start: 0,
          end: 0
        },
        right: {
          type: 'Literal',
          value: prop,
          start: 0,
          end: 0
        },
        start: 0,
        end: 0
      };
      itprNode.walk(assignmentExp, forScope);
      result = itprNode.walk(body, forScope);
      if (_Signal.Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (_Signal.Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (_Signal.Signal.isReturn(result)) {
        return result.val;
      }
    }
    return result;
  },
  IfStatement: function IfStatement(itprNode) {
    var _itprNode$node4 = itprNode.node,
      test = _itprNode$node4.test,
      consequent = _itprNode$node4.consequent,
      alternate = _itprNode$node4.alternate;
    var pass = itprNode.walk(test);
    if (pass) {
      return itprNode.walk(consequent);
    }
    if (alternate) {
      return itprNode.walk(alternate);
    }
  },
  LogicalExpression: function LogicalExpression(itprNode) {
    var operator = itprNode.node.operator;
    return logicalOperatorMap[operator](itprNode);
  },
  BlockStatement: function BlockStatement(itprNode) {
    var body = itprNode.node.body;
    var blockScope = new _Scope.Scope(_Scope.ScopeType.BLOCK, itprNode.scope);
    var statements = (0, _utils.getHostingStatements)(body);
    var result;
    var _iterator = _createForOfIteratorHelper(statements),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var statement = _step.value;
        result = itprNode.walk(statement, blockScope);
        if (_Signal.Signal.isSignal(result)) {
          return result;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return result;
  },
  AssignmentExpression: function AssignmentExpression(itprNode) {
    var _itprNode$node5 = itprNode.node,
      left = _itprNode$node5.left,
      right = _itprNode$node5.right,
      operator = _itprNode$node5.operator,
      rootScope = itprNode.rootScope;
    var leftValRef;
    if (left.type === 'Identifier') {
      var scopeValueRef = getScopeValueRef(left, itprNode);
      var name = scopeValueRef.getName();
      try {
        scopeValueRef.getValue();
        leftValRef = scopeValueRef;
      } catch (err) {
        if (err instanceof ReferenceError && operator === '=' && left.type === 'Identifier') {
          rootScope.declare(_ValueDetail.ValueDetailKind.VAR, name, undefined);
          leftValRef = new _ValueRef.ValueRef(rootScope.getScopeValue(), name);
        } else {
          throw err;
        }
      }
    } else if (left.type === 'MemberExpression') {
      leftValRef = getMemberValueRef(left, itprNode);
    } else {
      throw new Error("unSupport left type: ".concat(left.type));
    }
    var rightValue = itprNode.walk(right);
    return assignOperator[operator](leftValRef, rightValue);
  },
  MemberExpression: function MemberExpression(itprNode) {
    var _itprNode$node6 = itprNode.node,
      object = _itprNode$node6.object,
      property = _itprNode$node6.property,
      computed = _itprNode$node6.computed;
    var key = computed ? itprNode.walk(property) : property.name;
    var obj = itprNode.walk(object);
    return obj[key];
  },
  ObjectExpression: function ObjectExpression(itprNode) {
    var properties = itprNode.node.properties,
      sourceCode = itprNode.sourceCode;
    var obj = {};
    properties.forEach(function (prop) {
      var _a;
      if (prop.type === 'Property') {
        var key = prop.key,
          value = prop.value;
        var propName;
        if (key.type === 'Identifier') {
          propName = key.name;
        } else if (key.type === 'Literal') {
          propName = itprNode.walk(key);
        } else {
          throw new Error("".concat(key.type, " not exist! detail: ").concat(JSON.stringify(key)));
        }
        var descriptor = {
          configurable: true,
          enumerable: true
        };
        if (prop.kind === 'get') {
          descriptor.get = itprNode.walk(value);
        } else if (prop.kind === 'set') {
          descriptor.set = itprNode.walk(value);
        } else {
          descriptor.value = itprNode.walk(value);
          descriptor.writable = true;
          if (value.type === 'FunctionExpression') {
            var fnName = ((_a = value.id) === null || _a === void 0 ? void 0 : _a.name) || propName;
            (0, _Function.updateFuncInfo)({
              fn: descriptor.value,
              name: fnName,
              length: value.params.length,
              start: value.start,
              end: value.end,
              sourceCode: sourceCode
            });
          }
        }
        Object.defineProperty(obj, propName, descriptor);
      }
    });
    return obj;
  },
  ArrayExpression: function ArrayExpression(itprNode) {
    var elements = itprNode.node.elements;
    return elements.map(function (el) {
      return el && itprNode.walk(el);
    });
  },
  BreakStatement: function BreakStatement() {
    return new _Signal.Signal(_Signal.SignalType.BREAK);
  },
  ContinueStatement: function ContinueStatement() {
    return new _Signal.Signal(_Signal.SignalType.CONTINUE);
  },
  ReturnStatement: function ReturnStatement(itprNode) {
    var argument = itprNode.node.argument;
    var value = argument ? itprNode.walk(argument) : undefined;
    return new _Signal.Signal(_Signal.SignalType.RETURN, value);
  },
  ArrowFunctionExpression: function ArrowFunctionExpression(itprNode) {
    return (0, _Function.createFunction)(itprNode);
  },
  FunctionDeclaration: function FunctionDeclaration(itprNode) {
    var id = itprNode.node.id,
      scope = itprNode.scope;
    var fnName = id === null || id === void 0 ? void 0 : id.name;
    if (!fnName) {
      throw new Error('fetal error: function declare fail, must has name');
    }
    var fn = (0, _Function.createFunction)(itprNode);
    scope.declare(_ValueDetail.ValueDetailKind.VAR, fnName, fn);
  },
  CallExpression: function CallExpression(itprNode) {
    var _itprNode$node7 = itprNode.node,
      callee = _itprNode$node7.callee,
      args = _itprNode$node7.arguments,
      scope = itprNode.scope;
    var argsVal = args.map(function (arg) {
      return itprNode.walk(arg);
    });
    var fn = itprNode.walk(callee, scope);
    var context = itprNode.globalThis;
    if (callee.type === 'MemberExpression') {
      context = itprNode.walk(callee.object, scope);
    }
    if (!fn) {
      throw new Error("function not exist callee.name\uFF01".concat(JSON.stringify(callee)));
    }
    if (callee.type === 'Identifier' && fn.EVAL_FUNCTION_IDENTIFIER === _const.EVAL_FUNCTION_IDENTIFIER) {
      var code = argsVal[0];
      return fn.call(context, code, scope);
    }
    return fn.call.apply(fn, [context].concat((0, _toConsumableArray2.default)(argsVal)));
  },
  FunctionExpression: function FunctionExpression(itprNode) {
    return (0, _Function.createFunction)(itprNode);
  },
  ThisExpression: function ThisExpression(itprNode) {
    var scope = itprNode.scope;
    var searchResult = scope.search('this');
    try {
      return searchResult.getValue();
    } catch (err) {
      if (err instanceof ReferenceError) {
        return itprNode.globalThis;
      }
      throw err;
    }
  },
  NewExpression: function NewExpression(itprNode) {
    var _itprNode$node8 = itprNode.node,
      callee = _itprNode$node8.callee,
      args = _itprNode$node8.arguments;
    var Constructor = itprNode.walk(callee);
    var argsValue = args.map(function (arg) {
      return itprNode.walk(arg);
    });
    return (0, _construct2.default)(Constructor, (0, _toConsumableArray2.default)(argsValue));
  },
  ThrowStatement: function ThrowStatement(itprNode) {
    var argument = itprNode.node.argument;
    var err = itprNode.walk(argument);
    throw err;
  },
  TryStatement: function TryStatement(itprNode) {
    var _itprNode$node9 = itprNode.node,
      block = _itprNode$node9.block,
      handler = _itprNode$node9.handler,
      finalizer = _itprNode$node9.finalizer;
    var result;
    try {
      result = itprNode.walk(block);
    } catch (err) {
      if (handler) {
        var fn = itprNode.walk(handler);
        result = fn(err);
      }
    } finally {
      if (finalizer) {
        var signal = itprNode.walk(finalizer);
        if (_Signal.Signal.isSignal(signal)) {
          result = signal;
        }
      }
    }
    return result;
  },
  CatchClause: function CatchClause(itprNode) {
    var _itprNode$node10 = itprNode.node,
      param = _itprNode$node10.param,
      body = _itprNode$node10.body,
      scope = itprNode.scope;
    return function (err) {
      var name = param.name;
      scope.declare(_ValueDetail.ValueDetailKind.VAR, name, err);
      return itprNode.walk(body);
    };
  },
  UnaryExpression: function UnaryExpression(itprNode) {
    var operator = itprNode.node.operator;
    return unaryOperatorMap[operator](itprNode);
  },
  ConditionalExpression: function ConditionalExpression(itprNode) {
    var _itprNode$node11 = itprNode.node,
      test = _itprNode$node11.test,
      consequent = _itprNode$node11.consequent,
      alternate = _itprNode$node11.alternate;
    return itprNode.walk(test) ? itprNode.walk(consequent) : itprNode.walk(alternate);
  },
  DoWhileStatement: function DoWhileStatement(itprNode) {
    var _itprNode$node12 = itprNode.node,
      body = _itprNode$node12.body,
      test = _itprNode$node12.test;
    var result;
    do {
      result = itprNode.walk(body);
      if (_Signal.Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (_Signal.Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (_Signal.Signal.isReturn(result)) {
        return result;
      }
    } while (itprNode.walk(test));
    return result;
  },
  SequenceExpression: function SequenceExpression(itprNode) {
    var expressions = itprNode.node.expressions;
    var results = expressions.map(function (expr) {
      return itprNode.walk(expr);
    });
    return results.pop();
  },
  SwitchStatement: function SwitchStatement(itprNode) {
    var _itprNode$node13 = itprNode.node,
      discriminant = _itprNode$node13.discriminant,
      cases = _itprNode$node13.cases;
    var discValue = itprNode.walk(discriminant);
    var result;
    var _iterator2 = _createForOfIteratorHelper(cases),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var caseNode = _step2.value;
        var test = caseNode.test;
        var condition = test == null ? true : itprNode.walk(test) === discValue;
        if (condition) {
          result = itprNode.walk(caseNode);
          if (_Signal.Signal.isBreak(result)) {
            result = void 0;
            break;
          } else if (_Signal.Signal.isReturn(result)) {
            return result;
          }
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return result;
  },
  SwitchCase: function SwitchCase(itprNode) {
    var consequent = itprNode.node.consequent;
    var result;
    var _iterator3 = _createForOfIteratorHelper(consequent),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var con = _step3.value;
        result = itprNode.walk(con);
        if (_Signal.Signal.isBreak(result)) {
          result = void 0;
          break;
        } else if (_Signal.Signal.isReturn(result)) {
          return result;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return result;
  },
  WhileStatement: function WhileStatement(itprNode) {
    var _itprNode$node14 = itprNode.node,
      test = _itprNode$node14.test,
      body = _itprNode$node14.body;
    var result;
    while (itprNode.walk(test)) {
      result = itprNode.walk(body);
      if (_Signal.Signal.isBreak(result)) {
        result = void 0;
        break;
      } else if (_Signal.Signal.isContinue(result)) {
        result = void 0;
        continue;
      } else if (_Signal.Signal.isReturn(result)) {
        return result.val;
      }
    }
    return result;
  },
  WithStatement: function WithStatement(itprNode) {
    var _itprNode$node15 = itprNode.node,
      object = _itprNode$node15.object,
      body = _itprNode$node15.body,
      scope = itprNode.scope;
    var objValue = itprNode.walk(object);
    var scopeValue = {};
    for (var key in objValue) {
      scopeValue[key] = objValue[key];
    }
    var withScope = new _Scope.Scope(_Scope.ScopeType.BLOCK, scope, scopeValue);
    var result = itprNode.walk(body, withScope);
    Object.keys(scopeValue).forEach(function (key) {
      var scopeValue = withScope.getScopeValue();
      if ((0, _utils.hasOwnProperty)(scopeValue, key) && objValue[key]) {
        objValue[key] = scopeValue[key];
      }
    });
    return result;
  },
  EmptyStatement: function EmptyStatement() {}
};
exports.es5 = es5;