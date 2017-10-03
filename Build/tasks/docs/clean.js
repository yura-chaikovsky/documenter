var gulp = require('gulp');
var del = require('del');
var path = require('path');

gulp.task('docs:clean', function() {
	return del([path.resolve(gulp.opts.styleguide.dest)], {force: true});
});
