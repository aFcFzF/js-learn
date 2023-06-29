"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueRef = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _utils = require("../utils");
var ValueRef = function () {
  function ValueRef(container, name) {
    (0, _classCallCheck2.default)(this, ValueRef);
    this.container = container;
    this.name = name;
  }
  (0, _createClass2.default)(ValueRef, [{
    key: "getValue",
    value: function getValue() {
      if (!(0, _utils.hasOwnProperty)(this.container, this.name)) {
        throw new ReferenceError("name is not find: ".concat(this.name));
      }
      return this.container[this.name];
    }
  }, {
    key: "setValue",
    value: function setValue(val) {
      return this.container[this.name] = val;
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this.container;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);
  return ValueRef;
}();
exports.ValueRef = ValueRef;