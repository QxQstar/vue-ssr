const fs = require('fs');
const Router = require('koa-router')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const serverRenderer = require('./server.render')

const clientManifest = require('./../../public/vue-ssr-client-manifest.json')
const bundle = require('./../../server-build/vue-ssr-server-bundle.json')
const render = serverRenderer(bundle,{
  clientManifest,
  inject:false
})
const template = fs.readFileSync(path.join(__dirname,'../server.template.ejs'),'utf-8')

async function handleSSR(ctx) {
  await (ctx,render,template)
}
const router = new Router()
router.get('*', handleSSR)

module.exports = router
