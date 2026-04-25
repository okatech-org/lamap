const path = require('path');

module.exports = function (api) {
  // Invalidate when this file changes so we pick up alias edits without
  // having to wipe Metro's transform cache by hand.
  api.cache.invalidate(() => __filename);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
            // Workspace package — bare alias points at the convex source
            // directory so subpath imports like `@lamap/convex/_generated/api`
            // and `@lamap/convex/validators` resolve correctly. (If we pointed
            // at a file, module-resolver would concatenate the subpath onto
            // the file path and break.)
            '@lamap/convex': path.resolve(
              __dirname,
              '../../packages/convex/convex',
            ),
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts',
          ],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
