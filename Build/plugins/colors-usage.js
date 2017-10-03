var fs = require('fs');
var cssParser = require('css');

module.exports = function (pathToCssFile) {
	var cssSource,
		ast,
		rule,
		declaration,
		matches,
		color,
		collection = {};

	if(!fs.existsSync(pathToCssFile)){
		throw new Error('File main.css not found.');
	}

	cssSource = fs.readFileSync(pathToCssFile, 'utf8');

	ast = cssParser.parse(cssSource, {
		'source': pathToCssFile,
		'silent': true,
		'inputSourcemaps': true
	});

	for (var i = ast.stylesheet.rules.length - 1; i >= 0; i--) {
		rule = ast.stylesheet.rules[i];
		if (rule.type != 'rule') {
			continue;
		}

		if (!rule.declarations) {
			continue;
		}

		for (var j = rule.declarations.length - 1; j >= 0; j--) {
			declaration = rule.declarations[j];
			if (declaration.type != 'declaration') {
				continue;
			}

			if (matches = declaration.value.match(/#[0-9a-fA-F]{3,6}|rgba?\((\d+,?\s*)+\)/g)) {
				for (var k = matches.length - 1; k >= 0; k--) {
					color = matches[k];
					if (typeof collection[color] == 'undefined') {
						collection[color] = [];
					}
					collection[color].push({
						'color': color,
						'property': declaration.property,
						'value': declaration.value,
						'selectors': rule.selectors
					});

				}
			}

		}

	}

	return orderColor(collection);
};

function orderColor(collection){
	var colorsArray = [];

	var hexToRgb = function hexToRgb(hex) {
		var result;

		hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});
		result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		] : [0, 0, 0];
	};

	var rgbToHsl = function (rgb) {
		var r = rgb[0],
			g = rgb[1],
			b = rgb[2];
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return {h:h, s:s, l:l};
	};

	for(var color in collection){
		var hslColor = rgbToHsl(hexToRgb(color));
		colorsArray.push({
			'distance' : hslColor.l + 2 *hslColor.h + hslColor.s,
			'color' : color,
			'rules' : collection[color]
		});
	}

	colorsArray.sort(function(a ,b){
		return a.distance - b.distance;
	});

	return colorsArray;
}
