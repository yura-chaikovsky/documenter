var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

function getUrl(value) {
	var reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g;
	var match = reg.exec(value);

	return match[3];
}

function replaceFiles(string, opts) {
	var file = getUrl(string);
	var ext = path.extname(file.split('?')[0])
		.replace('.', '');
	var type = '';

	switch (ext) {
		case 'svg':
			type = 'image/svg+xml';
			break;
		case 'eot':
			type = 'application/vnd.ms-fontobject';
			break;
		case 'ttf':
			type = 'application/octet-stream';
			break;
		case 'woff':
			type = 'application/font-woff';
			break;
		case 'woff2':
			type = 'application/font-woff2';
			break;
		default:
			type = 'image/' + ext;
	}

	return string.replace(file, 'data:' + type + ';base64,' + fs.readFileSync(path.join(opts.root, file.split('?')[0]))
		.toString('base64'));
}

function replaceInline(string, opts) {
	var output = new Buffer(string).toString('base64');

	if (opts.prepend) {
		output = opts.prepend + output;
	}

	return output;
}

module.exports = postcss.plugin('postcss-base64', function(_opts) {
	return function(css) {
		var opts = _opts || {};
		var exts;
		var search;

		if (!opts.root) {
			opts.root = process.cwd();
		}

		if (opts.excludeAtFontFace === undefined) {
			opts.excludeAtFontFace = true;
		}

		if (opts.extensions) {
			exts = '\\' + opts.extensions.join('|\\');
			search = new RegExp('url\\(.*(' + exts + ').*\\)', 'i');

			css.each(function(node) {
				if (
					opts.excludeAtFontFace &&
					node.type === 'atrule' &&
					node.name === 'font-face'
				) {
					// Don't do @font-face rules
					return;
				}

				if (node.replaceValues) {
					node.replaceValues(search, function(string) {
						return replaceFiles(string, opts);
					});
				}
			});
		}

		if (opts.pattern) {
			if (!opts.pattern instanceof RegExp) {
				throw new Error('Given search pattern is not a (valid) regular expression.');
			}

			search = opts.pattern;

			css.replaceValues(search, function(string) {
				return replaceInline(string, opts);
			});
		}
	};
});
