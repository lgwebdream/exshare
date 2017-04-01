/*
  基于koa2的dev和hot 中间件
*/
import webpack from 'webpack';
import expressDevMidware from 'webpack-dev-middleware';
import expressHotMidware from 'webpack-hot-middleware';
import {
    PassThrough
} from 'stream';
import compose from 'koa-compose';


/*
 koa proxy for webpack-dev-middleware
*/
function koaDevMidware(dev, options) {

    function waitMidware() {
        return new Promise((resolve, reject) => {
            dev.waitUntilValid(() => {
                resolve(true);
            })
            compiler.plugin('failed', (err) => {
                reject(err);
            })
        })
    }
    return async(ctx, next) => {
        //阻塞程序，直到webpack build完成才继续下一步
        await waitMidware();
        //webpack-dev-midware执行完成回调
        await dev(ctx.req, {
            end: (content) => {
                ctx.body = content;
            },
            setHeader: ctx.set.bind(ctx),
            locals: ctx.state
        }, next)

        // await dev(ctx.req,ctx.res,next)
    }
}

/*
  koa proxy for webpack-hot-middleware
*/
function koaHotMidware(hot, options) {

    return async(ctx, next) => {

        let stream = new PassThrough();
        await hot(ctx.req, {
            write: stream.write.bind(stream),
            writeHead: (status, headers) => {
                ctx.body = stream;
                ctx.status = status;
                ctx.set(headers);
            },
        }, next)
        // await hot(ctx.req, ctx.res, next)
    }
}

export default function devHotMidware(compiler, options) {

    let defaultOpts = {
        dev: {},
        hot: {}
    };

    options = Object.assign(defaultOpts, options);

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

    console.log('DEV:::', dev)
    console.log('HOT:::', hot)
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