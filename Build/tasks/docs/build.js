var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var opts = gulp.opts;

gulp.task('docs', function(done) {
	runSequence('docs-build', 'docs:serve', done);
});

gulp.task('docs-build', function(done) {
	runSequence('docs:clean',
		['docs:styles','docs:scripts', 'docs:data', 'docs:icons'],
		'docs:index',
		done);
});
