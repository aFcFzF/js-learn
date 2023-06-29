"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Interpreter = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _const = require("../const");
var _es = require("../standard/es5");
var _Scope = require("./Scope");
var _Walker = require("./Walker");
var _acorn = require("acorn");
var _ValueDetail = require("./ValueDetail");
var internalScopeValueMap = {
  expr: {},
  full: _Scope.DEFAULT_INTERNAL_FULL_SCOPE_DATA,
  custom: {}
};
var Interpreter = (0, _createClass2.default)(function Interpreter(option) {
  var _this = this;
  (0, _classCallCheck2.default)(this, Interpreter);
  this.evaluate = function (code) {
    var _this$option = _this.option,
      mode = _this$option.mode,
      globalThis = _this$option.globalThis,
      context = _this$option.context;
    var ast = (0, _acorn.parse)(code, {
      ecmaVersion: 2023
    });
    var envScope = new _Scope.Scope(_Scope.ScopeType.ENV, null, internalScopeValueMap[mode]);
    var rootScope = context instanceof _Scope.Scope ? context : new _Scope.Scope(_Scope.ScopeType.BLOCK, envScope, context);
    var ins = new _Walker.Walker({
      sourceCode: code,
      globalThis: globalThis === undefined ? context : globalThis,
      scope: rootScope,
      rootScope: rootScope,
      envScope: envScope,
      node: ast,
      visitorMap: _es.es5
    });
    var evalFunction = function evalFunction(code, scope) {
      var itpr = new Interpreter({
        mode: mode,
        globalThis: globalThis,
        context: scope
      });
      return itpr.evaluate(code);
    };
    Object.defineProperty(evalFunction, _const.EVAL_FUNCTION_IDENTIFIER, {
      value: _const.EVAL_FUNCTION_IDENTIFIER,
      writable: false,
      enumerable: true
    });
    envScope.declare(_ValueDetail.ValueDetailKind.VAR, 'eval', evalFunction);
    var result = ins.run();
    return result;
  };
  var _ref = option || {},
    _ref$mode = _ref.mode,
    mode = _ref$mode === void 0 ? _const.DEFAULT_INTERPRETER_MODE : _ref$mode,
    globalThis = _ref.globalThis,
    _ref$context = _ref.context,
    context = _ref$context === void 0 ? Object.create(null) : _ref$context;
  this.option = {
    mode: mode,
    globalThis: globalThis,
    context: context
  };
});
exports.Interpreter = Interpreter;