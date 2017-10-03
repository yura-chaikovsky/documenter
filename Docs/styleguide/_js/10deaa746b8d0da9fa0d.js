webpackJsonp([14],{

/***/ 423:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Element = __webpack_require__(348);

	var BaseFlowPresenter = module.exports = function(component) {
		this.component = component;
	};

	BaseFlowPresenter.prototype.unfold = function(nextState, withPayload) {
		var dfd = this.component.$tools.q.defer();

		if (nextState.statik) {
			if (nextState.statikRemovable) {
				this._initPlaceholder(nextState, withPayload);
			}

			return;
		}

		this._loadContent(nextState, withPayload)
			.then((function(data) {
				this.component.$tools.q.when(this._showInAWay(nextState.placeholder))
					.then(dfd.resolve.bind(dfd, data), dfd.reject.bind(dfd));
			}).bind(this), dfd.reject.bind(dfd));

		return dfd.promise(); // eslint-disable-line consistent-return
	};

	BaseFlowPresenter.prototype.fold = function(thisState) {
		var dfd = this.component.$tools.q.defer();

		if (thisState.statik && !thisState.statikRemovable) {
			return;
		}

		this.component.$tools.q.when(this._hideInAWay(thisState.placeholder))
			.then(dfd.resolve.bind(dfd), dfd.reject.bind(dfd));

		return dfd.promise(); // eslint-disable-line consistent-return
	};

	BaseFlowPresenter.prototype.find = function(selector) {
		return this.component.$el.find(selector);
	};

	BaseFlowPresenter.prototype._loadContent = function(forNextState, withPayload) {

		this._initPlaceholder(forNextState, withPayload);

		if (withPayload.html) {
			return this.component.html(withPayload.html, forNextState.placeholder);
		} else if (forNextState.placeholder instanceof Element) {
			return this.component.load(forNextState.componentContentURL, forNextState.placeholder, withPayload);
		}
		
		return this.component.load(forNextState.componentContentURL, '#' + forNextState.placeholder.prop('id'), withPayload);
	};

	BaseFlowPresenter.prototype._initPlaceholder = function(forNextState, withPayload) {
		if (forNextState.placeholder) {
			return;
		}
		if (withPayload.selector) {
			forNextState.placeholder = withPayload.selector; // eslint-disable-line no-param-reassign
		} else {
			forNextState.placeholder = this._placeholder(); // eslint-disable-line no-param-reassign
		}
	};

	BaseFlowPresenter.prototype._showInAWay = function() {
	};

	BaseFlowPresenter.prototype._hideInAWay = function() {
	};

	BaseFlowPresenter.prototype._placeholder = function() {
		var id = Number(new Date());
		var html = '<div id="' + id + '" class="js-hidden" />';

		this.component.$el.append(html);

		return this.component.$el.find('#' + id);
	};


/***/ },

/***/ 424:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(341);

	var FlowController = module.exports = function(presenter, states, $events, extra) {
		this.presenter = presenter;
		this.states = states;
		this.data = {};
		this.stack = [];
		this.currentState = 0;
		this.extra = extra || {
			foldPrev: false
		};
		this.$events = $events;
	};

	FlowController.prototype.startWith = function(stateByName) {
		Object.keys(this.states).forEach(function(key) {
			this.states[key].name = key;
		}.bind(this));

		this.activateStep(stateByName);
		
		return this._unfold(this.states[stateByName]);
	};

	FlowController.prototype.merge = function(source) {
		this.data = tools.helper.extend(this.data, source);
	};

	FlowController.prototype.next = function(withStateData, andOptionalDfd) {
		var nextState;
		var nextStatePayload;
		var dfd = this.presenter.component.$tools.q.defer();

		this.merge(withStateData || {});

		if (this.extra.foldPrev) {
			this._fold(this.currentState);
		}

		this.presenter.component.$tools.q.when(this.currentState.infer(this.data))
			.then(function(nextStateInfo) {
				nextStatePayload = nextStateInfo.payload;
				nextState = this.states[nextStateInfo.next];

				if (nextStateInfo.next !== 'finish') {
					this.activateStep(nextStateInfo.next);
					this.presenter.component.$tools.q.when(this._unfold(nextState, nextStatePayload))
						.then(dfd.resolve.bind(dfd), dfd.reject.bind(dfd));
				} else {
					if (typeof this.presenter.component.finish === 'function') {
						this.presenter.component.$tools.q.when(this.presenter.component.finish(this.data))
							.then(dfd.resolve.bind(dfd), dfd.reject.bind(dfd));
					} else {
						dfd.resolve();
					}
				}

				if (andOptionalDfd) {
					dfd.then(andOptionalDfd.resolve.bind(andOptionalDfd), andOptionalDfd.reject.bind(andOptionalDfd));
				}
			}.bind(this));

		return dfd.promise();
	};

	FlowController.prototype.prev = function() {
		var prevState = this.stack.pop();
		var nextState = this.stack[this.stack.length - 1];

		this.currentState = nextState;

		return this.presenter.component.$tools.q.when(this._fold(prevState))
			.then(this.activateStep.bind(this, nextState.name));
	};

	FlowController.prototype.getActiveStepIndex = function() {
		return this.states[this.currentState] ? this.states[this.currentState].index : 0;
	};

	FlowController.prototype.activateStep = function(stepName) {
		if (!this.$events) {
			return;
		}

		this.$events.trigger('activateStep', this.states[stepName].index);
	};

	FlowController.prototype.reset = function(toState, withStateData) {
		var state;
		var index;

		toState = typeof toState === 'string' ? this.states[toState] : toState; // eslint-disable-line no-param-reassign

		this.merge(withStateData || {});

		for (index = this.stack.slice().length - 1; index >= 0; index--) {
			state = this.stack[index];

			if (state.name !== toState.name) {
				this.prev();
			} else {
				this._unfold(toState);
				break;
			}
		}
	};

	FlowController.prototype.updateState = function(nextState) {
		this.currentState = nextState;

		this.stack.push(nextState);

		return this._activate(this.presenter.component.$components[nextState.name]);
	};

	FlowController.prototype._unfold = function(nextState, withPayload) {
		return this.presenter.component.$tools.q.when(this.presenter.unfold(nextState, withPayload))
			.then(this.updateState.bind(this, nextState, withPayload));
	};

	FlowController.prototype._fold = function(thisState) {
		var component = this.presenter.component.$components[thisState.name];

		if (component) {
			component.$events.trigger('deactivate', this.data);
		}

		return this.presenter.component.$tools.q.when(this.presenter.fold(thisState, this.currentState))
			.then(function() {
				if (thisState.statik && !thisState.statikRemovable) {
					return;
				}

				if (component) {
					component.$el.remove();
				}

				delete this.presenter.component.$components[thisState.name];
			}.bind(this));
	};

	FlowController.prototype._activate = function(component) {
		var dfd = this.presenter.component.$tools.q.defer();

		if (!component) {
			return;
		}
		component.flow = this; // eslint-disable-line no-param-reassign
		component.$events.trigger('activate', this.data);
		dfd.resolve();

		return dfd.promise(); // eslint-disable-line consistent-return
	};

	FlowController.prototype._resetAsync = function(toState, dfd) {
		var state;

		toState = typeof toState === 'string' ? this.states[toState] : toState; // eslint-disable-line no-param-reassign
		state = this.stack[this.stack.length - 1];

		if (state.name === toState.name) {
			dfd.resolve();

			return;
		}

		this.prev()
			.then(this._resetAsync.bind(this, toState, dfd));
	};

	FlowController.prototype.resetAsync = function(toState, withStateData) {
		var dfd = this.presenter.component.$tools.q.defer();

		this.merge(withStateData || {});

		this._resetAsync(toState, dfd);

		return dfd.promise();
	};


/***/ },

/***/ 425:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseFlowPresenter = __webpack_require__(423);

	var SheetFlowPresenter = module.exports = function() {
		BaseFlowPresenter.apply(this, Array.prototype.slice.call(arguments));
	};

	SheetFlowPresenter.prototype = new BaseFlowPresenter();
	SheetFlowPresenter.prototype.constructor = SheetFlowPresenter;

	SheetFlowPresenter.prototype._showInAWay = function(placeholder) {
		var dfd = this.component.$tools.q.defer();

		placeholder.show();
		placeholder.slideDown(function() {
			dfd.resolve();
			scrollTo(placeholder);
		});

		return dfd.promise();
	};

	SheetFlowPresenter.prototype._hideInAWay = function(placeholder) {
		var dfd = this.component.$tools.q.defer();

		if (placeholder) {
			placeholder.slideUp(function() {
				placeholder.hide();
				dfd.resolve();
			});
		} else {
			dfd.resolve();
		}

		return dfd.promise();
	};

	function scrollTo(placeholder) {
		var prevTop = -100;
		var scrollTop = ++document.body.scrollTop;
		var interval;
		var top;
		var delta;
		var FRAME_PER_SECOND = 30;
		var TIMEOUT = 16;

		if (document.body.scrollTop !== scrollTop) {
			placeholder[0].scrollIntoView();
			
			return;
		}

		top = placeholder.offset().top;
		delta = (top - window.document.body.scrollTop) / FRAME_PER_SECOND;

		interval = setInterval(function() {
			window.document.body.scrollTop += delta;

			if (prevTop === window.document.body.scrollTop || Math.abs(window.document.body.scrollTop - top) < delta) {
				window.document.body.scrollTop = top + 1;
				clearInterval(interval);
			}

			prevTop = window.document.body.scrollTop;
		}, TIMEOUT);
	}


