module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [
      { pattern: "mi-app/primer-react/src/test/**/*.spec.@(js|jsx)", watched: false },
      { pattern: "mi-app/primer-react/src/test/setupTests.js", watched: false }
    ],
    preprocessors: {
      "mi-app/primer-react/src/test/**/*.spec.@(js|jsx)": ["webpack", "sourcemap"],
      "mi-app/primer-react/src/test/setupTests.js": ["webpack", "sourcemap"]
    },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: { loader: "babel-loader" }
          },
          { test: /\.css$/, use: ["style-loader", "css-loader"] },
          { test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot)$/i, type: "asset/resource" }
        ]
      },
      resolve: { extensions: [".js", ".jsx"] }
    },
    browsers: ["ChromeHeadless"],
    reporters: ["progress"],
    singleRun: true,
    plugins: [
      require("karma-webpack"),
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-sourcemap-loader")
    ]
  });
};
