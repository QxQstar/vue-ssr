const Koa = require('koa')
const staticRouter = require('./router/static')

const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'

app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
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

let pageRouter = ''

if(isDev) {
  pageRouter = require('./router/dev.ssr')
} else {
  pageRouter = require('./router/ssr')
}

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333


app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

