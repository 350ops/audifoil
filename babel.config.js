module.exports = function (api) {
  const isWeb = api.caller((caller) => caller && caller.platform === 'web');
  api.cache.using(() => String(isWeb));
  return {
    presets: [
      'nativewind/babel',
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      ...(!isWeb ? ['react-native-worklets/plugin'] : []),
    ],
  };
};
