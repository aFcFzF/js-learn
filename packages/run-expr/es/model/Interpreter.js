import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import { DEFAULT_INTERPRETER_MODE, EVAL_FUNCTION_IDENTIFIER } from '../const';
import { es5 } from '../standard/es5';
import { Scope, ScopeType, DEFAULT_INTERNAL_FULL_SCOPE_DATA } from './Scope';
import { Walker } from './Walker';
import { parse } from 'acorn';
import { ValueDetailKind } from './ValueDetail';
var internalScopeValueMap = {
  expr: {},
  full: DEFAULT_INTERNAL_FULL_SCOPE_DATA,
  custom: {}
};
export var Interpreter = _createClass(function Interpreter(option) {
  var _this = this;
  _classCallCheck(this, Interpreter);
  this.evaluate = function (code) {
    var _this$option = _this.option,
      mode = _this$option.mode,
      globalThis = _this$option.globalThis,
      context = _this$option.context;
    var ast = parse(code, {
      ecmaVersion: 2023
    });
    var envScope = new Scope(ScopeType.ENV, null, internalScopeValueMap[mode]);
    var rootScope = context instanceof Scope ? context : new Scope(ScopeType.BLOCK, envScope, context);
    var ins = new Walker({
      sourceCode: code,
      globalThis: globalThis === undefined ? context : globalThis,
      scope: rootScope,
      rootScope: rootScope,
      envScope: envScope,
      node: ast,
      visitorMap: es5
    });
    var evalFunction = function evalFunction(code, scope) {
      var itpr = new Interpreter({
        mode: mode,
        globalThis: globalThis,
        context: scope
      });
      return itpr.evaluate(code);
    };
    Object.defineProperty(evalFunction, EVAL_FUNCTION_IDENTIFIER, {
      value: EVAL_FUNCTION_IDENTIFIER,
      writable: false,
      enumerable: true
    });
    envScope.declare(ValueDetailKind.VAR, 'eval', evalFunction);
    var result = ins.run();
    return result;
  };
  var _ref = option || {},
    _ref$mode = _ref.mode,
    mode = _ref$mode === void 0 ? DEFAULT_INTERPRETER_MODE : _ref$mode,
    globalThis = _ref.globalThis,
    _ref$context = _ref.context,
    context = _ref$context === void 0 ? Object.create(null) : _ref$context;
  this.option = {
    mode: mode,
    globalThis: globalThis,
    context: context
  };
});