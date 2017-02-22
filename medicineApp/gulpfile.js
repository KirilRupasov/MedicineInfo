/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/

// node module imports
var gulp = require('gulp'),
    webpack = require('webpack');


var IONIC_DIR = "node_modules/ionic-framework/"

var Dgeni = require('dgeni');

gulp.task('dgeni', function() {
    // Notice how we are specifying which config to use
    // This will import the index.js from the /docs/config folder and will use that
    // configuration file while generating the documentation
    var dgeni = new Dgeni([require('./docs/config')]);

    // Using the dgeni.generate() method
    return dgeni.generate();
});