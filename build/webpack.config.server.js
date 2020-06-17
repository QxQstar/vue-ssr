const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.js')
const webpackMerge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env':{
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }
  }),
]

let config
config = webpackMerge(baseConfig,{
  target: 'node',
  devtool: 'source-map',
  entry:path.join(__dirname,'../client/server-entry.js'),
  output:{
    libraryTarget: 'commonjs2',
    filename:'server-entry.js',
    path: path.join(__dirname, '../server-build')
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
  externals:Object.keys(require('../package.json').dependencies),
  plugins:defaultPlugins.concat(
    new ExtractTextPlugin({
      filename:'[name].[contenthash:8].css'
    }),
    new VueSSRServerPlugin()
  )
})
config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/server-model.js')
  }
}
module.exports = config
