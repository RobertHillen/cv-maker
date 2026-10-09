const { defineConfig } = require('eslint/config');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig(
  {
    ignores: ['dist/**', 'coverage/**', '.angular/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/no-output-on-prefix': 'warn',
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',
      'no-var': 'warn',
      'prefer-const': 'warn'
    }
  },
  {
    files: ['src/**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/alt-text': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'warn'
    }
  }
);
