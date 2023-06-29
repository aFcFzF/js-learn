"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueDetailKind = exports.ValueDetail = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var ValueDetailKind;
exports.ValueDetailKind = ValueDetailKind;
(function (ValueDetailKind) {
  ValueDetailKind["VAR"] = "var";
  ValueDetailKind["LET"] = "let";
  ValueDetailKind["CONST"] = "const";
})(ValueDetailKind || (exports.ValueDetailKind = ValueDetailKind = {}));
var ValueDetail = function () {
  function ValueDetail(option) {
    (0, _classCallCheck2.default)(this, ValueDetail);
    var name = option.name,
      kind = option.kind,
      scope = option.scope;
    this.name = name;
    this.kind = kind;
    this.scope = scope;
  }
  (0, _createClass2.default)(ValueDetail, [{
    key: "getKind",
    value: function getKind() {
      return this.kind;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "getScope",
    value: function getScope() {
      return this.scope;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      var valueDetail = this.scope.getScopeDetail();
      if (!valueDetail) {
        throw new Error('unreachable: valueDetail is null');
      }
      delete valueDetail[this.name];
    }
  }]);
  return ValueDetail;
}();
exports.ValueDetail = ValueDetail;