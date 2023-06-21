/// Copyright (c) 2012 Ecma International.  All rights reserved.
/// Ecma International makes this code available under the terms and conditions set
/// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the
/// "Use Terms").   Any redistribution of this code must retain the above
/// copyright and this notice and otherwise comply with the Use Terms.
/**
 * @path ch07/7.8/7.8.3/7.8.3-1-s.js
 * @description Strict Mode - octal extension (010) is forbidden in strict mode
 * @onlyStrict
 */


function testcase() {

        try {
            return eval("var _7_8_3_1 = 010;_7_8_3_1") === 8;
            return false;
        } catch (e) {
            return e instanceof SyntaxError && typeof _7_8_3_1 === "undefined";
        }
    }
runTestCase(testcase);
