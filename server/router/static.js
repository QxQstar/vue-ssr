const Router = require('koa-router')
const send = require('koa-send')

const router = new Router()

router.prefix('/public')

router.get('/*',async (ctx) => {
  await send(ctx,ctx.path)
})

module.exports = router
