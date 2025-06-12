const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['expo-router']
      }
    },
    argv
  );

  // Customize the config before returning it.
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname),
    '@components': path.resolve(__dirname, 'components'),
    '@constants': path.resolve(__dirname, 'constants'),
    '@assets': path.resolve(__dirname, 'assets'),
  };

  return config;
};