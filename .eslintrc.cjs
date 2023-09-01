const typescriptExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'prettier'
];

const typescriptPlugins = ['eslint-plugin-tsdoc'];

const tsdocRules = {
  'tsdoc/syntax': 'warn'
};

const config = {};
const overrides = [];

overrides.push({
  extends: typescriptExtends,
  files: ['./**/!(*.test|*.spec).{ts,tsx}'],
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  }
});

overrides.push({
  extends: typescriptExtends,
  files: ['./**/*.+(test|spec).{ts,tsx}'],
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  }
});

config.env = {
  es6: true,
  node: true
};
config.extends = ['eslint:recommended', 'prettier'];
config.overrides = overrides;
config.parserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module'
};
config.root = true;

module.exports = config;
