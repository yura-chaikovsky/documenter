var gulp = require('gulp');
var template = require('../../plugins/pipe-template');

gulp.task('colors:docs', function() {

	return gulp.src('../Docs/styleguide/_html/colors.html')
		.pipe(template({
			colors: require('../../plugins/colors-usage')(gulp.opts.styleguide.buildDir + 'css/' + gulp.opts.styleguide.mainFileName)
		}))
		.pipe(gulp.dest(gulp.opts.styleguide.buildDir));
});
