const ejs = require('ejs')

module.exports = async function (ctx,renderer,template) {
  ctx.headers['Content-Type'] = 'text/html'
  const context = {
    url:ctx.path
  }
  try {
    const appString = await renderer.renderToString(context)
    const {title} = context.meta.inject()
    ctx.body =  ejs.render(template,{
      appString,
      style:context.renderStyles(),
      scripts:context.renderScripts(),
      title:title.text()
    })
  } catch (e) {
    console.log('renderer error:'+e)
  }
}
