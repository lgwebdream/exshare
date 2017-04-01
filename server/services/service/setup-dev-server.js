const webpack = require('webpack');
const path = require('path');
const packConfig = require('../../../configs/pack.base.js');
const convert = require('koa-convert')
import devHotMidware from './webpack-midware';
// var hotMiddlewareScript = 'webpack-hot-middleware/client';
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&timeout=20000';
module.exports = function setupDevServer(app, onupdate) {
    packConfig.entry.app = ['eventsource-polyfill', hotMiddlewareScript, packConfig.entry.app];
    // packConfig.entry.vendor.push('eventsource-polyfill', hotMiddlewareScript);
    packConfig.output.filename = '[name].js';
    packConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )

    let compiler = webpack(packConfig);

          
    let devOption = {
            publicPath: '/',
            noInfo: false,
            stats: {
                colors: true,
                chunks: false
            }
        },
        hotOption = {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 5 * 1000
        };
    
    let Middleware = devHotMidware(compiler, {
        dev: devOption,
        hot: hotOption
    })

    app.use(Middleware);

    compiler.plugin('done',()=>{
        console.log('compiler completed!')
        Middleware.hot.publish({ action: 'reload' })
    })  
}