module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
<<<<<<< HEAD
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
=======
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 0,
<<<<<<< HEAD
    'space-before-function-paren': 0
>>>>>>> login
=======
    'space-before-function-paren': 0,
    'no-var': 0
>>>>>>> user
  }
}
