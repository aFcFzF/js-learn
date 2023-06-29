"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFuncInfo = exports.createFunction = void 0;
var _Scope = require("./Scope");
var _ValueDetail = require("./ValueDetail");
var _Signal = require("./Signal");
var updateFuncInfo = function updateFuncInfo(option) {
  var fn = option.fn,
    name = option.name,
    length = option.length,
    sourceCode = option.sourceCode,
    start = option.start,
    end = option.end;
  if (name) {
    Object.defineProperty(fn, 'name', {
      value: name,
      writable: false,
      enumerable: true,
      configurable: true
    });
  }
  if (length) {
    Object.defineProperty(fn, 'length', {
      value: length,
      writable: false,
      enumerable: false,
      configurable: true
    });
  }
  Object.defineProperty(fn, 'toString', {
    value: function value() {
      return sourceCode.slice(start, end);
    },
    writable: true,
    configurable: true,
    enumerable: false
  });
};
exports.updateFuncInfo = updateFuncInfo;
var createFunction = function createFunction(itprNode) {
  var node = itprNode.node,
    scope = itprNode.scope,
    sourceCode = itprNode.sourceCode,
    globalThis = itprNode.globalThis;
  var params = node.params,
    body = node.body,
    _node$start = node.start,
    start = _node$start === void 0 ? 0 : _node$start,
    _node$end = node.end,
    end = _node$end === void 0 ? 0 : _node$end;
  var fnName;
  if ('id' in node && node.id) {
    var name = node.id.name;
    fnName = name;
  }
  var fn = function fn() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var fnScope = new _Scope.Scope(_Scope.ScopeType.FUNCTION, scope);
    var argsValue = [];
    var argumentsIsDefined = false;
    params.forEach(function (param, idx) {
      if (param.type !== 'Identifier') {
        throw new Error("function param type not support: ".concat(param));
      }
      if (!argumentsIsDefined) {
        argumentsIsDefined = param.name === 'arguments';
      }
      var value = args[idx];
      fnScope.declare(_ValueDetail.ValueDetailKind.VAR, param.name, args[idx]);
      argsValue.push(value);
    });
    if (fnName) {
      fnScope.declare(_ValueDetail.ValueDetailKind.VAR, fnName, fn);
    }
    var context = this;
    if (node.type === 'ArrowFunctionExpression') {
      var scopeValueRef = scope.search('this');
      try {
        context = scopeValueRef.getValue();
      } catch (err) {
        if (err instanceof ReferenceError) {
          context = globalThis;
        }
      }
    }
    fnScope.declare(_ValueDetail.ValueDetailKind.CONST, 'this', context);
    if (!argumentsIsDefined) {
      fnScope.declare(_ValueDetail.ValueDetailKind.CONST, 'arguments', argsValue);
    }
    var result = itprNode.walk(body, fnScope);
    if (_Signal.Signal.isReturn(result)) {
      return result.val;
    }
  };
  updateFuncInfo({
    fn: fn,
    name: fnName,
    length: params.length,
    sourceCode: sourceCode,
    start: start,
    end: end
  });
  return fn;
};
exports.createFunction = createFunction;