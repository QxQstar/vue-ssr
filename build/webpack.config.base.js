const path = require('path')
const createVueLoaderOptions = require('./vue-loader-options')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target:'web',
  entry: path.join(__dirname,'../client/index.js'),
  output:{
    filename: "bundle.[hash:8].js",
    path:path.join(__dirname,'../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          fix: true,
        },
      },
      {
        test:/\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        test:/\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test:/\.(gif|png|jpg|jpeg|svg)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit:1024,
              name:'resource/[path][name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
