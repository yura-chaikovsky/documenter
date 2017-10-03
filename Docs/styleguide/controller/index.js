/**
name: Docs Controller
type: documentation
desc: controller for the styleguide
*/
module.exports = {
	events: {
		'click navLink': '_onItemClick'
	},

	ready: function() {
		var element;

		if (location.hash) {
			element = this.$elements.navLink.filter('[href="' + location.hash + '"]')[0];
			this._load(element.dataset.link);
			element.dispatchEvent(new CustomEvent('showNav', {bubbles: true, cancelable: true}));
		}
	},

	_onItemClick: function(event) {
		this._load(event.target.dataset.link);
	},

	_load: function(link) {
		this.$components.docLoader.show();
		this.$components.docLoader.turnOn();

		this.$tools.data.get(link)
			.then(function(response) {
				this.html(response, this.$elements.componentArea)
					.then(this._onHtmlChange.bind(this));
			}.bind(this));
	},

	_onHtmlChange: function() {
		var scripts = this.$elements.componentArea.find('script');

		scripts.each(function(index, item) {
			window.eval(item.innerHTML);
		});

		window.sgReadyCallback.forEach(function(callback) {
			callback();
		});

		window.sgReadyCallback.length = 0;

		this.$components.docLoader.turnOff();
		this.$components.docLoader.hide();
	}
};