/***/ },

/***/ 426:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseFlowPresenter = __webpack_require__(423);

	var StackedFlowPresenter = module.exports = function() {
		BaseFlowPresenter.apply(this, Array.prototype.slice.call(arguments));
	};

	StackedFlowPresenter.prototype = new BaseFlowPresenter();
	StackedFlowPresenter.prototype.constructor = StackedFlowPresenter;

	StackedFlowPresenter.prototype.unfold = function(nextState) {
		if (nextState.statik) {
			this.component.$el.find('> *').hide();
			this.component.$components[nextState.name].show();
			this.component.$components[nextState.name].$el.show();
		}

		return BaseFlowPresenter.prototype.unfold.apply(this, Array.prototype.slice.call(arguments));
	};

	StackedFlowPresenter.prototype._showInAWay = function(placeholder) {
		this.component.$el.find('> *').hide();
		placeholder.show();
	};

	StackedFlowPresenter.prototype._hideInAWay = function(placeholder) {
		placeholder.hide();
	};


/***/ },

/***/ 427:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var scrollTo = __webpack_require__(428);
	var BaseFlowPresenter = __webpack_require__(423);

	var WizardFlowPresenter = module.exports = function() {
		BaseFlowPresenter.apply(this, Array.prototype.slice.call(arguments));
	};

	WizardFlowPresenter.prototype = new BaseFlowPresenter();
	WizardFlowPresenter.prototype.constructor = WizardFlowPresenter;

	WizardFlowPresenter.prototype.fold = function(current, old) {
		var dfd = this.component.$tools.q.defer();

		BaseFlowPresenter.prototype.fold.apply(this, arguments)
			.then(function() {
				this._showInAWay(old.placeholder ? old.placeholder : this.component.$components[old.name].$el)
					.then(dfd.resolve.bind(dfd), dfd.reject.bind(dfd));
			}.bind(this));

		return dfd.promise();
	};

	WizardFlowPresenter.prototype._showInAWay = function(placeholder) {
		var SCROLL_TO = 200;
		var TIMEOUT_RESOLVE = 200;
		var MARGIN_TOP = 150;
		var dfd = this.component.$tools.q.defer();

		this._hideStep();

		this._showComponent(placeholder);

		scrollTo(this.component.$el.position().top - MARGIN_TOP, SCROLL_TO);

		setTimeout(dfd.resolve.bind(dfd), TIMEOUT_RESOLVE);

		return dfd.promise();
	};

	WizardFlowPresenter.prototype._showComponent = function(placeholder) {
		placeholder.show();
	};

	WizardFlowPresenter.prototype._hideStep = function() {
		this.component.$el.find('> *').hide();
	};

	WizardFlowPresenter.prototype._hideInAWay = function() {
		var SCROLL_TO = 200;
		var TIMEOUT_RESOLVE = 200;
		var MARGIN_TOP = 150;
		var dfd = this.component.$tools.q.defer();

		scrollTo(this.component.$el.position().top - MARGIN_TOP, SCROLL_TO);

		setTimeout(dfd.resolve.bind(dfd), TIMEOUT_RESOLVE);

		return dfd.promise();
	};


/***/ },

/***/ 428:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*!
	 * jQuery.scrollTo
	 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
	 * Licensed under MIT
	 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
	 * @projectDescription Lightweight, cross-browser and highly customizable animated scrolling with jQuery
	 * @author Ariel Flesler
	 * @version 2.1.2
	 */
	;(function(factory) {
		'use strict';
		if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			// CommonJS
			module.exports = factory(require('jquery'));
		} else {
			// Global
			factory(jQuery);
		}
	})(function($) {
		'use strict';

		var $scrollTo = $.scrollTo = function(target, duration, settings) {
			return $(window).scrollTo(target, duration, settings);
		};

		$scrollTo.defaults = {
			axis:'xy',
			duration: 0,
			limit:true
		};

		function isWin(elem) {
			return !elem.nodeName ||
				$.inArray(elem.nodeName.toLowerCase(), ['iframe','#document','html','body']) !== -1;
		}		

		$.fn.scrollTo = function(target, duration, settings) {
			if (typeof duration === 'object') {
				settings = duration;
				duration = 0;
			}
			if (typeof settings === 'function') {
				settings = { onAfter:settings };
			}
			if (target === 'max') {
				target = 9e9;
			}

			settings = $.extend({}, $scrollTo.defaults, settings);
			// Speed is still recognized for backwards compatibility
			duration = duration || settings.duration;
			// Make sure the settings are given right
			var queue = settings.queue && settings.axis.length > 1;
			if (queue) {
				// Let's keep the overall duration
				duration /= 2;
			}
			settings.offset = both(settings.offset);
			settings.over = both(settings.over);

			return this.each(function() {
				// Null target yields nothing, just like jQuery does
				if (target === null) return;

				var win = isWin(this),
					elem = win ? this.contentWindow || window : this,
					$elem = $(elem),
					targ = target, 
					attr = {},
					toff;

				switch (typeof targ) {
					// A number will pass the regex
					case 'number':
					case 'string':
						if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
							targ = both(targ);
							// We are done
							break;
						}
						// Relative/Absolute selector
						targ = win ? $(targ) : $(targ, elem);
						/* falls through */
					case 'object':
						if (targ.length === 0) return;
						// DOMElement / jQuery
						if (targ.is || targ.style) {
							// Get the real position of the target
							toff = (targ = $(targ)).offset();
						}
				}

				var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

				$.each(settings.axis.split(''), function(i, axis) {
					var Pos	= axis === 'x' ? 'Left' : 'Top',
						pos = Pos.toLowerCase(),
						key = 'scroll' + Pos,
						prev = $elem[key](),
						max = $scrollTo.max(elem, axis);

					if (toff) {// jQuery / DOMElement
						attr[key] = toff[pos] + (win ? 0 : prev - $elem.offset()[pos]);

						// If it's a dom element, reduce the margin
						if (settings.margin) {
							attr[key] -= parseInt(targ.css('margin'+Pos), 10) || 0;
							attr[key] -= parseInt(targ.css('border'+Pos+'Width'), 10) || 0;
						}

						attr[key] += offset[pos] || 0;

						if (settings.over[pos]) {
							// Scroll to a fraction of its width/height
							attr[key] += targ[axis === 'x'?'width':'height']() * settings.over[pos];
						}
					} else {
						var val = targ[pos];
						// Handle percentage values
						attr[key] = val.slice && val.slice(-1) === '%' ?
							parseFloat(val) / 100 * max
							: val;
					}

					// Number or 'number'
					if (settings.limit && /^\d+$/.test(attr[key])) {
						// Check the limits
						attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
					}

					// Don't waste time animating, if there's no need.
					if (!i && settings.axis.length > 1) {
						if (prev === attr[key]) {
							// No animation needed
							attr = {};
						} else if (queue) {
							// Intermediate animation
							animate(settings.onAfterFirst);
							// Don't animate this axis again in the next iteration.
							attr = {};
						}
					}
				});

				animate(settings.onAfter);

				function animate(callback) {
					var opts = $.extend({}, settings, {
						// The queue setting conflicts with animate()
						// Force it to always be true
						queue: true,
						duration: duration,
						complete: callback && function() {
							callback.call(elem, targ, settings);
						}
					});
					$elem.animate(attr, opts);
				}
			});
		};

		// Max scrolling position, works on quirks mode
		// It only fails (not too badly) on IE, quirks mode.
		$scrollTo.max = function(elem, axis) {
			var Dim = axis === 'x' ? 'Width' : 'Height',
				scroll = 'scroll'+Dim;

			if (!isWin(elem))
				return elem[scroll] - $(elem)[Dim.toLowerCase()]();

			var size = 'client' + Dim,
				doc = elem.ownerDocument || elem.document,
				html = doc.documentElement,
				body = doc.body;

			return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
		};

		function both(val) {
			return $.isFunction(val) || $.isPlainObject(val) ? val : { top:val, left:val };
		}

		// Add special hooks so that window scroll properties can be animated
		$.Tween.propHooks.scrollLeft = 
		$.Tween.propHooks.scrollTop = {
			get: function(t) {
				return $(t.elem)[t.prop]();
			},
			set: function(t) {
				var curr = this.get(t);
				// If interrupt is true and user scrolled, stop animating
				if (t.options.interrupt && t._last && t._last !== curr) {
					return $(t.elem).stop();
				}
				var next = Math.round(t.now);
				// Don't waste CPU
				// Browsers don't render floating point scroll
				if (curr !== next) {
					$(t.elem)[t.prop](next);
					t._last = this.get(t);
				}
			}
		};

		// AMD requirement
		return $scrollTo;
	});


/***/ },

/***/ 429:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports.FlowController = __webpack_require__(424);

	module.exports.SheetFlowPresenter = __webpack_require__(425);
	module.exports.WizardFlowPresenter = __webpack_require__(427);
	module.exports.StackedFlowPresenter = __webpack_require__(426);


/***/ },

