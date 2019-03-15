const path = require("path")

const BUILD_PATH = path.resolve(__dirname, "build")

module.exports = {
  entry: {
    content: "./src/content/content.ts",
    background: "./src/background/background.ts",
  },
  output: {
    filename: "[name].js",
    path: BUILD_PATH,
  },
  resolve: {
    extensions: [".js", ".ts"],
    modules: [
      path.resolve("content"),
      path.resolve("background"),
      path.resolve("node_modules"),
      path.resolve("src"),
    ],
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: ["env", "react", "stage-3"],
            plugins: ["transform-class-properties"],
          },
        }],
      },
    ],
  },
}
