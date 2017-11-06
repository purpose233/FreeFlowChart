module.exports = {
  entry:  __dirname + "/src/index.js",
  output: {
    path: __dirname + "/dist/js",
    filename: "freeFlowChart.js"
  },
  devtool: 'cheap-module-eval-source-map',
  devServer:{
    historyApiFallback:true,
    hot:true,
    inline:true,
    port:8080
  }
}
