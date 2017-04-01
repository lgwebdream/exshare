var path = require('path');
var appRoot = path.resolve(__dirname, '../web');
var webpack =require('webpack');
var CommonChunkPlugin=webpack.optimize.CommonsChunkPlugin;
var DefinePlugin=webpack.DefinePlugin;
var UglifyPlugin=webpack.optimize.UglifyJsPlugin;
var HotReplacePlugin=webpack.HotModuleReplacementPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin=require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var env = process.env.NODE_ENV;

module.exports = { 
//   dev环境增加
  devtool: '#source-map',    
  entry: {
    app: './web/main.js'
  },
  output: {
    path: path.resolve(__dirname,'../server/public/dist') , //使用path.resolve转换为绝对路径
    publicPath: '/dist/',
    filename: '[name].js'   
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {    //指定代码中require('xxx')或者其他情况模块的路径映射关系 
      'vue$': 'vue/dist/vue.esm.js',
      'Src': path.resolve(__dirname, '../web'),
      'Assets': path.resolve(__dirname, '../web/assets'),
      'Components': path.resolve(__dirname, '../web/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options:{
          // loaders: {
          //   // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
          //   // the "scss" and "sass" values for the lang attribute to the right configs here.
          //   // other preprocessors should work out of the box, no loader config like this necessary.
          //   'scss': 'vue-style-loader!css-loader!sass-loader',
          //   'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          // }
           loaders: {
            css: ExtractTextPlugin.extract({
              loader: 'css-loader!sass-loader',
              fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
            })
          }
        }
      },
      {
        test:/\.css$/,
        loader:'css-loader',
        options:{
          loaders:{
            css: ExtractTextPlugin.extract({
              loader: 'css-loader'
            })
          }
        }
      },
       {
        test:/\.scss$/,
        loader:'css-loader!sass-loader?sourceMap',
        options:{
          loaders:{
            css: ExtractTextPlugin.extract({
              loader: 'css-loader'
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: appRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader?limit=8192',
        query: {
          limit: 10000,
          name: '../server/public/img/[name].[ext]'   //这里写打包后生成的引用路径以及名字
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '../server/public/fonts/[name].[ext]'
        }
      }
    ]
  },
  //-----------------------------------------------
    // 全部要加的插件  DefinePlugin、 CommonChunkPlugin
    // dev环境增加htmlplugin、ExtractTextPlugin
    // prd环境增加ExtractTextPlugin（带hash）、UglifyPlugin、LoaderOptionsPlugin
  plugins:[
    new ExtractTextPlugin({
      filename:'styles.css',    //生产环境再加hash
      allChunks: true
    })
  ]
}
