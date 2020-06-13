const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'

 const config = {
  target:'web',
  entry: path.join(__dirname,'src/index.js'),
  output:{
    filename: "bundle.[hash:8].js",
    path:path.join(__dirname,'dist')
  },
  module: {
    rules: [
      {
        test:/\.vue$/,
        loader: 'vue-loader'
      },
      {
        test:/\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test:/\.(gif|png|jpg|jpeg|svg)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit:1024,
              name:'[name].[ext]'
            }
          }
        ]
      }
    ]
  },
   plugins: [
     new webpack.DefinePlugin({
       'process.env':{
         NODE_ENV:isDev ? '"development"' : '"production"'
       }
     }),
     new htmlWebpackPlugin()
   ]
 }

if(isDev) {
  config.module.rules.push(
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
  )
  config.devtool = '#cheap-eval-source-map'
  config.devServer = {
    port: 8000,
    host: "0.0.0.0",
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.output.filename = '[name].[chunkhash:8].js'
  config.entry = {
    main:path.join(__dirname,'src/index.js'),
    vendor:['vue']
  }
  // 将 css 提取到单独的文件中
  config.module.rules.push(
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
  )
  config.plugins.push(
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
}

module.exports = config
