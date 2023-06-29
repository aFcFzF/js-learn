import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var Walker = function () {
  function Walker(option) {
    _classCallCheck(this, Walker);
    var node = option.node,
      scope = option.scope,
      globalThis = option.globalThis,
      visitorMap = option.visitorMap,
      rootScope = option.rootScope,
      envScope = option.envScope,
      sourceCode = option.sourceCode;
    this.node = node;
    this.scope = scope;
    this.rootScope = rootScope;
    this.envScope = envScope;
    this.globalThis = globalThis;
    this.visitorMap = visitorMap;
    this.sourceCode = sourceCode;
  }
  _createClass(Walker, [{
    key: "walk",
    value: function walk(esNode, scope) {
      var instance = new Walker({
        node: esNode,
        scope: scope || this.scope,
        visitorMap: this.visitorMap,
        rootScope: this.rootScope,
        envScope: this.envScope,
        globalThis: this.globalThis,
        sourceCode: this.sourceCode
      });
      if (instance.node.type in this.visitorMap) {
        var visitor = this.visitorMap[instance.node.type];
        return visitor(instance);
      }
      throw "".concat(instance.node.type, " not supported!");
    }
  }, {
    key: "run",
    value: function run() {
      return this.walk(this.node);
    }
  }]);
  return Walker;
}();