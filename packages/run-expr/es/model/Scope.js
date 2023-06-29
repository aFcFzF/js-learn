import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import { ValueDetail, ValueDetailKind } from './ValueDetail';
import { hasOwnProperty } from '../utils';
import { ValueRef } from './ValueRef';
export var DEFAULT_INTERNAL_FULL_SCOPE_DATA = {
  console: console,
  undefined: undefined,
  ReferenceError: ReferenceError,
  Array: Array,
  Date: Date,
  RegExp: RegExp,
  Object: Object,
  Number: Number
};
export var ScopeType;
(function (ScopeType) {
  ScopeType["FUNCTION"] = "function";
  ScopeType["BLOCK"] = "block";
  ScopeType["ENV"] = "env";
})(ScopeType || (ScopeType = {}));
export var ScopeValueRef = function (_ValueRef) {
  _inherits(ScopeValueRef, _ValueRef);
  var _super = _createSuper(ScopeValueRef);
  function ScopeValueRef(option) {
    var _this;
    _classCallCheck(this, ScopeValueRef);
    var container = option.container,
      name = option.name,
      scope = option.scope;
    _this = _super.call(this, container, name);
    _this.scope = scope;
    return _this;
  }
  _createClass(ScopeValueRef, [{
    key: "setValue",
    value: function setValue(val) {
      var _a;
      var scopeDetail = this.scope.getScopeDetail();
      if (((_a = scopeDetail[this.getName()]) === null || _a === void 0 ? void 0 : _a.getKind()) === ValueDetailKind.CONST) {
        throw new TypeError('Assignment to constant variable.');
      }
      return _get(_getPrototypeOf(ScopeValueRef.prototype), "setValue", this).call(this, val);
    }
  }, {
    key: "getScope",
    value: function getScope() {
      return this.scope;
    }
  }]);
  return ScopeValueRef;
}(ValueRef);
export var Scope = function () {
  function Scope(type) {
    var _this2 = this;
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var scopeValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, Scope);
    this.scopeDetail = {};
    this.type = type;
    this.parent = parent;
    this.scopeValue = scopeValue;
    Object.entries(scopeValue).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        key = _ref2[0];
      _this2.scopeDetail[key] = new ValueDetail({
        kind: ValueDetailKind.VAR,
        name: key,
        scope: _this2
      });
    });
  }
  _createClass(Scope, [{
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
      if (hasOwnProperty(this.scopeValue, rawName)) {
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
        case ValueDetailKind.VAR:
          this.defineVar(rawName, value);
          break;
        case ValueDetailKind.LET:
          this.defineLet(rawName, value);
          break;
        case ValueDetailKind.CONST:
          this.defineConst(rawName, value);
          break;
        default:
          throw new Error('define error');
      }
    }
  }, {
    key: "checkDefinition",
    value: function checkDefinition(kind, rawName) {
      return [ValueDetailKind.CONST, ValueDetailKind.LET].includes(kind) && hasOwnProperty(this.scopeValue, rawName);
    }
  }, {
    key: "defineVar",
    value: function defineVar(rawName, value) {
      var scope = this;
      while (scope.parent && scope.parent.type === ScopeType.BLOCK) {
        scope = scope.parent;
      }
      scope.scopeValue[rawName] = value;
      scope.scopeDetail[rawName] = new ValueDetail({
        kind: ValueDetailKind.VAR,
        name: rawName,
        scope: scope
      });
    }
  }, {
    key: "defineLet",
    value: function defineLet(rawName, value) {
      this.scopeValue[rawName] = value;
      this.scopeDetail[rawName] = new ValueDetail({
        kind: ValueDetailKind.LET,
        name: rawName,
        scope: this
      });
    }
  }, {
    key: "defineConst",
    value: function defineConst(rawName, value) {
      this.scopeValue[rawName] = value;
      this.scopeDetail[rawName] = new ValueDetail({
        kind: ValueDetailKind.CONST,
        name: rawName,
        scope: this
      });
    }
  }]);
  return Scope;
}();