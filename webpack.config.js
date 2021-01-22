import { resolve as _resolve } from 'path';

export const entry = {
  contextmenu: _resolve(__dirname, 'src', 'contextmenu.ts'),
  options: _resolve(__dirname, 'src', 'options.ts'),
  vendor: ['axios', 'materialize-css']
};
export const output = {
  filename: '[name].js',
  path: _resolve(__dirname, 'dist'),
};
export const module = {
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
};
export const resolve = {
  extensions: [
    '.ts', '.js'
  ]
};