/***/ 532:
/***/ function(module, exports) {

	'use strict';

	/**
		desc: >
			base control for datatables/filters. Don't use it as a separate component or extension it's an abstract entity.
			Extend it from real control and implement abstract methods
			Allows to postpone control activation.
		options:
			delayedControl: Boolean. Points that this control should be postponed.
			blockingControl: Boolean. Points that control should block a datatable content loading.
								In conjunction with delayedControl forces datable to wait.
	*/
	module.exports = {
		init: function() {
			this._blockingPromise = this.$tools.q.defer();
			this._readyState = true;
			
			if (this.$options.delayedControl) {
				this._readyState = false;
				this._postpone()
					.then(this._done.bind(this));
			}

			if (!this.$options.blockingControl) {
				this._blockingPromise.resolve();
			}
		},

		/**
			desc: Returns flag which points whether control is ready
		*/
		isReady: function() {
			return this._readyState;
		},

		/**
			returns blocking promise
		*/
		getBlockingPromise: function() {
			return this._blockingPromise;
		},

		/**
			desc: Abstract method. Should contain loginc for disabling control
		*/
		disable: function() {

		},

		/**
			desc: Abstract method. Should contain logic for enabling control
		*/
		enable: function() {

		},

		/**
			desc: Abstract method. Should contain logic for reseting control state/value
		*/
		reset: function() {

		},

		/**
			desc: >
				Abstract method. Called if control has option 'delayedControl'
				Must return Promise.
		*/
		_postpone: function() {

		},

		/**
			desc: Called when _postpone is done.
		*/
		_done: function() {
			this._readyState = true;
			this._blockingPromise.resolve();
		}
	};


/***/ },

/***/ 787:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(788);


/***/ },

/***/ 788:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./change-stock-status/check-item/index.js": 789,
		"./change-stock-status/edit-switch-helper/index.js": 790,
		"./change-stock-status/index.js": 791,
		"./common/controllerBase.js": 792,
		"./common/stock/index.js": 793,
		"./common/stock/item/index.js": 794,
		"./helpers/checkbox-group/index.js": 795,
		"./helpers/edit-mode-switcher/index.js": 796,
		"./helpers/select-on-focus/index.js": 797,
		"./helpers/show-element/index.js": 798,
		"./inventory/close-inventory/index.js": 799,
		"./inventory/edit-comment/index.js": 800,
		"./inventory/initiate-list/index.js": 801,
		"./inventory/initiate/index.js": 802,
		"./inventory/initiate/process-items/index.js": 803,
		"./inventory/open-inventory/index.js": 804,
		"./inventory/reports/index.js": 805,
		"./regret-order/index.js": 806,
		"./return-to-stock/index.js": 808,
		"./return-to-stock/manage/changes.js": 809,
		"./return-to-stock/manage/config/filter/index.js": 810,
		"./return-to-stock/manage/config/index.js": 811,
		"./return-to-stock/manage/config/table/index.js": 812,
		"./return-to-stock/manage/config/table/rows/index.js": 813,
		"./return-to-stock/manage/index.js": 814,
		"./return-to-stock/manage/search/index.js": 815,
		"./return-to-stock/manage/search/table/index.js": 816,
		"./sim-card/change/customers/index.js": 817,
		"./sim-card/change/index.js": 818,
		"./sim-card/change/search/index.js": 820,
		"./sim-card/change/sim/barcode/index.js": 821,
		"./sim-card/change/sim/index.js": 823,
		"./transfers/report-transfers/index.js": 825,
		"./transfers/report-transfers/item/index.js": 826
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 788;


/***/ },

/***/ 789:
/***/ function(module, exports) {

	'use strict';

	/**
		name: change-stock-status/check-item
		desc: >
			Controller for check item page

		depends:
			$prefixSwitcher: Framework/switcher

		type: controller
	*/
	module.exports = {
		events: {
			'change $prefixSwitcher': '_onPrefixChange'
		},

		_onPrefixChange: function() {
			this.$elements.autoScanField.eq(0).focus();
		}
	};


/***/ },

/***/ 790:
/***/ function(module, exports) {

	'use strict';

	/**
	name: edit switch helper for tables component on change stock status pageSize
	type: controller
	decs: >
		Helper that listens for checked and unchecked event on `checkbox` component with 'selectRow' alias
		which is compatible with tables/selectable component. It toggles visibility of components marked
		with data-element="editMode" if they are present.
	*/
	module.exports = {
		events: {
			'checked $selectRow': '_onSelectionChanged',
			'unchecked $selectRow': '_onSelectionChanged'
		},

		_onSelectionChanged: function(event) {
			var isChecked = event.component.isChecked();

			if (this.$elements.editMode) {
				this.$elements.editMode.toggle(isChecked);
			}
		}
	};


/***/ },

/***/ 791:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Change stock status
	type: controller
	desc: >
		Controller for ChangeStockStatusPage. It's primary function is to enable submit button when there are
		selected rows and disable submit button when there are no selection or when new data is loaded to the table
	*/

	module.exports = {
		events: {
			'startLoading $stockTable': '_onLoading',
			'selectionChanged $stockTable': '_onToggleSelection'
		},

		_onToggleSelection: function(ev, data) {
			// toggle submit button on if there are selected items. Otherwise disable
			this._toggleSubmitButton(Boolean(data.length));
		},

		_onLoading: function() {
			this._toggleSubmitButton(false);
		},

		_toggleSubmitButton: function(isSubmitButtonEnabled) {
			if (isSubmitButtonEnabled) {
				this.$components.submitButton.enable();
			} else {
				this.$components.submitButton.disable();
			}
		}
	};


/***/ },

/***/ 792:
/***/ function(module, exports) {

	'use strict';

	/**
	name: controller base for SAP pages
	type: controller
	desc: >
		It's a base controller for ajax-enabled pages that provides error handling functionality.
		It expects `message` component to be available on the first level of hierarchy with alias `errorMessage`
		and optionally `message` component with alias `warningMessage` to display warnings.
		It provies protected method `_post` that handles error messages in the reply. Using this `_post` method
		should be the same as using `this.$tools.data.post()`.
		It also provides protected method '_load' which is effectively the same as using native `load` method but
		have an error handling logic enabled

		Usage example:
		var tools = require('Common/aura/js/base');
		var controllerBase = require('SAP/common/controllerBase');

		module.exports = Object.assign({}, controllerBase, {
			... YOUR COMPONENT CODE ...
			_someAjaxMethod: function() {
				this._post(url, data).then(function(res) {...});
				...
				this._load(url, target, data).then(function(res) {...});
			}

		});

		Template example:
		<div data-component="SAP::my-controller-based-on-controllerBase">
			@Html.RenderMessage(new BaseMessageOptions(MessageType.Error, string.Empty)
			{
				IsHidden = true,
				InnerClasses = "trailer",
				UseCloseButton = true,
				DataAttributes = new
				{
					component = "message",
					alias = "errorMessage"
				}
			})

			@Html.RenderMessage(new BaseMessageOptions(MessageType.Warn, string.Empty)
			{
				IsHidden = true,
				InnerClasses = "trailer",
				UseCloseButton = true,
				DataAttributes = new
				{
					component = "message",
					alias = "warningMessage"
				}
			})
			<!-- Here your html goes -->
		</div>

	*/
	module.exports = {
		/** protected method to be used instead of this.$tools.data.post */
		_post: function(url, data) {
			this._hideMessages();

			return this.$tools.data.post(url, data)
				.then(this._handleAjaxResponse.bind(this))
				.catch(this._handleAjaxResponse.bind(this));
		},

		/** protected method, analog for `this.load` method but with error handling */
		_load: function(url, target, data) {
			this._hideMessages();

			return this.load(url, target, data)
				.then(this._handleAjaxResponse.bind(this))
				.catch(this._handleAjaxResponse.bind(this));
		},

		_handleAjaxResponse: function(res) {
			if (res.errorMessages && res.errorMessages.length) {
				this._showErrorMessage(res.errorMessages.join('<br/>'));
			} else if (res.data && res.data.warningMessages && res.data.warningMessages.length) {
				this._showWarningMessage(res.data.warningMessages.join('<br/>'));
			}

			return res;
		},

		_hideMessages: function() {
			this.$components.errorMessage.close();
			if (this.$components.warningMessage) {
				this.$components.warningMessage.close();
			}
		},

		_showErrorMessage: function(message) {
			this.$components.errorMessage.showValidationMessage(message);
		},

		_showWarningMessage: function(message) {
			if (this.$components.warningMessage && this.$components.warningMessage.showValidationMessage) {
				this.$components.warningMessage.showValidationMessage(message);
			} else {
				this.$tools.logger.error('Missing warningMessage component');
			}
		}
	};


/***/ },

