const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('svg');

if (!config.resolver.sourceExts.includes('svg')) {
  config.resolver.sourceExts.push('svg');
}

config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
