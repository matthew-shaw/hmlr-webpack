const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  mode: "production",
  devtool: "source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  entry: ["./src/js/main.mjs", "./src/scss/main.scss"],
  output: {
    filename: "hmlr.min.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  bugfixes: true,
                  loose: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "hmlr.min.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets",
          to: "assets",
        },
      ],
    }),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