/***/ 793:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var controllerBase = __webpack_require__(792);

	/**
		name: stock controller (pages: stock counting, send stock, receive stock, goods issue, recall order)
		desc: >
			Controller for stock pages.
			It handles four main actions: add item (or scan), update quantities, delete items and finish.

		options: >
			submitItemUrl - url to submit scanned/entered item
			changeQuantityUrl - url to submit quantity change for material
			finishUrl - url to finalize

		depends:
			$submitItemForm: Framework/form
			$submitButton: Framework/button
			$finishButton: Framework/button
			$$items: SAP/common/stock/item
			$rangeScanSeitcher: Framework/switcher
			$prefixSwitcher: Framework/switcher

		type: controller
	*/

	module.exports = Object.assign({}, controllerBase, {
		events: {
			'submit $submitItemForm': '_onSubmitItem',
			'click $finishButton': '_onFinishButtonClick',
			'editQuantity $$items': '_onEditQuantity',
			'delete $$items': '_onItemDelete',
			'change $rangeScanSwitcher': '_onToggleRangeScan',
			'change $prefixSwitcher': '_onTogglePrefix'
		},

		initialize: function() {
			this.$rangeStart = this.$elements.autoScanField.eq(0);
			this.$rangeEnd = this.$elements.autoScanField.eq(1);
		},

		_onSubmitItem: function() {
			var data = this.$components.submitItemForm.serialize();
			var loading = this.$components.submitButton.activityIndicator();
			var finishButton = this.$components.finishButton;

			finishButton.disable();

			this._load(this.$options.submitItemUrl, this.$elements.itemsContainer, data)
				.then(this._submitSuccess.bind(this, loading, finishButton))
				.catch(this._submitAlways.bind(this, loading, finishButton));
		},

		_submitSuccess: function(loading, finishButton, response) {
			this._submitAlways(loading, finishButton);

			if (response.success) {
				this.$elements.autoScanField.val('');
			}
		},

		_submitAlways: function(loading, finishButton) {
			loading.reject();
			finishButton.enable();
		},

		_onFinishButtonClick: function() {
			var loading = this.$components.finishButton.activityIndicator();

			this._post(this.$options.finishUrl)
				.then(this._finishSuccess.bind(this, loading))
				.catch(loading.reject.bind(loading));
		},

		_finishSuccess: function(loading, response) {
			if (response.success) {
				loading.resolve();
			} else {
				loading.reject();
			}
		},

		_onEditQuantity: function(event, data) {
			var loading = data.loading;
			var $input = this.$rangeStart;

			this._load(this.$options.changeQuantityUrl, this.$elements.itemsContainer, data.data)
				.then(this._editSuccess.bind(this, loading, $input))
				.catch(loading.reject.bind(loading));
		},

		_editSuccess: function(loading, $input) {
			loading.reject();
			$input.focus();
		},

		_onItemDelete: function(event, deleteItemUrl) {
			this._load(deleteItemUrl, this.$elements.itemsContainer, {});
		},

		_onToggleRangeScan: function(event, value) {
			this.$rangeStart.focus();
			this.$rangeEnd.prop('disabled', value === 'false')
				.val('')
			 /* todo: make it possible to clear validation messages on disabled input */
				.parent()
				.removeClass('form-item--error');
		},

		_onTogglePrefix: function() {
			this.$rangeStart.focus();
		}
	});


/***/ },

/***/ 794:
/***/ function(module, exports) {

	'use strict';

	/**
		name: Stock item component
		type: controller
		desc: >
			Component that represents single item for stock manipulation pages (Goods Issue to cost center, etc)

		triggers: >
			editQuantity - emits when quantity changes, having serialized form + loading deferred (that may be null);
			delete - emits when item should be deleted. Payload is url for deletion set as deleteItemUrl

		options: >
			deleteItemUrl - url to POST for item deletion

		depends:
			$$deleteItem: Framework/button
			$$changeQuantity: SAP::helpers/edit-mode-switcher
	*/
	module.exports = {
		events: {
			'click $$deleteItem': '_onDeleteClick',
			'submit $$changeQuantity': '_onChangeQuantity'
		},

		_onDeleteClick: function(event) {
			var button = event.component;

			this.$events.trigger('delete', button.$options.deleteItemUrl);
		},

		_onChangeQuantity: function(event) {
			var form = event.component;

			this.$events.trigger('editQuantity', {
				data: form.serialize(),
				loading: form.$components.submitButton.activityIndicator()
			});
		}
	};


/***/ },

/***/ 795:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Checkbox group toggler
	desc: >
		Controls a group of checkboxes with group toggle checkbox. Group toggle checkbox
		must be data-element="groupToggle", other toggles should be
		data-element="checkboxToggle"

	type: controller
	*/
	module.exports = {
		events: {
			'click groupToggle': '_onGroupToggle',
			'click checkboxToggle': '_onCheckboxToggle'
		},

		initialize: function() {
			this._onCheckboxToggle();
		},

		_onGroupToggle: function(ev) {
			var targetState = ev.$el[0].checked;

			this.$elements.checkboxToggle.forEach(function(checkbox) {
				checkbox.checked = targetState; // eslint-disable-line no-param-reassign
			});
		},

		_onCheckboxToggle: function() {
			var hasUnchecked = this.$elements.checkboxToggle.some(function(checkbox) {
				return checkbox.checked === false;
			});

			// set correct state to group toggle depending on child toggles
			this.$elements.groupToggle.prop('checked', !hasUnchecked);
		}
	};


/***/ },

/***/ 796:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Edit mode switcher (SAP helper)
	type: ui
	desc: >
		Helper component that shows all elements named `editMode` and hides elements named `viewMode`.
		To trigger this it listens for click on data-element='editModeToggle' (usually button)
		and for change event on data-element='editModeCheckbox' (usually checkbox)
	options:
		editMode: if `true` then default mode is to show edit mode block. Initial state should be properly rendered,
			it's not changed on component initialization
	*/
	module.exports = {
		events: {
			'click editModeToggle': '_onEditModeToggle',
			'change $editModeCheckbox': '_onEditModeChange'
		},

		initialize: function() {
			this.isEditMode = this.$options.editMode || false;

			if (this.$options.scrollTo) {
				this.$el.get(0).scrollIntoViewIfNeeded(true);
			}
		},

		_onEditModeToggle: function() {
			this._toggleEditMode();
		},

		_onEditModeChange: function(event) {
			this._toggleEditMode(event.component.isChecked());
		},

		_toggleEditMode: function(isEdit) {
			this.isEditMode = (isEdit === undefined) ? !this.isEditMode : isEdit;

			if (this.$elements.viewMode) {
				this.$elements.viewMode.toggle(!this.isEditMode);
			}

			if (this.$elements.editMode) {
				this.$elements.editMode.toggle(this.isEditMode);
			}

			if (this.isEditMode && this.$elements.quantityInput) {
				requestAnimationFrame(function() {
					this.$elements.quantityInput.focus();
				}.bind(this));
			}
		}
	};


/***/ },

/***/ 797:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		events: {
			'focus': '_onFocus',
			'mouseup': '_unselectWorkaround'
		},
		
		initialize: function() {
			this.el = this.$el.get(0);

			if (this.$options.autofocus) {
				this.el.focus();
				this._select();
			}
		},

		_select: function() {
			var MAX_LENGTH = 9999;

			this.el.setSelectionRange(0, this.el.value.length || MAX_LENGTH);
		},

		_onFocus: function() {
			this._select();
		},

		_unselectWorkaround: function(event) {
			// as suggested http://stackoverflow.com/a/6813211/1075459
			// need to check if it's required.
			event.preventDefault();
		}
	};


/***/ },

/***/ 798:
/***/ function(module, exports) {

	'use strict';

	/**
	name: show-element
	type: ui
	desc: Show element when POS is connected.
	*/

	module.exports = {
		events: {
			'posConnected $this': '_onShow'
		},
		_onShow: function(event, data) {
			if (!data.isConnected) {
				this.show();
			}
		}
	};


/***/ },

/***/ 799:
/***/ function(module, exports) {

	'use strict';

	var members = ['closeInventory', 'forceCloseInventory', 'furtherScans'];

	/**
		name: close inventory controller (SAP)
		type: controller
		desc: Controller for close inventory pageSize
	*/
	module.exports = {
		initialize: function() {
			members.forEach(function(memberName) {
				this.$events.on('confirm $' + memberName + 'Dialog', this._onConfirm.bind(this, memberName));
				this.$events.on('cancel $' + memberName + 'Dialog', this._onCancel.bind(this, memberName));
			}.bind(this));
		},

		_onConfirm: function(memberName) {
			this._disableButtons();
			this.$components[memberName + 'Dialog'].hide();
			this.$components[memberName + 'Form'].submit();
			this.$components[memberName + 'Button'].enable();
		},

		_onCancel: function(memberName) {
			this.$components[memberName + 'Dialog'].hide();
			this.$components[memberName + 'Button'].resetLoading();
		},

		_disableButtons: function() {
			members.forEach(function(memberName) {
				var button = this.$components[memberName + 'Button'];

				if (button) {
					button.disable();
				}
			}.bind(this));
		}
	};


/***/ },

/***/ 800:
/***/ function(module, exports) {

	'use strict';

	/**
		name: SAP/invantory/edit-comment
		type: ui
		desc: Component for toggling view/edit mode and saving comment on close inventory page
	*/
	module.exports = {
		events: {
			'click $editComment': '_onEditClick',
			'submit $commentForm': '_onSaveComment'
		},

		_onEditClick: function() {
			var field = this.$elements.commentField.get(0);

			this._toggleEdit(true);
			field.focus();
			field.selectionStart = field.selectionEnd = field.value.length;
		},

		_onSaveComment: function() {
			var data = this.$components.commentForm.serialize();
			var ai = this.$components.saveComment.activityIndicator();

			this.$components.errorMessage.close();
			this.$tools.data.post(this.$options.saveCommentUrl, data)
				.then(this._onSaveSuccess.bind(this, ai))
				.catch(this._onSaveError.bind(this, ai));
		},

		_onSaveSuccess: function(ai, response) {
			if (!response.success) {
				this._onSaveError(ai, response);

				return;
			}

			this.$elements.commentText.text(response.data.comment || '');
			this._toggleEdit(false);

			ai.reject();
		},

		_onSaveError: function(ai, response) {
			ai.reject();

			if (response.errorMessages.length) {
				this.$components.errorMessage
					.showValidationMessage(response.errorMessages[0]);
			}
		},

		_toggleEdit: function(condition) {
			this.$elements.commentView.toggle(!condition);
			this.$components.commentForm.toggle(condition);
		}
	};


/***/ },

