/**
 * @file jest.config.js
 * @author afcfzf(9301462@qq.com)
 */

import { JestConfigWithTsJest} from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
};


export default config;
