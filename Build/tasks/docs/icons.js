const gulp = require('gulp');
const template = require('../../plugins/pipe-template');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const path = require('path');
const glob = require('glob');
const opts = gulp.opts;

function stream() {
    var srcPath = path.resolve(gulp.opts.styleguide.icons.src);
    var destPath = path.resolve(gulp.opts.styleguide.dest);

	return gulp.src(opts.styleguide.icons.tmpl)
		.pipe(
			template({
				icons: glob(srcPath, {sync: true}).map(function(file) {
					var iconName = path.basename(file, '.svg').toLowerCase().replace('_', '-');

					return {name: iconName};
				})
			}))
		.pipe(rename(gulp.opts.styleguide.icons.name))
		.pipe(gulp.dest(destPath));

}

gulp.task('docs:icons', function() {

	return stream();
});

