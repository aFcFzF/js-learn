1. 为什么要做表达式执行器
  1. eval 兼容性问题, 小程序不支持，开发/生产环境不一致导致问题
  2. babel 体积太大，影响生产环境
  3. 安全问题
2. 为啥不用开源库
  1. 太大，开源库大而全，我们场景仅限于表达式
  2. 慢：
  3. 兼容性不佳，对esnext语法不能及时跟进

---
1. 如何保证稳定性
抄作业：ecma262提供了完备的单元测试，粒度精细到每1条规范

interpreter -> interpolation -> math.js -> uglify -> postcss -> eslint
https://github.com/tc39/test262

eshost: (https://www.npmjs.com/package/eshost) 相当于各种bin -> evaluate


自己疑问：
---
1. Q: 不能申请匿名function，是因为要在scope调用吗？可以申明匿名自执行是怎么回事，怎么找到的；
   A: 猜想下：因为自执行，估计执行时就是iife，不需要找。
2. Q: scope 是按顺序来的吗？比如ast数组前一个是定义scope，后面再想定义scope呢（试一下const，估计是BlockStatement）