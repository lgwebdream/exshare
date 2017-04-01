/*
  基于koa2的dev和hot 中间件
*/
import webpack from 'webpack';
import expressDevMidware from 'webpack-dev-middleware';
import expressHotMidware from 'webpack-hot-middleware';
import {PassThrough} from 'stream';
import compose from 'koa-compose';


/*
 koa proxy for webpack-dev-middleware
*/
function koaDevMidware(dev, options) {

    function waitMidware() {
        return new Promise((resolve, reject) => {
            dev.waitUntilValid(() => {
                console.log('|||||||||||||----1')
                resolve(true);
            })
            compiler.plugin('failed', (err) => {
                console.log('|||||||||||||----2')
                reject(err);
            })
        })
    }
    return async(ctx, next) => {
        //阻塞程序，直到webpack build完成才继续下一步
        console.log('|||||||||||||----3')
        await waitMidware();
        //webpack-dev-midware执行完成回调
        console.log('|||||||||||||----4')
        await dev(ctx.req, {
            end(content) {
                // 设置koa的返回body
                console.log('|||||||||||||----5')
                ctx.body = content;
                console.log('|||||||||||||----6')
            },
            setHeader:ctx.set.bind(ctx),
            locals: ctx.state
        }, next)
    }
}

/*
  koa proxy for webpack-hot-middleware
*/
function koaHotMidware(hot, options) {

    return async(ctx, next) => {

        let stream = new PassThrough();
        console.log('|||||||||||||----7')
        await hot(ctx.req, {
            write: stream.write.bind(stream),
            writeHead: (status, headers) => {
                console.log('|||||||||||||----8')
                ctx.status = status;
                ctx.set(headers);
                ctx.body = stream;
                console.log('|||||||||||||----9')
            },
        }, next)
    }
}

export default function devHotMidware(compiler,options) {

    let defaultOpts = {
        dev: {},
        hot: {}
    };

    options =Object.assign(defaultOpts,options);

    if (!compiler) {
            throw new Error('devHotMidware: compiler must be set on `dev` options');
    }
    // 如果传入的dev 配置中没有publicPath 就从webpack.config.js文件中获取
    if (!options.dev.publicPath) {
        let publicPath = compiler.options.output.publicPath;

        if (!publicPath) {
            throw new Error('koa-webpack: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.');
        }

        options.dev.publicPath = publicPath;
    }

    const dev = expressDevMidware(compiler, options.dev);
    const hot = expressHotMidware(compiler, options.hot);
    //合并middleware
    const middleware = compose([
        koaDevMidware(dev, compiler),
        koaHotMidware(dev, compiler)
    ])
    //将weback-dev(hot)-middleware的实例挂载
    return Object.assign(middleware, {
        dev,
        hot
    })

}