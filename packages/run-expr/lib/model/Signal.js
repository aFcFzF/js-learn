"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignalType = exports.Signal = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var SignalType;
exports.SignalType = SignalType;
(function (SignalType) {
  SignalType["BREAK"] = "break";
  SignalType["CONTINUE"] = "continue";
  SignalType["RETURN"] = "return";
})(SignalType || (exports.SignalType = SignalType = {}));
var Signal = function () {
  function Signal(signalType, val) {
    (0, _classCallCheck2.default)(this, Signal);
    this.signalType = signalType;
    this.val = val;
  }
  (0, _createClass2.default)(Signal, null, [{
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
exports.Signal = Signal;