var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = {
  entry: "./app/components/Main.js",
  output: {
    filename: "index_bundle.js",
    path: __dirname + '/dist'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      // TODO: this doesn't work, so loaders in require it is 
      {
        include: /node_modules\/three\/examples\/js\/controls\/.*/,
        loader: 'imports?THREE=three!exports?THREE.OrbitControls'
      }      
    ]
  },
  plugins: [HTMLWebpackPluginConfig]
}
