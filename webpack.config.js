const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.tsx",
  devtool: !devMode ? false : "inline-source-map",
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
      {
        // Not entirely sure if this actually does anything
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: ["ts-loader"]
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
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      crypto: false,
      stream: require.resolve("stream-browserify")
    }
  },
  output: {
    filename: devMode ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true
    }
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
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    }),
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
