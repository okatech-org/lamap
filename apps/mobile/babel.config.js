module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Path aliases are resolved by Metro. Keeping them out of Babel avoids
    // embedding an absolute EAS temporary directory in cached transforms.
    plugins: ["react-native-reanimated/plugin"],
  };
};
