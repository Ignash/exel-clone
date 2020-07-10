const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

const filname = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`
module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filname('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devServer: {
    port: 3000,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html'
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new MiniCssExtractPlugin({
      filename: filname('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
