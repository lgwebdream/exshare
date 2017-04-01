var router = require('koa-router')();
var fs = require('fs');
router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  };
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./server/public/index.html'); 
})
router.get('pack',async function(ctx,next){
  console.log('url:/pack:')
  var html = ctx.webpack.fileSystem.readFileSync('index.html');
  console.log('---------------->>>>>>>>>>>>>>>',html)
  ctx.body =html;
  
//   const assetsByChunkName = ctx.res.locals.webpackStats.toJson().assetsByChunkName

//   // then use `assetsByChunkName` for server-sider rendering
// 	// For example, if you have only one main chunk:

// 	ctx.res.send(`
// <html>
//   <head>
//     <title>My App</title>
// 		${
// 			assetsByChunkName.main
// 			.filter(path => path.endsWith('.css'))
// 			.map(path => `<link rel="stylesheet" href="${path}" />`)
// 		}
//   </head>
//   <body>
//     <div id="root"></div>
// 		${
// 			assetsByChunkName.main
// 			.filter(path => path.endsWith('.js'))
// 			.map(path => `<script src="${path}" />`)
// 		}
//   </body>
// </html>		
// 	`)
//   await next();

})
router.get('api', async function (ctx, next) {
  //TOTO   koa api提供
  ctx.body = {
    'url': 'http://www.j.com',
    'title':'hey!'
  };
})
module.exports = router;