var through = require('through2');
var template = require('lodash.template');

module.exports = function(data) {
	return through.obj(function(file, enc, cb) {
		var tpl = template(file.contents.toString());
		file.contents = new Buffer(tpl(data));
		this.push(file);
		cb();
	});
};
