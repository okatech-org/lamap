const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@convex': path.resolve(__dirname, 'convex'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Ensure Metro can resolve these paths
config.watchFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'convex'),
  path.resolve(__dirname, 'assets'),
];

module.exports = config;
