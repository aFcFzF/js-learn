module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@tencent/eslint-config-tencent',
    '@tencent/eslint-config-tencent/ts',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '__test__'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: "class",
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'explicit',
        }
      }
    ],
    "@typescript-eslint/member-ordering": 'error',
    eqeqeq: [2, 'allow-null'],
    'max-len': ['error', {
      code: 200,
    }],
    'no-multi-spaces': 'error',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    'eol-last': ["error", "always"],
  },
};