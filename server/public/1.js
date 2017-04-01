var path = require('path');
var appRoot = path.resolve(__dirname, '../web');
var webpack =require('webpack');
var CommonChunkPlugin=webpack.optimize.CommonsChunkPlugin;
var DefinePlugin=webpack.DefinePlugin;
var UglifyPlugin=webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin=require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var env = process.env.NODE_ENV;
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file


module.exports = {
  entry: {
    app: './web/main.js',
    vendor : [   //指定需要单独打包的文件
      'vue'
    ]
  },
  output: {
    path: './server/public/dist',
    publicPath: 'http://0.0.0.0:9000/dist/',
    filename: '[name].[hash:6].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {    //指定代码中require('xxx')或者其他情况模块的路径映射关系 
      'src': path.resolve(__dirname, '../web'),
      'assets': path.resolve(__dirname, '../web/assets'),
      'components': path.resolve(__dirname, '../web/components')
    }
  },
  resolveLoader: {
    
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
        options:{
           loaders: {
             //webpack 1的写法
              css: ExtractTextPlugin.extract("css"),    //提取css，然后交由plugin统一处理
              // you can also include <style lang="less"> or other langauges
              sass: ExtractTextPlugin.extract("css!sass")  //编译sass并提取css ，然后交由plugin统一处理
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: appRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '../server/public/img/[name].[hash:7].[ext]'   //这里写打包后生成的引用路径以及名字
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '../server/public/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('styles.[hash:6].css'),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new UglifyPlugin({
      compress: {
        warnings: false
      }
    }),
    new CommonChunkPlugin({
      name:'vendor',
      filename:'vendor.js'  //导出文件的名字
    }),
    new CleanWebpackPlugin(['./server/public/dist'], {
      root: 'D:/projects/exShare/', //项目的根路径
      verbose: true,   //是否console
      dry: false,   //
      exclude: []  //不清除的文件或路径
    })
  ]
}
