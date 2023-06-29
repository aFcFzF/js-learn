import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var ValueDetailKind;
(function (ValueDetailKind) {
  ValueDetailKind["VAR"] = "var";
  ValueDetailKind["LET"] = "let";
  ValueDetailKind["CONST"] = "const";
})(ValueDetailKind || (ValueDetailKind = {}));
export var ValueDetail = function () {
  function ValueDetail(option) {
    _classCallCheck(this, ValueDetail);
    var name = option.name,
      kind = option.kind,
      scope = option.scope;
    this.name = name;
    this.kind = kind;
    this.scope = scope;
  }
  _createClass(ValueDetail, [{
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