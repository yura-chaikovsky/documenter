const gulp = require('gulp');
const path = require('path');
const template = require('../../plugins/pipe-template');
var opts = gulp.opts;

gulp.task('docs:index', function() {
	return stream();
});

function stream() {
	var groupBy = require('lodash.groupby');
	var tap = require('gulp-tap');
	var rename = require('gulp-rename');
	var gulpDocs = require('../../plugins/gulp-docs');
	var styleguide = gulp.opts.styleguide;
	var source = {
		src: path.resolve(styleguide.source + '/**/{index.js,_index.scss}'),
		dest: path.resolve(styleguide.dest),
		tplsDest: path.resolve(styleguide.dest, styleguide.subpath.tpls)
	};

	return gulp.src(source.src, {})
		.pipe(gulpDocs())
		.pipe(tap(function(file) {
			var components = JSON.parse(file.contents.toString('utf8'));
			// var coverage = docsCoverage(components);
			var groups = [];

			Object.keys(components).forEach(function(name) {
				var fileName = name.toLowerCase().replace(/[^A-Za-z]/g, '_') + '.html';

				gulp.src('../Docs/styleguide/_html/component.html')
					.pipe(template({component: components[name]}))
					.pipe(rename(fileName))
					.pipe(gulp.dest(source.tplsDest));

				groups.push({
					link: path.join(opts.styleguide.subpath.tpls, fileName),
					ref: components[name].ref,
					type: (components[name].type || 'untyped').toLowerCase(),
					name: name
				});
			});

			gulp.src('../Docs/styleguide/_html/index.html')
				.pipe(template({
					tplsPath: opts.styleguide.subpath.tpls,
					groups: groupBy(groups.sort(function(module1, module2) {
						return module1.name.localeCompare(module2.name);
					}), 'type')
				}))
				.pipe(gulp.dest(source.dest));
		}));
}

function docsCoverage(components) {
	return Object.keys(components).map(function(componentDisplayName) {
		var component = components[componentDisplayName];
		var annotated = {};
		var features = {
			js: ['options', 'events', 'subscriptions', 'desc', 'examples'],
			scss: ['desc', 'examples', 'modifiers']
		};

		annotated.name = component.ref;
		annotated.score = Object.keys(features).reduce(function(acc, key) {
			var weight = 100 / Object.keys(features).length / features[key].length;
			var index;

			if (component[key]) {
				for (index = features[key].length - 1; index >= 0; index--) {
					if (component[key][features[key][index]]) {
						acc.push(weight);
					}
				}
			}

			return acc;
		}, []).reduce(function(sum, current) {
			return sum + current;
		}, 0);

		return annotated;
	});
}