/***/ 801:
/***/ function(module, exports) {

	'use strict';

	/**
	name: inventory initiate list page controller (SAP)
	type: controller
	desc: >
		Page controller for inventory initiate list page (InventoryInitiateListPage).
	*/
	module.exports = {
		events: {
			'deleteRow $initiateListTable $$rows': '_onRemoveInventoryClick',
			'confirm $deleteConfirmationDialog': '_onDeletionConfirm',
			'cancel $deleteConfirmationDialog': '_onDeletionCancel'
		},

		initialize: function() {
			this._inventoryToDelete = null;
		},

		_onRemoveInventoryClick: function(ev, component) {
			this._inventoryToDelete = component.$options.value;
			this.$components.deleteConfirmationDialog.show();
		},

		_onDeletionConfirm: function() {
			if (this._inventoryToDelete === null) {
				return;
			}

			this.$tools.data.post(this.$options.removeInitiationUrl, {inventoryId: this._inventoryToDelete})
				.then(function() {
					this.$components.initiateListTable.loadTable();
				}.bind(this));

			this._inventoryToDelete = null;
			this.$components.deleteConfirmationDialog.hide();
		},

		_onDeletionCancel: function() {
			this._inventoryToDelete = null;
			this.$components.deleteConfirmationDialog.hide();
		}
	};


/***/ },

/***/ 802:
/***/ function(module, exports) {

	'use strict';

	/**
	name: inventory initiate controller (SAP)
	type: controller
	desc: >
		Page controller for inventory initiate page. Its primary function is to handle selection of all shops / selected shops
		and selection of all items / selected items. It's achieved by listening to change events on radio inputs marked as
		data-element="shopSelector" and data-element="itemSelector" respectively.
		The handler functions for these changes will toggle visibility of related configuration blocks basesd on the value
		of radio that caused change event. It's expected that value 'False' corresponds to selected items/shops
		configuration block visibility.
	*/
	module.exports = {
		events: {
			'change $itemChoice': '_onChoiceChange',
			'submit $processForm': '_onInitiateProcess'
		},

		_onChoiceChange: function(event, value) {
			this.$components.itemsConfig.toggle(value === 'false');
		},

		_onInitiateProcess: function() {
			var ai = this.$components.submitButton.activityIndicator();

			this.$components.resultMessage.close();
			this.$tools.data.post(this.$options.initiateProcessUrl, this._getFormData())
				.then(this._onInitiateSuccess.bind(this, ai))
				.catch(this._onInitiateFail.bind(this, ai));
		},

		_onInitiateSuccess: function(ai, response) {
			if (!response.success) {
				this._onInitiateFail(ai, response);

				return;
			}

			ai.reject();

			this.$components.submitButton.disable();
			this.$components.resultMessage
				.success(response.data.message)
				.open();
		},

		_onInitiateFail: function(ai, response) {
			ai.reject();

			if (response.errorMessages && response.errorMessages.length) {
				this.$components.resultMessage
					.showValidationMessage(response.errorMessages.join('<br>'));
			}
		},

		_getFormData: function() {
			var data = this.$components.processForm.serialize();
			var choice = this.$components.itemChoice.getNameValuePair();

			return Object.assign(data, choice);
		}
	};


/***/ },

/***/ 803:
/***/ function(module, exports) {

	'use strict';

	/**
	name: SAP/inventory/initiate/process-item
	type: controller
	desc: >
		controller for processed items group
	*/
	module.exports = {
		events: {
			'submit $addItemForm': '_onAddItem',
			'formReset $addItemForm': '_onFormReset',
			'click removeItem': '_onRemoveItem'
		},

		_onAddItem: function() {
			var form = this.$components.addItemForm;
			var data = form.serialize();

			this._changeItems(this.$options.addItemUrl, data, form.reset.bind(form));
		},

		_onRemoveItem: function(event) {
			var data = {};

			data[event.$el.get(0).name] = event.$el.get(0).value;

			this._changeItems(this.$options.removeItemUrl, data, function() {});
		},

		_changeItems: function(url, data, callback) {
			var ai = this.$components.submitButton.activityIndicator();

			this.$tools.data.post(url, data)
				.then(this._onChangeSuccess.bind(this, ai, callback))
				.catch(this._onChangeFail.bind(this, ai));
		},

		_onChangeSuccess: function(ai, callback, response) {
			if (!response.success) {
				this._onChangeFail(ai, response);

				return;
			}

			ai.reject();
			callback();

			this.html(response.data.html, this.$elements.addedItems);
		},

		_onChangeFail: function(ai, response) {
			ai.reject();

			if (response.errorMessages && response.errorMessages.length) {
				this.$components.errorMessage
					.showValidationMessage(response.errorMessages[0]);
			}
		},

		_onFormReset: function() {
			if (this.$components.filter) {
				this.$components.filter.$components
					.filters.forEach(function(filter) {
						filter.reset();
					});
			}
		}
	};


/***/ },

/***/ 804:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var controllerBase = __webpack_require__(792);

	/**
	name: stock counting controller (StockCountingPage)
	desc: >
		Controller for stock counting page.
		It handles four main actions: add item (or scan), update quantities, delete items and finish.

	options: >
		openInventoryUrl - url to submit scanned/entered item
		backUrl - url to return to pevious page

	type: controller
	*/

	module.exports = Object.assign({}, controllerBase, {
		
		events: {
			'submit $openInventoryForm': '_onOpenInventory', // $submitItemForm -> `form` component
			'click $backButton': '_onBackButtonClick' // $backButton -> `button` component
		},

		_onOpenInventory: function(event) {
			var form = event.component;
			var data = form.serialize();
			var loading = form.$components.openInventoryButton.activityIndicator();

			this._post(form.getUrl(), data)
				.then(function(res) {
					loading.reject();

					if (res.success) {
						form.disable();
						this.$components.successMessage.open();
						this.$components.openInventoryButton.hide();
						this.$components.backButton.show();
						this.$elements.statusText.text(res.data.inventoryStatus);
					}
				}.bind(this))
				.catch(function() {
					loading.reject();
				});
		},

		_onBackButtonClick: function(event) {
			var button = event.component;
			var loading = button.activityIndicator();

			this._post(this.$options.backUrl)
				.catch(function() {
					loading.reject();
				});
		}
	});


/***/ },

/***/ 805:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var base = __webpack_require__(802);

	/**
	name: SAP/inventory/reports controller
	type: controller
	desc: >
		Page controller for inventory reports page.
	*/
	module.exports = Object.assign({}, base, {
		events: Object.assign({}, base.events, {
			'change $dateSelect': '_onDateTypeChange'
		}),

		ready: function() {
			this._onDateTypeChange(null, this.$components.dateSelect.getValue());
		},

		_onChoiceChange: function(event, value) {
			base._onChoiceChange.call(this, event, value);
			this.$components.categoriesConfig.toggle(value === 'true');
		},

		_onDateTypeChange: function(event, value) {
			this.$components.customDates.toggle(value === 'CustomRange');
			this.$components.customDates.toggleDisabled(value === 'CustomRange');
		},

		_onInitiateProcess: function() {
			var url = this.$tools.util.addParamsToUrl(this.$options.initiateProcessUrl, this._getFormData());
			
			this.$components.printDocument.setDocumentUrl(url);
		}
	});


/***/ },

