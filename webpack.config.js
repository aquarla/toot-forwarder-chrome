// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  entry: {
    contextmenu: path.resolve(__dirname, 'src', 'contextmenu.ts'),
    options: path.resolve(__dirname, 'src', 'options.ts'),
    background: path.resolve(__dirname, 'src', 'background.ts'),
    vendor: ['axios', 'materialize-css']
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
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
};
