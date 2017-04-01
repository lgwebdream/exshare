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
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file

module.exports = {
  target:'web',
  entry: {
    app: [
      './web/main.js'
    ],
    vendor : [   //指定需要单独打包的文件
      'vue'
    ]
  },
  output: {
    path: path.resolve(__dirname,'../server/public/dist') , //使用path.resolve转换为绝对路径
    publicPath: '/dist/',
    filename: '[name].[hash:6].js'   //这里在生产环境下再加hash [name].[hash:6].js
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {    //指定代码中require('xxx')或者其他情况模块的路径映射关系 
      'vue': 'vue/dist/vue.js',
      'src': path.resolve(__dirname, '../web'),
      'assets': path.resolve(__dirname, '../web/assets'),
      'components': path.resolve(__dirname, '../web/components')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options:{
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
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '../server/public/img/[name].[hash:7].[ext]'   //这里写打包后生成的引用路径以及名字
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '../server/public/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins:[
   new HtmlPlugin({  //将打包后的资源引用插入到指定html模版中并生成到dist目录
        title: 'title',
        template: path.resolve(__dirname,'../server/public/tpl/index.html')
    }),
    new ExtractTextPlugin({
      filename:'styles.[hash:6].css',    //生产环境再加hash
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }), 
    new UglifyPlugin({
       mangle: {
        except: ['$', 'exports', 'require']   // 遇到这几个变量不重命名压缩
      },
      compress: { warnings: false }, //去掉console
      output: { comments: false }  //去掉注释
    }),
    new CommonChunkPlugin({
      name:'vendor',
      filename:'vendor.[hash:6].js',  //导出文件的名字
      minChunks:2,    //最小引用数，例如有两个模块都用到了A,那么就把A提取出来。
    //   chunks:[]  //只提取这几个入口文件的公共部分
    }), 
    new webpack.ProvidePlugin({  // 设置某一个模块的导出变量，形成全局变量
        $:'jquery'
    }),
    new CleanWebpackPlugin(['./server/public/dist'], {
      root: 'D:/projects/exShare/', //项目的根路径
      verbose: true,   //是否console
      dry: false,   //
      exclude: []  //不清除的文件或路径
    }),
    new webpack.DefinePlugin({    //定义全局变量，在代码中可以使用它做判断
      '__env': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
