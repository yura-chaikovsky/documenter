module.exports = {
	'events': {
		'showNav navLink': '_onShow'
	},
	filterContentByValue: function(value) {
		var linkFound = false;
		var normalizedValue = value.toLowerCase();

		this.$elements.navLink.forEach(function(link) {
			if (link.text.toLowerCase().indexOf(normalizedValue) === -1) {
				link.classList.add('js-hidden');
			} else {
				link.classList.remove('js-hidden');
				linkFound = true;
			}
		});

		if (value.length) {
			this.$components[this.$options.groupId].toggle(linkFound);
		}
	},

	_onShow: function() {
		this.$components[this.$options.groupId].show();
	}
};
