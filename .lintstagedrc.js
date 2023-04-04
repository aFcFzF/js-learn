/**
 * @file .lintstagedrc.js
 * @author afcfzf(9301462@qq.com)
 */

const { CLIEngine } = require('eslint');

// 根目录使用 .lintstagedrc.json 会提示已忽略的文件被检查
module.exports = {
  '**/*.{ts,tsx,js,jsx}': (files) => {
      const cli = new CLIEngine();
      const filterByIgnoreFiles = files.filter(file => !cli.isPathIgnored(file)).join(' ');
      return `eslint -c .eslintrc.js --max-warnings 0 ${filterByIgnoreFiles}`;
  }
};
