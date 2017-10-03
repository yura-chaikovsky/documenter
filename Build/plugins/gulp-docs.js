var fs = require('fs');
var path = require('path');
var through = require('through2');

var peg = require('pegjs');
var parsers = {
	js: peg.generate(fs.readFileSync(path.join(__dirname, 'js.pegjs'), 'utf8')),
	scss: peg.generate(fs.readFileSync(path.join(__dirname, 'scss.pegjs'), 'utf8'))
};

var prettify = require('./prettify');

function parseFile(fileToParse) {
	var fileType = path.extname(fileToParse.path).substring(1); //get rid of leading `.`
	var contentToParse = fileToParse.contents.toString('utf8');
	var parsed = parsers[fileType].parse(contentToParse);

	if (!parsed) {
		return null;
	}

	return {
		type: fileType,
		module: prettify.load(parsed, fileToParse.path)
	};
}

module.exports = function() {
	var components = {};
	var component;
	var stream;
	var joined;

	stream = through.obj(function(file, enc, cb) {

		var parsed = parseFile(file);

		if (parsed && parsed.module.name) {
			component = (components[parsed.module.name] ||
							(components[parsed.module.name] = {	type: parsed.module.type,
																name: parsed.module.name,
																ref: parsed.module.ref,
																$id: parsed.module.$id}));
			component[parsed.type] = parsed.module;
		}

		cb();
	}, function(cb) {
		joined = {
			contents: new Buffer(JSON.stringify(components))
		};

		this.push(joined);
		cb();
	});

	return stream;
};
