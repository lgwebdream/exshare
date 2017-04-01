const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './web/main.js'
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'app.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: { //指定代码中require('xxx')或者其他情况模块的路径映射关系 
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        loader: 'css-loader!sass-loader',
                        fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                    })
                }
            }
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.css', //生产环境再加hash
            allChunks: true
        })
    ],
};