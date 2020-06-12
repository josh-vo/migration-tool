const path = require('path');

const appName = 'migration-tool';
module.exports = env => {
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    target: "node",
    resolve: {
      extensions: ['.ts', '.js']
    },
    watch: env.production === 'true' ? false : true,
    devtool: env.production === 'true' ? '' : 'eval-source-map',
    output: {
      filename: appName + '.min.js',
      path: path.resolve('./build'),
      library: appName,
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    optimization: {
      usedExports: true
    }
  };
};