/***/ 806:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var regretOrder = __webpack_require__(807);

	/**
	name: Regret order
	type: controller
	desc: >
		Manages regret order(s) functionality. It's a common component which extends country specific functionality.
	*/
	module.exports = Object.assign({}, regretOrder, {
		events: {
			'submit $searchForm': '_onSearch',
			'click $cancelRegret': '_onCancelRegret',
			'click $regretBtn': '_onRegretOrder',
			'rowSelected $ordersTable': '_onSelectOrder',
			'selectionChanged $orderItemsTable': '_onSelectAddon',
			'switcherChanged $orderItemsTable $$rows': '_switcherChanged',
			'change $searchForm $searchSelect': '_setFocus'
		},

		_setFocus: function() {
			this.$elements.searchField.focus();
		},

		_onCancelRegret: function() {
			this.addonsData = null;
			this.$components.searchForm.reset();
			this.$components.searchForm.$components.searchSelect.resetSelect();
			this._hideNotifications();
			this._showOrderDetails();
			this.$components.regretBtn.enable();
		},

		_onSearch: function() {
			this.addonsData = null;

			this.$components.searchForm.$components.searchButton.activityIndicator();

			this._hideNotifications()
				.then(function() {
					this.$components.searchForm.submitAsync()
						.then(this._onSearchSuccess.bind(this))
						.catch(this._onSearchError.bind(this))
						.finally(this._onSearchFinished.bind(this));
				}.bind(this));
		},

		_onSearchSuccess: function(response) {
			this.$components.regretBtn.enable();

			if (response.data.Notifications && response.data.Notifications.length) {
				this._showNotification(response.data.Notifications.join());
			}

			if (response.data.BlockFlow) {
				this.$components.regretBtn.disable();
			}

			if (!response.success) {
				this._onSearchError(response);

				return;
			}

			if (response.data.Orders) {
				this._orders = response.data.Orders || [];
				this._showOrders(this._orders);
			} else if (response.data.Order) {
				this._activeOrder = response.data.Order || {};
				this._showOrderDetails(this._activeOrder);
			} else {
				this._showOrderDetails();
			}
		},

		_onSearchError: function(error) {
			this.$components.regretBtn.enable();
			this._showOrderDetails();
			this._setError(error);
		},

		_onSearchFinished: function() {
			this.$components.searchForm.$components.searchButton.resetLoading();
		},

		_showNotification: function(notification) {
			this.html(notification, this.$elements.notificationMessageBlock)
				.then(function() {
					this.$elements.notificationMessageBlock.show();
					if (this.$components.notificationMessages) {
						this.$components.notificationMessages.forEach(function(message) {
							message.open();
						});
					}
				}.bind(this));
		},

		_setError: function(error) {
			if (!error || !error.length) {
				return;
			}

			this.$tools.logger.error(error);
		},

		_hideNotifications: function() {
			if (this.$components.notificationMessages) {
				return this.$tools.q.all(this.$components.notificationMessages.map(function(message) {
					return message.close();
				}));
			}

			return this.$tools.q.when(); // for the first call
		},

		_onSelectOrder: function(event, data) {
			this._hideNotifications()
				.then(function() {
					this._activeOrder = this._orders.filter(function(order) {
						return order.Id === data.action;
					})[0];

					this._validateOrder(this._activeOrder);
				}.bind(this));
		},

		_validateOrder: function(order) {
			this.$tools.data.post(this.$options.validateOrderUrl, {order: order})
				.then(function(response) {
					if (response.data.Notifications && response.data.Notifications.length) {
						this._showNotification(response.data.Notifications.join());
					}

					if (!response.data.Order) {
						return;
					}

					this._activeOrder = response.data.Order;

					if (response.data.BlockFlow) {
						this.$components.regretBtn.disable();
					}

					this._showOrderDetails(response.data.Order);
				}.bind(this))
				.catch(this._setError.bind(this));
		},

		_switcherChanged: function() {
			if (!this.addonsData) {
				return;
			}

			this.addonsData = this._getAddonsData();
		},

		_onSelectAddon: function(event, data) {
			this.addonsData = this._getAddonsData(data);
			this._getPrice();
		},

		_getAddonsData: function(selectedRows) {
			var addons;

			this.selectedRows = selectedRows || this.selectedRows || [];

			addons = this.selectedRows.map(function(row) {
				var addonsData = {
					model: row.$options.value.model,
					id: row.$options._ref
				};

				if (row.$components.switchers && row.$components.switchers[0]) {
					addonsData.resellable = row.$components.switchers[0].isChecked();
				}

				return addonsData;
			});

			return {
				model: (this._activeOrder && this._activeOrder.model) || {},
				addons: addons
			};
		},

		_showOrders: function(data) {
			this.$elements.ordersContainer.show();
			this.$elements.orderItemsContainer.hide();

			this
				.$components.ordersTable
				.$components.filter
				.$components.ordersFilter
				.setData(data);
		},

		_showOrderDetails: function(data) {
			this.$elements.ordersContainer.hide();
			this.$elements.orderItemsContainer.show();

			this._showOrderInfo(data);

			if (!data) {
				this.$components.orderItemsTable.clearTable();

				return;
			}

			this
				.$components.orderItemsTable
				.$components.filter
				.$components.orderItemsFilter
				.setData(data);

			this._getPrice();
		},

		_getPrice: function() {
			this.$tools.data.post(this.$options.totalUrl, this.addonsData)
				.then(this._updatePrice.bind(this))
				.catch(this._setError.bind(this));
		},

		_updatePrice: function(data) {
			this.$elements.orderSummaryAmount.html(data.data);
		},

		_showOrderInfo: function(data) {
			if (!data) {
				this.$elements.orderSummaryContainer.hide();

				return;
			}

			this.$elements.orderSummaryContainer.show();
			this.$elements.orderSummaryDate.text(data.date);
			this.$elements.orderSummaryId.text(data.id);
		},

		_onRegretOrder: function() {
			this._hideNotifications()
				.then(function() {
					this.$components.regretBtn.activityIndicator();

					this.$tools.data.post(this.$options.url, this.addonsData)
						.then(this._onRegretSuccess.bind(this))
						.catch(this._onRegretFailed.bind(this))
						.finally(this._onRegretFinished.bind(this));

				}.bind(this));
		},
		
		_onRegretFailed: function(error) {
			this._setError(error);
			this.$components.regretBtn.disable();
		},

		_onRegretFinished: function() {
			this.$components.regretBtn.resetLoading();
		},

		_onRegretSuccess: function(response) {
			if (response.data.Notifications && response.data.Notifications.length) {
				this._showNotification(response.data.Notifications.join());
			}

			if (!response.success) {
				return;
			}

			this.$components.regretBtn.disable();
			this._sendToTerminal(response);
		}
	});


/***/ },

/***/ 807:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var posService = __webpack_require__(355);

	/**
	name: Regret order Denmark
	type: controller
	desc: >
		Denmark specific functionality to regret orders via pos terminal.
	*/
	module.exports = {
		_sendToTerminal: function(response) {
			if (response.data && response.data.paymentMethod === 'Pos') {
				this.posData = response.data;
				posService.isConnected()
					.then((function() {
						this._pay(this.posData);
						this.$components.regretBtn.disable();
					}).bind(this))
					.catch((function() {
						this._onPaymentPosError({
							messages: [this.$options.validatePosNotConnected],
							transactionId: this.posData.options.order.id,
							status: 1 // TransactionStatus.Failed
						});
					}).bind(this));
			}
		},

		_pay: function(posData) {
			posService.payOrder(posData)
				.then(this._onPaymentPosSuccess.bind(this))
				.catch(this._onPaymentPosError.bind(this));
		},

		_onPaymentPosSuccess: function(data) {
			this._validatePosCallback(data);
		},

		_onPaymentPosError: function(data) {
			this._validatePosCallback(data);
		},

		_validatePosCallback: function(data) {
			this.$tools.data.post(this.$options.posCompletedUrl, data)
				.then(function(response) {
					if (response.data.Notifications && response.data.Notifications.length) {
						this._showNotification(response.data.Notifications.join());
					}
				}.bind(this))
				.catch(this._setError.bind(this));
		}
	};


/***/ },

/***/ 808:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Return to stock
	type: controller
	desc: >
		Page controller for return to stock page.
	 */
	module.exports = {
		events: {
			'submitOrders $manage $config': '_submitOrders',
			'click $clearOrders': '_clearOrders'
		},

		_clearOrders: function() {
			this.$components.customerInfo.reset();
			this.$components.manage.clearOrders();
		},

		_submitOrders: function(event, data) {
			var submitData = {};
			var serializedCustomerForm;
			var btnDeferred;

			if (!this.$options.submitUrl) {
				return;
			}

			if (!this.$components.customerInfo.valid()) {
				return;
			}

			btnDeferred = data.submitBtn.activityIndicator();
			serializedCustomerForm = this.$components.customerInfo.serialize();
			submitData.customer = serializedCustomerForm;
			submitData.items = data.data;

			this.$tools.data.post(this.$options.submitUrl, submitData)
				.then(function(response) {
					this.$components.manage.showResult(response);
				}.bind(this))
				.finally(function() {
					btnDeferred.reject();
				});
		}
	};


/***/ },

/***/ 809:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		_changes: [],

		addLoaded: function(itemsData) {
			var data = this._mapData(itemsData);

			this._changes = data;
		},

		getChanges: function() {
			return this._changes;
		},

		removeItem: function(itemData) {
			var data = this._mapData(itemData)[0];
			var index = this._getItemIndex(data.Model.MaterialId);

			this._changes.splice(index, 1);
		},

		addItem: function(itemData, quantity) {
			var data = this._mapData(itemData, quantity)[0];

			this._changes.push(data);
		},

		changeQuantity: function(itemData, value) {
			var data = this._mapData(itemData)[0];
			var index = this._getItemIndex(data.Model.MaterialId);

			this._changes[index].Quantity = value;
		},

		resetChanges: function() {
			this._changes = [];
		},

		_getItemIndex: function(id) {
			var index;

			this._changes.forEach(function(item, ind) {
				if (item.Model.MaterialId === id) {
					index = ind;
				}
			});

			return index;
		},

		_mapData: function(data, quantity) {
			if (!Array.isArray(data)) {
				data = [data]; // eslint-disable-line no-param-reassign
			}

			return data.map(function(rowData) {
				return {
					Model: rowData.Model,
					Quantity: quantity !== undefined ? quantity : rowData.Count
				};
			});
		}
	};


/***/ },

/***/ 810:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tablesChanges = __webpack_require__(809);
	var baseControl = __webpack_require__(532);

	module.exports = Object.assign({}, baseControl, {
		ready: function() {
			baseControl.init.call(this);
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			var changes = tablesChanges.getChanges();

			return [{
				type: 'changes',
				name: this.$options.column,
				value: changes
			}];
		}
	});


/***/ },

/***/ 811:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tablesChanges = __webpack_require__(809);

	module.exports = {
		events: {
			'click $addItem': '_goToSearch',
			'click $submit': '_submitOrders',
			'refreshItems $ordersTable $$rows': '_refreshItems'
		},

		_goToSearch: function() {
			this.flow.next();
		},

		_submitOrders: function(event) {
			var button = event.component;

			this.$components.resultMessage.close();
			this.$events.trigger('submitOrders', {data: tablesChanges.getChanges(), submitBtn: button});
		},

		_refreshItems: function() {
			this.$events.trigger('refreshItems');
		}
	};


