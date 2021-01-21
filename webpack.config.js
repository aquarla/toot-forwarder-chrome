const path = require('path');

module.exports = {
  entry: {
    contextmenu: path.resolve(__dirname, 'src', 'contextmenu.ts'),
    options: path.resolve(__dirname, 'src', 'options.ts'),
    vendor: ['axios']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
     {
      test: /.ts$/,
      use: 'ts-loader'
     }
    ]
   },
   resolve: {
    extensions: [
     '.ts', '.js'
    ]
   },
}
