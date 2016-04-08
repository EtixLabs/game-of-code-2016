'use strict';

const ENV = process.env.npm_lifecycle_event;

let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

let enableNgAnnotate = process.argv.indexOf('--ng-annotate') !== -1;

module.exports = (() => {
    let htmlMinifyConfig = ENV !== 'build' ? false : {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        removeTagWhitespace: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        caseSensitive: true,
        minifyURLs: true
    };

    let externalDependendenciesRegexp = /node_modules\/(?!etix-)/;

    let config = {
        entry: {
            'etix-kru': './src/app/etix-kru.module.js'
        },

        output: {
            path: __dirname + '/dist',
            filename: ENV === 'build' ? '[name].[hash].js' : '[name].js',
        },

        // Sourcemaps: Disabled in build, inline in tests and regular in dev
        devtool: (
            ENV === 'build' ? 'hidden' :
            (ENV === 'test' ? 'inline-source-map' :
            (enableNgAnnotate ? 'source-map' :
            'eval-source-map'))
        ),

        module: {

            preLoaders: [],

            loaders: [{
                // Javascript loader: Use babel to transpile ES6
                test: /\.js$/,
                loader: 'babel',
                exclude: externalDependendenciesRegexp
            }, {
                // Assets loader: import images and fonts as external resources
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                // Use an absolute path for assets, because they can be references from
                // different places (templates, css, ...)
                loader: 'file?name=assets/[hash].[ext]',
            }, {
                // Html template loader: Import templates as external files
                test: /\.html$/,
                // Minify in build mode only
                loader: 'file?name=templates/[hash].[ext]' + (ENV === 'build' ? '!html-minify' : ''),
                // Ignore index.html
                exclude: /\/src\/index\.html/
            }, {
                // Styles loader: Process SASS files with sass-loader
                // (cf: plugins section)
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap'),
                // Do not process external dependencies
                exclude: externalDependendenciesRegexp
            }, {
                // CSS Loader for external dependencies
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css'),
                include: externalDependendenciesRegexp
            },
            // Add specific loaders to force jquery to be exposed before Angular is loaded
            // in order to prevent jqLite to be loaded
            // cf: https://github.com/webpack/webpack/issues/582
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery'
            }, {
                test: require.resolve('angular'),
                loader: 'imports?jquery'
            }]
        },

        plugins: [
            // Generate the index.html file for the bundle
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                minify: htmlMinifyConfig
            }),

            // Configure css extract
            new ExtractTextPlugin('[name].[hash].css')
        ],

        // Configure webpack-dev-server
        devServer: {
            contentBase: './dist',
            historyApiFallback: true,
            inline: true,
            stats: {
                assets: false,
                colors: true,
                chunkModules: false
            }
        },

        // Add node_modules folder to resolve path to allow modules to be retrieved from npm-linked packages
        // https://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-don-t-find-their-dependencies
        resolve: { fallback: __dirname + '/node_modules' },
        resolveLoader: { fallback: __dirname + '/node_modules' }
    };

    // Use `isparta-instrumenter` for test coverage generation
    if (ENV === 'test') {
        config.module.preLoaders.push({
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.spec\.js$/,
                /tests-index.js/
            ],
            // Include only files from current directory
            // (because some npm-linked dependencies may not be excluded by the /node_modules/ test)
            include: __dirname,
            loader: 'isparta-instrumenter'
        });
    }

    if (enableNgAnnotate || ENV === 'build') {
        config.plugins.push(
            // Use ngAnnotate to automatically generate angular explict DI ($inject)
            new NgAnnotatePlugin()
        );
    }

    // Add build optimisation plugins
    if (ENV === 'build') {
        config.plugins.push(
            // Optimisation plugins
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    return config;
})();
