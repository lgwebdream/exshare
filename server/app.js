const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const cors =require('koa-cors');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const index = require('./routes/index');
// const users = require('./routes/users');
const createDevServer = require('./services/service/setup-dev-server')
const basePath = __dirname;

// middlewares
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(basePath + '/public')));

app.use(views(basePath + '/views', {
  extension: 'jade'
}));
// app.use(views(__dirname + '/views-ejs', {
//   extension: 'ejs'
// }));
app.use(cors())
// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method}  ${ctx.url} - ${ms}ms`);
});

createDevServer(app, t => {
    console.log('dev-server callback')
})

// app.use(async(ctx,next) =>{
// // var fs=ctx.webpack.fileSystem;
// // console.log('///');
//   // var html = ctx.webpack.fileSystem.readdirSync('/dist');
//   // console.log('---------------->>>>>>>>>>>>>>>',html)
//   // ctx.body ='xxxxxxxxxxxxx';

// })


router.use('/', index.routes(), index.allowedMethods());
// router.use('/users', users.routes(), users.allowedMethods());

// app.use(router.routes(), router.allowedMethods());

// response
app.on('error', function(err, ctx){
  console.error('server error',err);
});


module.exports = app;