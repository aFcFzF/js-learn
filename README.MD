### 问题：
1. 为什么要做表达式执行器
  - eval 兼容性问题, 小程序不支持，开发/生产环境不一致导致问题
  - babel 体积太大，影响生产环境
  - 安全问题
2. 为啥不用开源库
- 太大，开源库大而全，我们场景仅限于表达式
- 慢：
- 兼容性不佳，eval5只兼容eval5，其实扩展语法尤其是表达式，不需要babel
3. 如何保证稳定性
- 基本语法单测
- 抄作业：ecma262提供了完备的单元测试，粒度精细到每1条规范；eshost: (https://www.npmjs.com/package/eshost) 相当于各种bin -> evaluate
- 运行大型项目
4. 实际性能

### TODO
interpreter -> interpolation -> math.js -> uglify -> postcss -> eslint
https://github.com/tc39/test262

### 参考


### 开发疑问：
- 问题1：
  - Q: 不能申请匿名function，是因为要在scope调用吗？可以申明匿名自执行是怎么回事，怎么找到的；
  - A: 猜想下：因为自执行，估计执行时就是iife，不需要找。
- 问题2：
  - Q: scope 是按顺序来的吗？比如ast数组前一个是定义scope，后面再想定义scope呢（试一下const，估计是BlockStatement）
- 问题3：switch case 出现return语句：实际上是function的退出，否则parse阶段就会失败, 所以处理要向上冒泡: return signal -> case -> switch -> fn
``` javascript
function fn() {
    var type = '1';
    switch(type) {
      case '1': {
        return 111111;
      }
    }
}
```
- 问题4: try {} catch {} 遇到Signal结束运行并向上冒泡。
- 问题5: new 和evaluate都支持传作用域，到底形成几个
  1. 形成1个，那么this指向可以确定了，就是rootScope
  2. 但是删除evaluate scope上的属性，不要影响rootScope
  3. 所以最终还得是两个，并且用Object.create连起来
- 问题6: 函数一定是block包起来的

### 参考文献
|地址|备注|
|--|--|
|https://www.apiref.com/javascript-zh/Language_Resources.htm|es规范|

### 进展：
262-test:
|日期|通过数|通过率|备注|
|--|--|--|--|
|2023.06.12|588/10683|5.50%|全量|
|2022.06.12|778/10683|7.28%|注入Number；支持三元表达式|
|2022.06.12|1346/1068|12.60%|升级version|

262-test-eval5:
|spec|日期|通过数|通过率|备注|
|--|--|--|--|--|
|ch07-词法：字面量、标点符号、保留字|2023.06.21|483/548|88.14%|忽略strict mode、增加globalThis为空对象|
|ch08-各种类型||修复Infinity|

eval5-test:
|日期|通过数|通过率|备注|
|--|--|--|--|
|2023.06.14|22/121|5.50%|修复部分问题|
|2023.06.19|8/135|94%|修复问题: getter实现; 扫描var(嵌套TODO)|
|2023.06.20|149/149|100%|修复问题 Variable、context、globalThis、fn.toString|
|2022.06.20|158/160|98.75%|引入with this问题|
