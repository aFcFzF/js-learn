import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var SignalType;
(function (SignalType) {
  SignalType["BREAK"] = "break";
  SignalType["CONTINUE"] = "continue";
  SignalType["RETURN"] = "return";
})(SignalType || (SignalType = {}));
export var Signal = function () {
  function Signal(signalType, val) {
    _classCallCheck(this, Signal);
    this.signalType = signalType;
    this.val = val;
  }
  _createClass(Signal, null, [{
    key: "isSignal",
    value: function isSignal(target) {
      return target instanceof Signal;
    }
  }, {
    key: "is",
    value: function is(target, type) {
      return Signal.isSignal(target) && target.signalType === type;
    }
  }, {
    key: "isContinue",
    value: function isContinue(target) {
      return Signal.is(target, SignalType.CONTINUE);
    }
  }, {
    key: "isBreak",
    value: function isBreak(target) {
      return Signal.is(target, SignalType.BREAK);
    }
  }, {
    key: "isReturn",
    value: function isReturn(target) {
      return Signal.is(target, SignalType.RETURN);
    }
  }]);
  return Signal;
}();