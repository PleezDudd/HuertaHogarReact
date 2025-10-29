module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "webpack"],
        files: [
            { pattern: "mi-app/primer-react/src/test/**/*.spec.@(js|jsx)", watched: false }
        ],
        preprocessors: {
            "mi-app/primer-react/src/test/**/*.spec.@(js|jsx)": ["webpack"]
        },
        webpack: {
            mode: "development",
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader"
                        }
                    },
                    {
                        test: /\.css$/,
                        use: ["style-loader", "css-loader"]
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: ["file-loader"]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot)$/i,
                        type: "asset/resource"
                    }
                ]
            },
            resolve: {
                extensions: [".js", ".jsx"]
            }


        },
        browsers: ["ChromeHeadless"],
        singleRun: true
    });
};
