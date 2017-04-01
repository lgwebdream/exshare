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
  target:'web',
  devtool: '#eval-source-map',
  entry: {
    app: './web/main.js'
    
    // ,
    // vendor : [   //指定需要单独打包的文件
    //   'vue'
    // ]
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
      'src': path.resolve(__dirname, '../web'),
      'assets': path.resolve(__dirname, '../web/assets'),
      'components': path.resolve(__dirname, '../web/components')
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
  devServer: {
    // contentBase:'./server/public/dist',
    host:'localhost',
    port:8888,
		historyApiFallback: true,
    // hot: true,
    noInfo:true,
		inline: true,
		stats: { colors: true },
		proxy: {
			///list/column  --> http://10.2.130.20:9000/column
	        '/api': {
	          target: 'http://localhost:3000',
	          pathRewrite: {'^/api' : '/api'},
	          // changeOrigin: true
	        },
    }
	},
  plugins:[
    new HtmlPlugin({
        title: 'title',
        inject:true,
        template: path.resolve(__dirname,'../server/public/tpl/index.html'),
    }),
    new ExtractTextPlugin({
      filename:'styles.css',    //生产环境再加hash
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new UglifyPlugin({
      compress: {
        warnings: false
      },
     sourceMap:true
    })
    // ,
    // new CommonChunkPlugin({
    //   name:'vendor',
    //   filename:'vendor.js'  //导出文件的名字
    // })
  ]
}
