const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactNativePlugin = require('eslint-plugin-react-native');
const prettierPlugin = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                tsconfigRootDir: process.cwd(),
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-native': reactNativePlugin,
            prettier: prettierPlugin,
            import: importPlugin,
            'simple-import-sort': simpleImportSortPlugin,
        },
        rules: {
            'no-empty-function': 'off',
            'react/prop-types': 'off',
            'no-extra-semi': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'simple-import-sort/imports': 'error',
        },
    },
    {
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {},
            },
        },
    },
    {
        ignores: ['node_modules/**/*'],
    },
];
