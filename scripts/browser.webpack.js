import webpack, { WebpackOptionsNormalized } from 'webpack';
import TerserPlugin, { TerserPluginOptions } from 'terser-webpack-plugin';
import info from '../package.json' assert { type: 'json' };

const config: WebpackOptionsNormalized = {
  // Entry point of the application
  entry: './index.js',
  // Enable source maps for better debugging experience
  devtool: 'source-map',
  // Configure module resolution
  resolve: {
    aliasFields: ['browser'],
    alias: {
      ...info.browser,
      // Disable crypto module (not needed in the browser)
      crypto: false,
      // Use readable-stream instead of stream module
      stream: 'readable-stream',
      // Use path-browserify instead of path module
      path: 'path-browserify'
    }
  },
  // Configure output
  output: {
    // Use ECMAScript modules for output
    chunkFormat: 'module',
    // Name of the output file
    filename: 'webtorrent.min.js',
    // Use ECMAScript modules for the library
    library: {
      type: 'module'
    }
  },
  // Enable production mode
  mode: 'production',
  // Build for the browser environment
  target: 'web',
  // Enable output module experimental feature
  experiments: {
    outputModule: true
  },
  // Configure plugins
  plugins: [
    // Provide polyfills for process and Buffer
    new webpack.ProvidePlugin({
      process: '/polyfills/process-fast.js',
      Buffer: ['buffer', 'Buffer']
    }),
    // Define globalThis for better compatibility
    new webpack.DefinePlugin({
      global: 'globalThis'
    })
  ],
  // Configure optimization
  optimization: {
    minimize: true,
    minimizer: [
      // Use TerserPlugin for minification
      new TerserPlugin({
        terserOptions: {
          // Remove comments from output
          format: {
            comments: false
          }
        },
        // Don't extract comments to separate file
        extractComments: false
      } as TerserPluginOptions)
    ]
  }
};

export default config;
