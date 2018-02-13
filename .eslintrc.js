module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  rules: {
    "ember/avoid-leaking-state-in-ember-objects": "off",
    "ember/no-global-jquery": "off" //temporary fix for: https://github.com/ember-cli/eslint-plugin-ember/issues/222
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
  },
  overrides: [
    // node files
    {
      files: [
        'index.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'app/**',
        'addon/**',
        'tests/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }

    // test files
    // {
    //   files: ['tests/**/*.js'],
    //   excludedFiles: ['tests/dummy/**/*.js'],
    //   env: {
    //     embertest: true
    //   }
    // }
  ]
};
