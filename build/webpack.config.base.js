const path = require('path')

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
        test:/\.vue$/,
        loader: 'vue-loader'
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
