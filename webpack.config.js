const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  context:path.resolve(__dirname,'src'),
  mode:'development',
  entry:{
    index:'./index.js',
    card_page:'./card_page.js',

  },
  output:{
    filename:'[name].[contentHash].js',
    // filename:'bundle.js',
    path:path.resolve(__dirname,'dist')
  },
  plugins:[
    new HTMLWebpackPlugin(
      {
        template:'./index.html'
      }
    ),
    new CleanWebpackPlugin()
  ],
  module:{
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    writeToDisk: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
}
