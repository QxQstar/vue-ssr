const Koa = require('koa')

const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx,next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 500
    if(isDev) {
      ctx.body = err
    } else {
      ctx.body = 'try again later'
    }
  }
})

const pageRouter = require('./router/dev.ssr')

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

