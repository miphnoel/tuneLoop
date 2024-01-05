const path = require('path');


module.exports = {
  context: __dirname,
  entry: "./javascript/main.js",
  output: {
    path: path.resolve(__dirname),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js"]
  }
};
