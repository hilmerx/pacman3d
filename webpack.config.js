const path = require('path');

module.exports = {
    entry: './docs/js/App.js',
    output: {
        filename: 'App.js',
        path: path.resolve(__dirname, 'docs/temp/js')
    },
    module: {
    // Special compilation rules
        loaders: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.js$/,
                // Transform it with babel
                loader: 'babel-loader',
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /node_modules/
            }
        ]
    }

}
