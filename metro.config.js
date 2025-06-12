const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  };
  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, 'mjs'],
    extraNodeModules: {
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@constants': path.resolve(__dirname, 'constants'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  };

  return config;
})();