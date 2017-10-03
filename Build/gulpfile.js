var gulp = require('gulp');
var runSequence = require('run-sequence');


gulp.opts = require('./config.json');

require('require-directory')(module, './tasks');

gulp.task('default', function() {
    runSequence('app:clean', 'app:build');
});
