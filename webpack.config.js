const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    target: 'es5',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        // plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    }
};