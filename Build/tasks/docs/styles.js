const gulp = require('gulp');
const merge = require('merge-stream');
const path = require('path');

function stream() {
    var srcPath = path.resolve(gulp.opts.styleguide.styles);
    var destPath = path.resolve(gulp.opts.styleguide.dest, gulp.opts.styleguide.subpath.css);

	return gulp.src(srcPath)
		.pipe(gulp.dest(destPath));
}

gulp.task('docs:styles', function() {
	return stream();
});

