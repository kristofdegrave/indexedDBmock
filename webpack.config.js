var path = require("path");
var webpack = require("webpack");
module.exports = {
    cache: true,
    entry: {
        mock: "./src",
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "dist/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    }
};