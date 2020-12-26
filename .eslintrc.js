module.exports = {
  env: {
    // commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  globals: {
    __DEV__: true,
    __VERSION__: true
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-tsdoc',
    'prettier',
    'standard'
  ],
  extends: ['prettier/standard', 'prettier/@typescript-eslint', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // project: './tsconfig.eslint.json',
    sourceType: 'module'
  },
  rules: {
    'tsdoc/syntax': 'warn',
    'no-unused-vars': 'off',
    'generator-star-spacing': ['error', { before: false, after: true }],
    'space-before-function-paren': 'off',
    'no-dupe-class-members': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'prettier/prettier': ['error'],
    'lines-between-class-members': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public'
      }
    ],
    '@typescript-eslint/no-non-null-assertion': [true],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-unused-vars': ['off']
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ]
}
