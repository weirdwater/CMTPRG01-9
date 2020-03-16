const HtmlWebpackPlugin = require('html-webpack-plugin')
const { TypedCssModulesPlugin } = require('typed-css-modules-webpack-plugin');
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/main.tsx'),
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'dies.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    port: 3000
  },
  plugins: [
    new TypedCssModulesPlugin({
      globPattern: 'src/**/*.scss',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/template.html')
    })
  ]
}
