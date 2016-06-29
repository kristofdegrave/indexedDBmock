var path = require("path");
var webpack = require("webpack");
module.exports = {
    cache: true,
    entry: {
        indexedDBmock: "./src/mock"
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "dist/",
        filename: "[name].js",
        sourceMapFilename: "[name].js.map",
        library: "mock",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: ['.js'],
        root: './src'
    }
};