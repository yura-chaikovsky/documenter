/**
 name: Docs Nav
 type: documentation
 desc: navigation controller for the styleguide
 */
module.exports = {
	events: {
		'search $componentSearch': '_onSearch'
	},

	_onSearch: function(event, term) {
		this.$components.accordions.forEach(function(accordion) {
			accordion.filterContentByValue(term);
		});

	}
};
