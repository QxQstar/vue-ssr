module.exports = function (isDev) {
  return {
    preserveWhitespace:true,
    cssSourceMap:false,
    extractCSS:!isDev,
    cssModules:{
      localIdentName: isDev?'[path]-[name]-[hash:base64:5]':'[hash:base64:5]',
      camelCase: true
    }
  }
}