/***/ },

/***/ 812:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tablesChanges = __webpack_require__(809);

	module.exports = {
		events: {
			'loaded $this': '_loaded'
		},

		_loaded: function(event, tableData) {
			tablesChanges.addLoaded(tableData.data.rows);
		}
	};


/***/ },

/***/ 813:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tablesChanges = __webpack_require__(809);

	module.exports = {
		events: {
			'click $$removeItem': '_removeItem',
			'change $$quantity': '_changeQuantity'
		},

		_removeItem: function() {
			tablesChanges.removeItem(this.$options.value);
			this.$events.trigger('refreshItems');
		},

		_changeQuantity: function(event) {
			var value = parseInt(event.target.value, 10);

			tablesChanges.changeQuantity(this.$options.value, value);
			this.$events.trigger('refreshItems');
		}
	};


/***/ },

/***/ 814:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Flow = __webpack_require__(429);
	var tablesChanges = __webpack_require__(809);

	module.exports = {
		events: {
			'refreshItems $$orderSteps': '_reloadTable',
			'showResult $this': 'showResult'
		},

		initialize: function() {
			this.flow = new Flow.FlowController(new Flow.WizardFlowPresenter(this), {
				config: {
					statik: true,
					index: 0,
					infer: function() {
						return {
							next: 'search',
							payload: {}
						};
					}
				},
				search: {
					statik: false,
					index: 1,
					componentContentURL: this.$options.searchUrl,
					infer: function() {
						return {
							next: 'finish',
							payload: {}
						};
					}
				}
			}, this.$events);
		},

		ready: function() {
			this.flow.startWith('config');
		},

		showResult: function(response) {
			var messageComponent = this.$components.config.$components.resultMessage;
			var messageType = response.Success ? 'warning' : 'error';

			messageComponent.setType(messageType);
			messageComponent.setText((response.Data && response.Data.Message) || '');
			messageComponent.open();
		},

		clearOrders: function() {
			tablesChanges.resetChanges();

			this._reloadTable();
		},

		_reloadTable: function() {
			this._manageSubmit();

			this.$components.config.$components.ordersTable.loadTable();
		},

		_manageSubmit: function() {
			var data = tablesChanges.getChanges();

			if (data.length) {
				this.$components.config.$components.submit.enable();
			} else {
				this.$components.config.$components.submit.disable();
			}
		}
	};


/***/ },

/***/ 815:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		events: {
			'click $cancel': '_backToConfig',
			'addItem $searchTable $$rows': '_addItem'
		},

		_backToConfig: function() {
			this.flow.prev();
		},

		_addItem: function() {
			this.$events.trigger('refreshItems');
			this._backToConfig();
		}
	};


/***/ },

/***/ 816:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tablesChanges = __webpack_require__(809);

	module.exports = {
		events: {
			'click $$addItem': '_addItem'
		},

		_addItem: function() {
			tablesChanges.addItem(this.$options.value, 1);
			this.$events.trigger('addItem');
		}
	};


/***/ },

/***/ 817:
/***/ function(module, exports) {

	'use strict';

	/**
	 * This component is used for customer validation in change sim card flow.
	 */
	module.exports = {
		events: {
			'submit $this': 'nextStep',
			'activate $this': '_activate',
			'change $documentType': '_documentTypeChanged'
		},

		ready: function() {
			this._updateNumberInput();
		},

		/**
		 desc: Reset component's state to initial.
		 */
		reset: function() {
			this.$components.documentType.enable();
			this.$components.autoFocusInput.$el.prop('disabled', false);
			this.$components.autoFocusInput.$el[0].value = '';
			this.$components.next.enable();
		},

		_lock: function() {
			this.$components.documentType.disable();
			this.$components.autoFocusInput.$el.prop('disabled', true);
			this.$components.next.disable();
		},

		_showError: function() {
			this.$components.errorMessage.open();
		},

		_hideError: function() {
			this.$components.errorMessage.close();
		},

		_activate: function() {
			this.$components.autoFocusInput.$el.focus();
		},

		nextStep: function() {
			var formComponent = this.$extensions.form;

			if (!formComponent.valid()) {
				return this.$tools.q.reject();
			}

			this._hideError();

			this.$components.next.activityIndicator();

			return this.flow.resetAsync('customer')
				.then(function() {
					this._next();
					this._lock();
				}.bind(this));
		},

		isDataPresent: function() {
			return !!this.$components.autoFocusInput.$el[0].value;
		},

		_getData: function() {
			return this.$extensions.form.serialize();
		},

		_next: function() {
			this.flow.next(this._getData())
				.finally(this.$components.next.resetLoading.bind(this.$components.next))
				.catch(this._showError.bind(this));
		},

		_updateNumberInput: function() {
			var data = this.$components.documentType.getCurrentOption().data();
			var $input = this.$components.autoFocusInput.$el;
			var validator = this.$el.data('validator');
			var inputName = $input.prop('name');

			$input.prop('placeholder', data.placeholder);

			if (data.rgx) {
				validator.settings.rules[inputName].regex = data.rgx;
				validator.settings.messages[inputName].regex = data.errmsg;
			} else {
				delete validator.settings.rules[inputName].regex;
				delete validator.settings.messages[inputName].regex;
			}
		},

		_documentTypeChanged: function() {
			this._updateNumberInput();

			if (this.$components.autoFocusInput.$el.val()) {
				this.$extensions.form.valid();
			}
		}
	};


/***/ },

/***/ 818:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Flow = __webpack_require__(429);
	var changeSim = __webpack_require__(819);

	module.exports = Object.assign({}, changeSim, {
		events: {
			'click $$clear': '_clear',
			'click $cancel': '_cancel',
			'submit $search': '_startSearch',
			'click $confirmationSubmit': '_submitConfirmation',
			'deactivate $sim': '_hideSubmits',
			'submit $sim': '_submit',
			'click $submit': '_submit',
			'click $printContracts': '_getTerms',
			'close $successMessage': '_hideSuccess'
		},
		ready: function() {
			var searchComponent = this.$components.search;
			var customerComponent = this.$components.customer;

			this._setFlow()
				.then(function() {
					if (searchComponent.isDataPresent()) {
						searchComponent.nextStep()
							.then(function() {
								this.flow.states.customer.statik = false;
								this.flow.states.customer.statikRemovable = false;
								if (customerComponent.isDataPresent()) {
									customerComponent.nextStep().then(function() {
										this.flow.states.sim.statik = false;
										this.flow.states.sim.statikRemovable = false;
										if (this.$options.showConfirmation) {
											this._showConfirmationState();
											this.$components.sim.lock();
										}
										this._showSubmitBlock();
									}.bind(this));
								}
							}.bind(this));
					}
				}.bind(this));
		},

		_setFlow: function() {
			this.flow = new Flow.FlowController(new Flow.SheetFlowPresenter(this), {
				search: {
					statik: true,
					index: 0,
					infer: function(data) {
						this._hideSuccess();

						return {
							next: 'customer',
							payload: Object.assign(data, {selector: this.$elements.customerBlock})
						};
					}.bind(this)
				},
				customer: {
					index: 1,
					componentContentURL: this.$options.customerUrl,
					statik: !!this.$components.customer,
					statikRemovable: true,
					infer: function(data) {
						this._showSubmitBlock();

						return {
							next: 'sim',
							payload: Object.assign(data, {selector: this.$elements.simBlock})
						};
					}.bind(this)
				},
				sim: {
					index: 2,
					componentContentURL: this.$options.simUrl,
					statik: !!this.$components.sim,
					statikRemovable: true,
					infer: function(data) {
						return {
							next: 'finish',
							payload: data
						};
					}
				}
			}, this.$events);

			return this.flow.startWith('search');
		},

		_startSearch: function() {
			this.$components.search.nextStep();
		},

		_hideError: function() {
			this.$components.errorMessage.close();
		},

		_showError: function() {
			this.$components.errorMessage.open();
		},

		_clear: function(event) {
			var btnComponent = event.component;

			btnComponent.activityIndicator();

			if (this.$components.confirmationSubmit) {
				this._hideConfirmationState();
			}

			this.$tools.data.post(btnComponent.$options.action)
				.then(
					function() {
						this._hideError();
						this.flow.reset('search');
						this.$components.search.reset();
						this._hideSuccess();
					}.bind(this)
				)
				.catch(this._showError.bind(this))
				.finally(btnComponent.resetLoading.bind(btnComponent));
		},

		_cancel: function(event) {
			var btnComponent = event.component;
			var data = {
				goToPrevStep: btnComponent.$options.goToPrevStep || false
			};

			btnComponent.activityIndicator();

			this.$tools.data.post(btnComponent.$options.action, data)
				.then(
					function() {
						this._hideError();
						this.$components.customer.reset();
						this.flow.prev();
					}.bind(this)
				)
				.catch(this._showError.bind(this))
				.finally(btnComponent.resetLoading.bind(btnComponent));
		},

		_showSubmitBlock: function() {
			this.$elements.submitBlock.show();
		},

		_hideSubmits: function() {
			this.$elements.submitBlock.hide();
		},

		_showConfirmationState: function() {
			this.$components.submit.hide();
			this.$components.confirmationSubmit.show();
			if (this.$options.showPrintButton) {
				this.$components.printContracts.show();
			}
			this.$components.cancel.disable();
		},

		_activateSim: function(simCardData) {
			this.$components.sim.lock();
			this.$tools.data.post(this.$options.activateUrl, simCardData)
				.then(function(res) {
					if (!res.success) {
						this.$components.sim.unlock();
						this._showError();

						return;
					}
					if (this.$options.needsConfirmation) {
						this._getTerms(res.data)
							.then(function() {
								this._showConfirmationState();
							}.bind(this));
					} else {
						this._hideSubmits();
						this._submitted(res);
					}
				}.bind(this))
				.catch(function() {
					this.$components.sim.unlock();
					this._showError();
				}.bind(this))
				.finally(this.$components.submit.resetLoading.bind(this.$components.submit));
		},

		_hideConfirmationState: function() {
			this.$components.submit.show();
			this.$components.confirmationSubmit.hide();
			this.$components.printContracts.hide();
			this.$components.cancel.enable();
		},

		_submitConfirmation: function() {
			this.$components.confirmationSubmit.activityIndicator();

			this.$tools.data.post(this.$options.confirmUrl, this._getConfirmationData())
				.then(function(res) {
					this._hideSubmits();
					this._submitted(res);
				}.bind(this))
				.finally(this.$components.confirmationSubmit.resetLoading.bind(this.$components.confirmationSubmit));
		},
		_openTerms: function(terms) {
			terms.forEach(function(term) {
				this._printDocument(term.TermsData);
			}.bind(this));
		},
		_printDocument: function(data) {
			window.open('data:application/pdf;base64,' + data, '_blank');
		},
		_getTerms: function(data) {
			var dfd = this.$tools.q.defer();

			this._ping(this._getConfirmationData(data))
				.then(function(res) {
					if (res.data.terms && res.data.terms.length) {
						this._openTerms(res.data.terms);
						dfd.resolve();
					}
				}.bind(this));

			return dfd.promise();
		},
		_getConfirmationData: function(data) {
			if (!data) {
				return this.confirmationData || {};
			}

			this.confirmationData = {
				custId: data.custId,
				oseOrderId: data.oseOrderId,
				verisOrderId: data.verisOrderId
			};

			return this.confirmationData;
		},

		_ping: function(data) {
			var dfd = this.$tools.q.defer();

			this._pingConfirmation(data, dfd);

			return dfd.promise();
		},

		_pingConfirmation: function(data, dfd) {
			this.$tools.data.get(this.$options.contractsUrl, data)
				.then(
					function(res) {
						var TIMEOUT_PING = 1000;

						if (res.success) {
							dfd.resolve(res);
						} else {
							setTimeout(function() {
								this._pingConfirmation(data, dfd);
							}.bind(this), TIMEOUT_PING);
						}
					}.bind(this)
				);
		},

		_submitted: function(response) {
			if (!response.success) {
				this._showError();

				return;
			}

			this.html(response.data.html, this.$elements.successBlock)
				.then(this._showSuccess.bind(this));
		},

		_hideSuccess: function() {
			this.$elements.successBlock.hide();
		},

		_showSuccess: function() {
			this.$components.sim.$events.trigger('hideMessage');
			this.$elements.successBlock.show();
			this.$components.successMessage.open();
		}
	});


