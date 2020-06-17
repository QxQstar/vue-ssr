const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')
const webpackMerge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env':{
      NODE_ENV:isDev ? '"development"' : '"production"'
    }
  }),
  new htmlWebpackPlugin(
    {
      template:path.join(__dirname,'template.html')
    }
  ),
  new VueSSRClientPlugin()
]

let config
const devServer = {
  port: 8000,
  host: "0.0.0.0",
  hot: true,
  overlay: {
    warnings: true,
    errors: true
  },
  historyApiFallback: {
    index: '/public/index.html'
  },
}
if(isDev) {
  config = webpackMerge(baseConfig,{
    devtool: '#cheap-eval-source-map',
    module:{
      rules:[
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: "postcss-loader",
              options: {
                sourceMap:true
              }
            },
            'stylus-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: "postcss-loader",
              options: {
                sourceMap:true
              }
            },
            'less-loader'
          ]
        }
      ]
    },
    devServer,
    plugins:defaultPlugins.concat(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  })
} else {
  config = webpackMerge(baseConfig,{
    entry:{
      main:path.join(__dirname,'../client/index.js'),
      vendor:['vue']
    },
    output:{
      filename:'[name].[chunkhash:8].js'
    },
    module:{
      rules:[
        // 将 css 提取到单独的文件中
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:[
              'css-loader',
              {
                loader: "postcss-loader",
                options: {
                  sourceMap:true
                }
              },
              'stylus-loader'
            ]
          })
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:[
              'css-loader',
              {
                loader: "postcss-loader",
                options: {
                  sourceMap:true
                }
              },
              'less-loader'
            ]
          })
        }
      ]
    },
    plugins:defaultPlugins.concat(
      new ExtractTextPlugin({
        filename:'[name].[contenthash:8].css'
      }),
      // 提取第三方库 chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor"
      }),
      // 将 webpack 相关的部分打包到单独的文件中
      new webpack.optimize.CommonsChunkPlugin({
        name: "runtime"
      })
    )
  })
}

config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/client-model.js')
  }
}
module.exports = config
