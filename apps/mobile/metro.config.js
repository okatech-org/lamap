const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo so Metro picks up changes in
//    packages/convex/** and any future packages/* / apps/* shared code.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both the app's own node_modules and the
//    workspace root, so hoisted deps work.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Local path aliases (mirrors babel.config.js + tsconfig paths).
//    `@lamap/convex` resolves to the convex source DIRECTORY so subpath
//    imports work (`@lamap/convex/_generated/api`, `@lamap/convex/validators`,
//    etc.). Pointing it at a file would cause the resolver to concatenate
//    subpaths onto the file path and break.
config.resolver.extraNodeModules = {
  '@': path.resolve(projectRoot, 'src'),
  '@assets': path.resolve(projectRoot, 'assets'),
  '@lamap/convex': path.resolve(workspaceRoot, 'packages/convex/convex'),
};

module.exports = config;
