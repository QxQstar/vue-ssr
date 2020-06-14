module.exports = function (isDev) {
  return {
    preserveWhitespace:true,
    cssSourceMap:false,
    extractCSS:!isDev
  }
}
