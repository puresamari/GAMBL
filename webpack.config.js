const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.tsx",
  devtool: !devMode ? false : "inline-source-map",
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: devMode ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: devMode
    ? undefined
    : {
        runtimeChunk: "single",
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all"
            }
          }
        },
        minimizer: [`...`, new CssMinimizerPlugin()]
      },

  plugins: [
    new HTMLWebpackPlugin({
      template: "src/index.html"
    })
  ].concat(
    devMode
      ? []
      : [
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "chunk-[id].[contenthash].css"
          }),
          new CleanWebpackPlugin()
        ]
  )
};
