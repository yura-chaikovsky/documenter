var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var marked = require('marked');
var highlightjs = require('highlight.js');

marked.setOptions({
	highlight: function(code) {
		return highlightjs.highlightAuto(code).value;
	},
	gfm: true
});

function buildRefPath(filePath) {
	var parts = filePath.split(path.sep);
	var component = [];
	var temp;

	parts.pop();
	temp = parts.pop();
	while (temp) {
		if (temp.charAt(0) === temp.charAt(0).toLowerCase()) {
			component.unshift(temp);
		} else if (temp.charAt(0) === temp.charAt(0).toUpperCase()) {
			return temp + '::' + component.join('/');
		}
		temp = parts.pop();
	}

	return '';
}

function toYamlSafe(str) {
	var commentObj;

	try {
		commentObj = yaml.safeLoad(str.replace(/\t/g, '    '));//yaml does not allow tabs
	} catch (exc) {
		console.log(exc);
		commentObj = {
			desc: str
		};
	}

	return commentObj;
}

function fsExistsSync(myDir) {
	try {
		fs.accessSync(myDir);

		return true;
	} catch (exc) {
		return false;
	}
}

module.exports.load = function(commentRaw, filePath, country) {
	var module = {
		ref: buildRefPath(filePath),
		$id: +new Date,
		decls: []
	};
	var commentObj;

	commentRaw = typeof commentRaw === 'string' ? {exports: commentRaw} : commentRaw;

	Object.keys(commentRaw).forEach(function(key) {
		commentObj = toYamlSafe(commentRaw[key]);

		if (key === 'exports') {
			if (typeof commentObj === 'string') {
				module.desc = commentObj;
			} else {
				Object.keys(commentObj).forEach(function(key2) {
					module[key2] = commentObj[key2];
				});

				if (module.examples && !module.examples.length) {
					module.examples = Object.keys(module.examples).map(function(key) {
						return {
							name: key,
							tmpl: module.examples[key]
						};
					});
				}

				if (module.examples) {
					module.examples.forEach(function(example) {
						var content = 'N/A';
						var testPath;

						if (typeof example.tmpl === 'object' && example.tmpl.include) {
							testPath = path.join(filePath, './../../[docs]', example.tmpl.include);
							try {
								if (!fsExistsSync(testPath)) {
									testPath = testPath.replace('Core', country);
								}
								content = fs.readFileSync(testPath, 'utf8');
							} catch (exc) {
								throw exc;
							}

							example.tmpl = content;
						}
						try {
							if (example.tmpl) {
								example.beautified = highlightjs.highlightAuto(example.tmpl).value;
							}
						} catch (exc) {
							console.log(exc);
						}
					});
				}

				module.desc = marked(module.desc || '');
			}
		} else {
			if (commentObj.args) {
				commentObj.args = Object.keys(commentObj.args).map(function(key) {
					var arg = commentObj.args[key];

					if (typeof commentObj.args[key] === 'string') {
						return {
							name: key,
							desc: marked(arg)
						};
					}

					return arg;
				});
			}
			commentObj.signature = highlightjs.highlightAuto(key).value;
			commentObj.desc = marked(commentObj.desc || '');
			module.decls.push(commentObj);
		}
	});

	return module;
};
