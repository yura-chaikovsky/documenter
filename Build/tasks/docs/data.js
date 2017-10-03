const gulp = require('gulp');
const merge = require('merge-stream');
const path = require('path');
const rename = require('gulp-rename');

function stream() {
	var destPath = path.resolve(gulp.opts.styleguide.dest);
	var srcPath = path.resolve(gulp.opts.styleguide.source);

	return gulp.src(srcPath + '/**/[[]docs[]]/*.json')
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest(destPath));
}

gulp.task('docs:data', function() {
	return stream();
});

