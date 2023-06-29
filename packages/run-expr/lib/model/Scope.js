"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopeValueRef = exports.ScopeType = exports.Scope = exports.DEFAULT_INTERNAL_FULL_SCOPE_DATA = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _ValueDetail = require("./ValueDetail");
var _utils = require("../utils");
var _ValueRef2 = require("./ValueRef");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DEFAULT_INTERNAL_FULL_SCOPE_DATA = {
  console: console,
  undefined: undefined,
  ReferenceError: ReferenceError,
  Array: Array,
  Date: Date,
  RegExp: RegExp,
  Object: Object,
  Number: Number
};
exports.DEFAULT_INTERNAL_FULL_SCOPE_DATA = DEFAULT_INTERNAL_FULL_SCOPE_DATA;
var ScopeType;
exports.ScopeType = ScopeType;
(function (ScopeType) {
  ScopeType["FUNCTION"] = "function";
  ScopeType["BLOCK"] = "block";
  ScopeType["ENV"] = "env";
})(ScopeType || (exports.ScopeType = ScopeType = {}));
var ScopeValueRef = function (_ValueRef) {
  (0, _inherits2.default)(ScopeValueRef, _ValueRef);
  var _super = _createSuper(ScopeValueRef);
  function ScopeValueRef(option) {
    var _this;
    (0, _classCallCheck2.default)(this, ScopeValueRef);
    var container = option.container,
      name = option.name,
      scope = option.scope;
    _this = _super.call(this, container, name);
    _this.scope = scope;
    return _this;
  }
  (0, _createClass2.default)(ScopeValueRef, [{
    key: "setValue",
    value: function setValue(val) {
      var _a;
      var scopeDetail = this.scope.getScopeDetail();
      if (((_a = scopeDetail[this.getName()]) === null || _a === void 0 ? void 0 : _a.getKind()) === _ValueDetail.ValueDetailKind.CONST) {
        throw new TypeError('Assignment to constant variable.');
      }
      return (0, _get2.default)((0, _getPrototypeOf2.default)(ScopeValueRef.prototype), "setValue", this).call(this, val);
    }
  }, {
    key: "getScope",
    value: function getScope() {
      return this.scope;
    }
  }]);
  return ScopeValueRef;
}(_ValueRef2.ValueRef);
exports.ScopeValueRef = ScopeValueRef;
var Scope = function () {
  function Scope(type) {
    var _this2 = this;
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var scopeValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, Scope);
    this.scopeDetail = {};
    this.type = type;
    this.parent = parent;
    this.scopeValue = scopeValue;
    Object.entries(scopeValue).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2.default)(_ref, 1),
        key = _ref2[0];
      _this2.scopeDetail[key] = new _ValueDetail.ValueDetail({
        kind: _ValueDetail.ValueDetailKind.VAR,
        name: key,
        scope: _this2
      });
    });
  }
  (0, _createClass2.default)(Scope, [{
    key: "getScopeValue",
    value: function getScopeValue() {
      return this.scopeValue;
    }
  }, {
    key: "setValue",
    value: function setValue(name, value) {
      var valueDetail = this.scopeDetail[name];
      if (valueDetail == null) {
        throw new Error("value detail not exist, name is ".concat(name));
      }
      return this.scopeValue[name] = value;
    }
  }, {
    key: "deleteScopeValue",
    value: function deleteScopeValue(name) {
      var valueRef = this.search(name);
      var scope = valueRef.getScope();
      delete scope.scopeValue[name];
      delete scope.scopeDetail[name];
    }
  }, {
    key: "getScopeDetail",
    value: function getScopeDetail() {
      return this.scopeDetail;
    }
  }, {
    key: "search",
    value: function search(rawName) {
      if ((0, _utils.hasOwnProperty)(this.scopeValue, rawName)) {
        return new ScopeValueRef({
          container: this.scopeValue,
          name: rawName,
          scope: this
        });
      }
      if (this.parent) {
        return this.parent.search(rawName);
      }
      return new ScopeValueRef({
        container: this.scopeValue,
        name: rawName,
        scope: this
      });
    }
  }, {
    key: "declare",
    value: function declare(kind, rawName, value) {
      if (this.checkDefinition(kind, rawName)) {
        var errMsg = "Uncaught SyntaxError: Identifier '".concat(rawName, "' has already been declared");
        throw new SyntaxError(errMsg);
      }
      switch (kind) {
        case _ValueDetail.ValueDetailKind.VAR:
          this.defineVar(rawName, value);
          break;
        case _ValueDetail.ValueDetailKind.LET:
          this.defineLet(rawName, value);
          break;
        case _ValueDetail.ValueDetailKind.CONST:
          this.defineConst(rawName, value);
          break;
        default:
          throw new Error('define error');
      }
    }
  }, {
    key: "checkDefinition",
    value: function checkDefinition(kind, rawName) {
      return [_ValueDetail.ValueDetailKind.CONST, _ValueDetail.ValueDetailKind.LET].includes(kind) && (0, _utils.hasOwnProperty)(this.scopeValue, rawName);
    }
  }, {
    key: "defineVar",
    value: function defineVar(rawName, value) {
      var scope = this;
      while (scope.parent && scope.parent.type === ScopeType.BLOCK) {
        scope = scope.parent;
      }
      scope.scopeValue[rawName] = value;
      scope.scopeDetail[rawName] = new _ValueDetail.ValueDetail({
        kind: _ValueDetail.ValueDetailKind.VAR,
        name: rawName,
        scope: scope
      });
    }
  }, {
    key: "defineLet",
    value: function defineLet(rawName, value) {
      this.scopeValue[rawName] = value;
      this.scopeDetail[rawName] = new _ValueDetail.ValueDetail({
        kind: _ValueDetail.ValueDetailKind.LET,
        name: rawName,
        scope: this
      });
    }
  }, {
    key: "defineConst",
    value: function defineConst(rawName, value) {
      this.scopeValue[rawName] = value;
      this.scopeDetail[rawName] = new _ValueDetail.ValueDetail({
        kind: _ValueDetail.ValueDetailKind.CONST,
        name: rawName,
        scope: this
      });
    }
  }]);
  return Scope;
}();
exports.Scope = Scope;