import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { hasOwnProperty } from '../utils';
export var ValueRef = function () {
  function ValueRef(container, name) {
    _classCallCheck(this, ValueRef);
    this.container = container;
    this.name = name;
  }
  _createClass(ValueRef, [{
    key: "getValue",
    value: function getValue() {
      if (!hasOwnProperty(this.container, this.name)) {
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