/***/ },

/***/ 819:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		_submit: function() {
			var simCardData;

			if (!this.$components.sim.valid()) {
				return;
			}

			this._hideError();

			simCardData = this.$components.sim.serialize();

			this.$components.submit.activityIndicator();

			this._activateSim(simCardData);
		}
	};


/***/ },

/***/ 820:
/***/ function(module, exports) {

	'use strict';

	/**
	 * This component is used for search step in change sim card flow.
	 */
	module.exports = {
		events: {},

		/**
		 desc: Detects is element is filled with data.
		 @return boolean
		 */
		isDataPresent: function() {
			return !!this.$elements.searchInput.val();
		},

		/**
		 desc: validates component data.
		 @return boolean
		 */
		isDataValid: function() {
			return this.$extensions.form.valid();
		},

		/**
		 desc: Reset component's state to initial.
		 */
		reset: function() {
			this.$elements.searchInput.val('').focus();
			this._hideError();
		},

		_hideError: function() {
			this.$components.errorMessage.close();
		},

		_showError: function() {
			this.$components.errorMessage.open();
		},

		/**
		 * desc: Activates next step via flow controller.
		 * @returns Promise
	     */
		nextStep: function() {
			if (!this.isDataValid()) {
				return this.$tools.q.reject();
			}

			this._hideError();

			this.$components.next.activityIndicator();

			return this.flow.resetAsync('search')
				.then(this._next.bind(this));
		},

		_next: function() {
			return this.flow.next(this.$extensions.form.serialize())
				.finally(this.$components.next.resetLoading.bind(this.$components.next))
				.catch(this._showError.bind(this));
		}
	};


/***/ },

/***/ 821:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var barcode = __webpack_require__(822);

	module.exports = Object.assign({}, barcode, {
		initialize: function() {
			this.$options.prefix = this.$options.prefix.toString();
		},

		_checkValue: function() {
			var value = this.$el.val();

			if (value.length <= this.$options.minLength || value.indexOf(this.$options.prefix) !== 0) {
				this._triggerChecked();

				return;
			}

			this.$el.val(value.substr(this.$options.prefix.length));

			this._triggerChecked();
		}
	});


/***/ },

/***/ 822:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		events: {
			'scan $this': '_checkValue',
			'change': '_triggerChange'
		},

		_triggerChange: function() {
			this.$events.trigger('onChange');
		},

		_triggerChecked: function() {
			this.$events.trigger('scanSuccess');
		}
	};


/***/ },

/***/ 823:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sim = __webpack_require__(824);
	/**
	 * This component is used for sim card change initiation in change sim card flow.
	 */

	module.exports = Object.assign({}, sim, {
		ready: function() {
			this._reasonChanged();
		},

		/**
		 * desc: Disable component's input and controls.
		 */
		lock: function() {
			this.$components.barcode.$el.prop('disabled', true);
		},

		/**
		 * desc: Enable component's input and controls.
		 */
		unlock: function() {
			this.$components.barcode.$el.prop('disabled', false);
		},

		/**
		 * desc: Validate component's data.
		 * @return boolean
		 */
		valid: function() {
			return this.$extensions.form.valid();
		},

		serialize: function() {
			var data = this.$extensions.form.serialize();

			data.fee = this._fee;

			data[this.$elements.prefix.prop('name')] = this.$elements.prefix.val();

			return data;
		},

		_activate: function() {
			this.$components.barcode.$el.focus();
		},

		_hideMessage: function() {
			this.$components.informMessage.close();
		},

		_reasonChanged: function() {
			var data = this.$extensions.form.serialize();

			this._hideFeeError();
			this._showFeeLoading();

			this.$tools.data.post(this.$options.feeUrl, data)
				.then(this._feeSuccess.bind(this))
				.catch(this._showFeeError.bind(this));
		},

		_showFeeLoading: function() {
			this.$components.fee.hide();
			this.$components.loading.show();
		},

		_hideFeeLoading: function() {
			this.$components.fee.show();
			this.$components.loading.hide();
		},

		_showFeeError: function() {
			this.$components.feeErrorMessage.open();
		},

		_hideFeeError: function() {
			this.$components.feeErrorMessage.close();
		},

		_feeSuccess: function(response) {
			if (!response.success) {
				this._showFeeError();

				return;
			}

			this._fee = response.data.feeValue;

			this.$components.fee.$el.text(response.data.feeValue ?
				response.data.feeDisplayValue :
				this.$components.fee.$options.freeText);
			this._hideFeeLoading();
		}
	});


/***/ },

/***/ 824:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		events: {
			'scanSuccess $barcode': '_scan',
			'hideMessage $this': '_hideMessage',
			'activate $this': '_activate',
			'change $reasonCode': '_reasonChanged'
		},

		_scan: function() {
			this.$elements.prefix.prop('disabled', true);
		}
	};


/***/ },

/***/ 825:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Report transfers page controller
	type: controller
	desc: >
		Page controller for Transfers -> report transfers page.
		Expects that rows of the reportTable has `SAP::transfers/report-transfers/item` extension. See its doc for details

	*/
	module.exports = {
		events: {
			'revoke $reportTable $$rows': '_onRevoke'
		},

		_onRevoke: function(ev, data) {
			this._hideErrorMessage();
			this.$tools.data.post(data.url)
				.then(function(res) {
					if (res.success) {
						this.$components.reportTable.loadTable();
					} else {
						this._showErrorMessage(res.errorMessages.join('<br/>'));
					}

					data.loading.reject();
				}.bind(this))
				.catch(function() {
					data.loading.reject();
				});
		},

		_showErrorMessage: function(message) {
			this.$components.errorMessage.showValidationMessage(message);
		},

		_hideErrorMessage: function() {
			this.$components.errorMessage.hideValidationMessage();
		}
	};


/***/ },

/***/ 826:
/***/ function(module, exports) {

	'use strict';

	/**
	name: transfer item controller for report transfers table
	type: controller
	desc: >
		Simple controller that triggers `revoke` event when revoke button is clicked.
		By a convention it sends `url` and `loading` deferred wrapped in payload object.
		Page controller is reponsible for revokation, error handling and button spinner control.
	*/

	module.exports = {
		events: {
			'click $revokeButton': '_onRevokeButtonClick'
		},

		_onRevokeButtonClick: function(event) {
			var button = event.component;
			var loading = button.activityIndicator();

			this.$events.trigger('revoke',
				{
					url: button.$options.url,
					loading: loading
				});
		}
	};


/***/ }

});