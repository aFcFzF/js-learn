/**
 * @file preGit.ts
 * @author markJia(markjia@tencent.com)
 */

import path from 'path';
import fs from 'fs';

const messagePath = path.resolve(__dirname, process.argv[2]);
const commitMessage = fs.readFileSync(messagePath, 'utf8');

const isLernaCommit = /^v\d/gim.test(commitMessage);
const conventionalRegex = /^(chore|ci|docs|feat|fix|perf|refactor|style|test)[:|：]/gim;
const conventionalRegexExecResult = conventionalRegex.exec(commitMessage);

function conventionalCommitWarn(): void {
  warn('你的 commit 信息不符合约定式提交规范: https://www.conventionalcommits.org');
  warn('结合项目实际，我们采用约定式提交规范的子集，格式简要描述如下\n');
  warn('<type>: <description> // 第一行');
  warn(''); // blank line
  warn('[optional body]\n');
  warn('type 有如下类型：');
  warn('chore: 构建流程、依赖管理、项目规范等');
  warn('ci: 修改了 ci 配置文件');
  warn('docs: 只改到了文档');
  warn('feat: 加入一个新特性');
  warn('fix: 修复一个 bug');
  warn('perf: 性能优化的修改');
  warn('refactor: 项目代码重构');
  warn('style: 格式修改，如空格、增加分号');
  warn('test: 增加遗漏的测试用例，或更正测试用例\n');
  warn('description 描述主要修改的内容\n');
  warn('body: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等\n');
  warn('约定式提交规范 demo:\n');
  warn('chore: 增加 git commit 规范约束');
  warn('');
  warn('为了更好地追踪代码的引入原因，了解历史背景，本次修改强制 commit 信息遵守约定式提交规范。'
      + '改动简介：使用第三方库 husky 监听 commit-msg hook，在提交时执行项目根目录的 preGit.js 检查提交信息\n');
}

function tapdWarn(): void {
  console.log('');
  warn('请填写本次修改相关的 tapd 链接');
  warn('如果本次修改没有需求单、bug 单、紧急电子流，你在做的事情很可能不符合规范');
  warn('如果你无法填写 tapd 链接，需要找相关人帮你提一个，如产品、测试、技术 owner');
  warn('为了项目达到一个良性循环，请勿试图绕过验证，也不要随意复制一个 tapd 链接');
  warn('如果你这么做，将来的某一天很可能会后悔\n');
  warn('结合约定式提交规范，tapd 链接填写格式如下:\n');
  warn('feat: xxx');
  warn('');
  warn('xxx');
  warn('');
  warn('tapd: http://tapd.oa.com/xxx/xxx/xxx/...\n');
}

function exit(): void {
  process.exit(-1);
}


function warn(message: string): void {
  console.log('\x1b[31m', message, '\x1b[0m');
}

const main = (): void => {
  if (isLernaCommit) {
    return;
  }

  // 约定式提交规范检测
  if (
    conventionalRegexExecResult === null
  || (conventionalRegexExecResult !== null && commitMessage.indexOf(conventionalRegexExecResult[1]) !== 0)
  ) {
    conventionalCommitWarn();
    exit();
  }
};

main();
