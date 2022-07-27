module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: ['plugin:@typescript-eslint/recommended'], // Uses the linting rules from @typescript-eslint/eslint-plugin
  env: {
    node: true, // Enable Node.js global variables
  },
  rules: {
    'array-callback-return': 'error',
    'no-await-in-loop': 'warn',
    'no-constant-binary-expression': 'error',
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'warn',
    'no-unused-private-class-members': 'warn',
    'no-use-before-define': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
