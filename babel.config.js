const { readFileSync } = require('fs');
const { resolve } = require('path');

const TSCONFIG_PATH = resolve(__dirname, './tsconfig.json');

const tsPathToBabelModuleResolverAlias = tsconfigPath => {
    const tsconfig = loadJson(tsconfigPath);
    const { baseUrl, paths } = tsconfig.compilerOptions;
    const aliases = Object.entries(paths).reduce((acc, [key, value]) => {
        const aliasKey = `^${key.replace('/*', '/(.+)')}`;
        const aliasValue = resolve(baseUrl, value[0].replace('/*', '/\\1'));
        acc[aliasKey] = aliasValue;
        return acc;
    }, {});

    return aliases;
};

const loadJson = path => {
    const json = readFileSync(path, 'utf-8');
    const stripedComments = stripJsonComments(json);
    const parsed = JSON.parse(stripedComments);

    return parsed;
};

const stripJsonComments = data => {
    return data
        .replace(/\/\/(.*)/g, '') // remove inline comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // remove block comments
};

module.exports = {
    presets: ['module:@react-native/babel-preset'],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                extensions: ['.ios.js', '.android.js', '.js', '.json', '.ts', '.tsx'],
                alias: tsPathToBabelModuleResolverAlias(TSCONFIG_PATH),
            },
        ],
    ],
};
