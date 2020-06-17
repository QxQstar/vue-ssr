const webpack = require('webpack')
const MemoryFS = require("memory-fs");
const fs = require('fs');
const Router = require('koa-router')
const path = require('path')
const axios = require('axios')
const { createBundleRenderer } = require('vue-server-renderer')
const serverRenderer = require('./server.render')
// 问题一：使用哪一个 webpack 配置。答：使用服务器的配置。

const webpackConfig = require('../../build/webpack.config.server.js')
const memoryFS = new MemoryFS();

const compiler = webpack(webpackConfig)
compiler.outputFileSystem = memoryFS

let bundle
compiler.watch({},(err,stats) => {
  if(err) throw err
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  const bundlePath = path.join(webpackConfig.output.path,'vue-ssr-server-bundle.json')
  // 问题二：bundle 创建之后是用来干嘛的。答：bundle 是服务器输出的 JSON 文件，需要将 bundle 作为参数传给 createBundleRenderer
  bundle = JSON.parse(memoryFS.readFileSync(bundlePath,'utf-8'))
  console.log('new bundle is created')

})
// 问题三：await 要要放在 async 函数中，async 函数在哪儿创建并调用。答：放在 handleSSR 中，handleSSR 在 router 中调用，在每次用户访问页面时都会调用 handleSSR
const handleSSR = async (ctx) => {
  if(bundle) {
    const clientManifestRes = await axios.get('http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'),
      clientManifest = clientManifestRes.data
    const renderer = createBundleRenderer(bundle, {
      inject:false,
      clientManifest
    })
    const template = fs.readFileSync(path.join(__dirname,'../server.template.ejs'),'utf-8')
    // 根据 template 和 renderer 渲染出 html，然后将 html 返回给浏览器
    await serverRenderer(ctx,renderer,template)
  } else {
    ctx.body = '稍等一会儿'
  }
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router

