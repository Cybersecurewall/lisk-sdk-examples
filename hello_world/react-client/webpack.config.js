const HtmlWebPackPlugin = require('html-webpack-plugin');
/*const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');*/
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ]
  },
  node: {
    global: true,
    bigint: true,
    fs: 'empty'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  // Generates an `index.html` file with the <script> injected.
/*  new HtmlWebpackPlugin(
      Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
      )),*/
/*    new AntdDayjsWebpackPlugin(),
    new SourceMapDevToolPlugin({
      filename: '[name].js.map',
    })*/
],
};
