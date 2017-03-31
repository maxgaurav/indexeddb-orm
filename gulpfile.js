const elixir = require('laravel-elixir');

require('laravel-elixir-webpack-official');
let replace = require('laravel-elixir-replace');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application as well as publishing vendor resources.
 |
 */

Elixir.webpack.mergeConfig({
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader?presets[]=es2015'
            }
        ]
    }
});

elixir((mix) => {
    mix.scripts(['./src/builder.js', './src/worker-model-handler.js', './src/model.js', './src/migration.js', './src/db.js', './src/idb.js'], './build/idb.js');
    mix.scripts(['./src/db.js', './src/builder.js', './src/model.js', './src/migration.js', './src/worker.js'], './build/worker.js');
    // mix.webpack('./build/idb.js', './build/idb.js');

    mix.replace('./build/worker.js', [
        ["importScripts('db.js', 'builder.js', 'model.js', 'migration.js');", '']
    ]);

    mix.webpack('./build/idb.js', './build/idb.js');
    mix.webpack('./build/worker.js', './build/worker.js');

});