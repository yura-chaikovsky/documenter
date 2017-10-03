webpackJsonp([10],{

/***/ 373:
/***/ function(module, exports) {

	'use strict';

	var ATTRIBUTES = {
		loading: 'data-loading',
		loaded: 'data-loaded',
		disabledKey: 'disabled',
		disabledValue: 'disabled'
	};

	var CLASSES = {
		linkDisabled: 'hidden-event'
	};

	/**
	name: Button
	type: ui
	desc: Pretty button with processing indication.
	options:
		submit: Boolean. If it's `true` than click on button will submit the form.
		setLoading: Boolean. If it's `true` than click on button will set loading state.
	events:
		click: Fires by click on button except when `submit` attribute was specified.
		loadedclick: Fires by click on button in `loaded` state.
		actionFinished: Fires when `loading` state was changed to any `loaded` or `default`.
	 */
	module.exports = {
		events: {
			'click': '_onClick'
		},

		/**
		 desc: Gets or sets button's label.
		 */
		text: function() {
			if (arguments.length) {
				return this.$el.find('.button__label').text(arguments[0]);
			}

			return this.$el.find('.button__label').text();
		},
		/**
		 desc: Switches button to `loading` state. Returns Promise that allows to stop loading.
		 */
		activityIndicator: function() {
			var dfd = this.$tools.q.defer();

			this._loading();

			dfd.then(this._loadedWithSuccess.bind(this), this._loadedWithError.bind(this));

			return dfd;
		},
		/**
		 desc: Enables button.
		 */
		enable: function() {
			this.$el.removeAttr(ATTRIBUTES.disabledKey);
			this.$el.removeClass(CLASSES.linkDisabled);
		},
		/**
		 desc: Disables button.
		 */
		disable: function() {
			this.$el.attr(ATTRIBUTES.disabledKey, ATTRIBUTES.disabledValue);

			if (this.$el[0].tagName.toLowerCase() === 'a') {
				this.$el.addClass(CLASSES.linkDisabled);
			}
		},
		/**
		 desc: Sets `loaded` state.
		 */
		setAsLoaded: function() {
			this.$el.removeAttr(ATTRIBUTES.loading);

			this._loadedWithSuccess();
		},
		/**
		 desc: Checks that button was switched to `loaded` state.
		 */
		isLoaded: function() {
			return this.$el.is('[' + ATTRIBUTES.loaded + ']');
		},
		/**
		 desc: Checks that button was switched to `loading` state.
		 */
		isLoading: function() {
			return this.$el.is('[' + ATTRIBUTES.loading + ']');
		},
		/**
		 desc: Set button to loading state.
		 */
		setLoading: function() {
			this._loading();
		},
		/**
		 desc: Resets button to default state.
		 */
		resetLoading: function() {
			this.$el
				.removeAttr(ATTRIBUTES.loading)
				.removeAttr(ATTRIBUTES.loaded);

			this.$events.trigger('actionFinished');
		},

		_onClick: function(event) {
			if (this.isLoading()) {
				event.preventDefault(); // fixed firefox click

				return;
			}

			if (this.isLoaded()) {
				this.$events.trigger('loadedclick');

				event.preventDefault(); // fixed firefox click

				return;
			}

			if ('setLoading' in this.$options) {
				this.setLoading();
			}

			if ('submit' in this.$options) {
				this.$el.closest('form').submit();
			} else {
				this.$events.trigger('click');
			}
		},

		_loading: function() {
			this.$el
				.removeAttr(ATTRIBUTES.loaded)
				.attr(ATTRIBUTES.loading, true);
		},

		_loadedWithSuccess: function() {
			this.$el
				.removeAttr(ATTRIBUTES.loading)
				.attr(ATTRIBUTES.loaded, true);

			this.$events.trigger('actionFinished');
		},

		_loadedWithError: function() {
			this.$el
				.removeAttr(ATTRIBUTES.loading);

			this.$events.trigger('actionFinished');
		}
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

/***/ 462:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(463);


/***/ },

/***/ 463:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./amchart/amcharts/amcharts.js": 464,
		"./amchart/amcharts/gauge.js": 465,
		"./amchart/amcharts/pie.js": 466,
		"./amchart/amcharts/serial.js": 467,
		"./amchart/bars/index.js": 468,
		"./amchart/helper.js": 469,
		"./amchart/line/index.js": 472,
		"./amchart/theme.js": 470,
		"./autocomplete/index.js": 473,
		"./button/exclusive-action/index.js": 475,
		"./button/index.js": 373,
		"./carousel/gallery/flat-gallery.js": 476,
		"./carousel/gallery/gallery-slide.js": 477,
		"./carousel/gallery/loop-gallery.js": 479,
		"./carousel/helpers/style-helper.js": 478,
		"./carousel/index.js": 480,
		"./checkbox/index.js": 482,
		"./collapse/index.js": 483,
		"./datepicker/base.js": 484,
		"./datepicker/desktop.js": 485,
		"./datepicker/index.js": 491,
		"./datepicker/mobile.js": 492,
		"./datepicker/pluginWrapper.js": 486,
		"./datepicker/utils.js": 487,
		"./dropdown/index.js": 493,
		"./element/index.js": 494,
		"./element/jq-plugins/jquery.datepick.js": 489,
		"./element/jq-plugins/jquery.plugin.js": 490,
		"./element/jqWrapper.js": 349,
		"./element/public.js": 348,
		"./filtering-bar/index.js": 495,
		"./filtering-bar/multiple-categories/index.js": 496,
		"./form/index.js": 497,
		"./form/search/index.js": 498,
		"./form/validation/adapters.js": 499,
		"./form/validation/index.js": 500,
		"./form/validation/message/index.js": 502,
		"./form/validation/methods.js": 501,
		"./loader/index.js": 503,
		"./masked-input/index.js": 505,
		"./message/index.js": 506,
		"./modal-box/confirmation/index.js": 507,
		"./modal-box/external-content/index.js": 508,
		"./modal-box/helper.js": 510,
		"./modal-box/index.js": 511,
		"./number/index.js": 512,
		"./pager/index.js": 514,
		"./progress-tracker/index.js": 518,
		"./radio/index.js": 519,
		"./range-slider/index.js": 520,
		"./range-slider/point/index.js": 521,
		"./range-slider/select/index.js": 522,
		"./scroll-to/index.js": 523,
		"./select/dropdown/index.js": 524,
		"./select/index.js": 525,
		"./speech-bubble/index.js": 526,
		"./switcher/index.js": 527,
		"./tab-panel/index.js": 528,
		"./tables/body/index.js": 530,
		"./tables/filters/checkbox/index.js": 531,
		"./tables/filters/control/index.js": 532,
		"./tables/filters/dataset/index.js": 533,
		"./tables/filters/date-range/index.js": 534,
		"./tables/filters/index.js": 535,
		"./tables/filters/multi/group/index.js": 536,
		"./tables/filters/multi/index.js": 537,
		"./tables/filters/search/index.js": 538,
		"./tables/filters/select/index.js": 539,
		"./tables/header/cell/index.js": 540,
		"./tables/header/index.js": 541,
		"./tables/index.js": 542,
		"./tables/insertable/index.js": 544,
		"./tables/lengthable/index.js": 545,
		"./tables/linkable/index.js": 546,
		"./tables/linkable/redirect/index.js": 547,
		"./tables/pagable/index.js": 548,
		"./tables/selectable/index.js": 549,
		"./tooltip/index.js": 550,
		"./tooltip/position-service.js": 551,
		"./type-watch/index.js": 552,
		"./video/index.js": 553
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
	webpackContext.id = 463;


/***/ },

/***/ 464:
/***/ function(module, exports) {

	if(!AmCharts)var AmCharts={themes:{},maps:{},inheriting:{},charts:[],onReadyArray:[],useUTC:!1,updateRate:40,uid:0,lang:{},translations:{},mapTranslations:{},windows:{},initHandlers:[]};
	AmCharts.Class=function(a){var b=function(){arguments[0]!==AmCharts.inheriting&&(this.events={},this.construct.apply(this,arguments))};a.inherits?(b.prototype=new a.inherits(AmCharts.inheriting),b.base=a.inherits.prototype,delete a.inherits):(b.prototype.createEvents=function(){for(var a=0,b=arguments.length;a<b;a++)this.events[arguments[a]]=[]},b.prototype.listenTo=function(a,b,c){this.removeListener(a,b,c);a.events[b].push({handler:c,scope:this})},b.prototype.addListener=function(a,b,c){this.removeListener(this,
		a,b);this.events[a].push({handler:b,scope:c})},b.prototype.removeListener=function(a,b,c){if(a&&a.events)for(a=a.events[b],b=a.length-1;0<=b;b--)a[b].handler===c&&a.splice(b,1)},b.prototype.fire=function(a,b){for(var c=this.events[a],g=0,h=c.length;g<h;g++){var k=c[g];k.handler.call(k.scope,b)}});for(var c in a)b.prototype[c]=a[c];return b};AmCharts.addChart=function(a){AmCharts.charts.push(a)};AmCharts.removeChart=function(a){for(var b=AmCharts.charts,c=b.length-1;0<=c;c--)b[c]==a&&b.splice(c,1)};
	AmCharts.isModern=!0;AmCharts.getIEVersion=function(){var a=0;if("Microsoft Internet Explorer"==navigator.appName){var b=navigator.userAgent,c=/MSIE ([0-9]{1,}[.0-9]{0,})/;null!=c.exec(b)&&(a=parseFloat(RegExp.$1))}else"Netscape"==navigator.appName&&(b=navigator.userAgent,c=/Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/,null!=c.exec(b)&&(a=parseFloat(RegExp.$1)));return a};
	AmCharts.applyLang=function(a,b){var c=AmCharts.translations;b.dayNames=AmCharts.dayNames;b.shortDayNames=AmCharts.shortDayNames;b.monthNames=AmCharts.monthNames;b.shortMonthNames=AmCharts.shortMonthNames;c&&(c=c[a])&&(AmCharts.lang=c,c.monthNames&&(b.dayNames=c.dayNames,b.shortDayNames=c.shortDayNames,b.monthNames=c.monthNames,b.shortMonthNames=c.shortMonthNames))};AmCharts.IEversion=AmCharts.getIEVersion();9>AmCharts.IEversion&&0<AmCharts.IEversion&&(AmCharts.isModern=!1,AmCharts.isIE=!0);
	AmCharts.dx=0;AmCharts.dy=0;if(document.addEventListener||window.opera)AmCharts.isNN=!0,AmCharts.isIE=!1,AmCharts.dx=.5,AmCharts.dy=.5;document.attachEvent&&(AmCharts.isNN=!1,AmCharts.isIE=!0,AmCharts.isModern||(AmCharts.dx=0,AmCharts.dy=0));window.chrome&&(AmCharts.chrome=!0);AmCharts.handleResize=function(){for(var a=AmCharts.charts,b=0;b<a.length;b++){var c=a[b];c&&c.div&&c.handleResize()}};AmCharts.handleMouseUp=function(a){for(var b=AmCharts.charts,c=0;c<b.length;c++){var d=b[c];d&&d.handleReleaseOutside(a)}};
	AmCharts.handleMouseMove=function(a){for(var b=AmCharts.charts,c=0;c<b.length;c++){var d=b[c];d&&d.handleMouseMove(a)}};AmCharts.resetMouseOver=function(){for(var a=AmCharts.charts,b=0;b<a.length;b++){var c=a[b];c&&(c.mouseIsOver=!1)}};AmCharts.ready=function(a){AmCharts.onReadyArray.push(a)};AmCharts.handleLoad=function(){AmCharts.isReady=!0;for(var a=AmCharts.onReadyArray,b=0;b<a.length;b++){var c=a[b];isNaN(AmCharts.processDelay)?c():setTimeout(c,AmCharts.processDelay*b)}};
	AmCharts.addInitHandler=function(a,b){AmCharts.initHandlers.push({method:a,types:b})};AmCharts.callInitHandler=function(a){var b=AmCharts.initHandlers;if(AmCharts.initHandlers)for(var c=0;c<b.length;c++){var d=b[c];d.types&&-1!=d.types.indexOf(a.type)&&d.method(a)}};AmCharts.getUniqueId=function(){AmCharts.uid++;return"AmChartsEl-"+AmCharts.uid};
	AmCharts.isNN&&(document.addEventListener("mousemove",AmCharts.handleMouseMove,!0),window.addEventListener("resize",AmCharts.handleResize,!0),document.addEventListener("mouseup",AmCharts.handleMouseUp,!0),window.addEventListener("load",AmCharts.handleLoad,!0));AmCharts.isIE&&(document.attachEvent("onmousemove",AmCharts.handleMouseMove),window.attachEvent("onresize",AmCharts.handleResize),document.attachEvent("onmouseup",AmCharts.handleMouseUp),window.attachEvent("onload",AmCharts.handleLoad));
	AmCharts.clear=function(){var a=AmCharts.charts;if(a)for(var b=0;b<a.length;b++)a[b].clear();AmCharts.charts=null;AmCharts.isNN&&(document.removeEventListener("mousemove",AmCharts.handleMouseMove,!0),window.removeEventListener("resize",AmCharts.handleResize,!0),document.removeEventListener("mouseup",AmCharts.handleMouseUp,!0),window.removeEventListener("load",AmCharts.handleLoad,!0));AmCharts.isIE&&(document.detachEvent("onmousemove",AmCharts.handleMouseMove),window.detachEvent("onresize",AmCharts.handleResize),
		document.detachEvent("onmouseup",AmCharts.handleMouseUp),window.detachEvent("onload",AmCharts.handleLoad))};
	AmCharts.makeChart=function(a,b,c){var d=b.type,e=b.theme;AmCharts.isString(e)&&(e=AmCharts.themes[e],b.theme=e);var f;switch(d){case "serial":f=new AmCharts.AmSerialChart(e);break;case "xy":f=new AmCharts.AmXYChart(e);break;case "pie":f=new AmCharts.AmPieChart(e);break;case "radar":f=new AmCharts.AmRadarChart(e);break;case "gauge":f=new AmCharts.AmAngularGauge(e);break;case "funnel":f=new AmCharts.AmFunnelChart(e);break;case "map":f=new AmCharts.AmMap(e);break;case "stock":f=new AmCharts.AmStockChart(e)}AmCharts.extend(f,
		b);AmCharts.isReady?isNaN(c)?f.write(a):setTimeout(function(){AmCharts.realWrite(f,a)},c):AmCharts.ready(function(){isNaN(c)?f.write(a):setTimeout(function(){AmCharts.realWrite(f,a)},c)});return f};AmCharts.realWrite=function(a,b){a.write(b)};AmCharts.toBoolean=function(a,b){if(void 0===a)return b;switch(String(a).toLowerCase()){case "true":case "yes":case "1":return!0;case "false":case "no":case "0":case null:return!1;default:return Boolean(a)}};AmCharts.removeFromArray=function(a,b){var c;for(c=a.length-1;0<=c;c--)a[c]==b&&a.splice(c,1)};AmCharts.getDecimals=function(a){var b=0;isNaN(a)||(a=String(a),-1!=a.indexOf("e-")?b=Number(a.split("-")[1]):-1!=a.indexOf(".")&&(b=a.split(".")[1].length));return b};
	AmCharts.wrappedText=function(a,b,c,d,e,f,g,h,k){var l=AmCharts.text(a,b,c,d,e,f,g),m="\n";AmCharts.isModern||(m="<br>");if(10<k)return l;if(l){var n=l.getBBox();if(n.width>h){l.remove();for(var l=[],p=0;-1<(index=b.indexOf(" ",p));)l.push(index),p=index+1;for(var q=Math.round(b.length/2),r=1E3,s,p=0;p<l.length;p++){var w=Math.abs(l[p]-q);w<r&&(s=l[p],r=w)}if(isNaN(s)){h=Math.ceil(n.width/h);if(0==k)for(p=1;p<h;p++)s=Math.round(b.length/h*p),b=b.substr(0,s)+m+b.substr(s);return AmCharts.text(a,b,
		c,d,e,f,g)}b=b.substr(0,s)+m+b.substr(s+1);return AmCharts.wrappedText(a,b,c,d,e,f,g,h,k+1)}return l}};AmCharts.getStyle=function(a,b){var c="";document.defaultView&&document.defaultView.getComputedStyle?c=document.defaultView.getComputedStyle(a,"").getPropertyValue(b):a.currentStyle&&(b=b.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()}),c=a.currentStyle[b]);return c};AmCharts.removePx=function(a){if(void 0!=a)return Number(a.substring(0,a.length-2))};
	AmCharts.getURL=function(a,b){if(a)if("_self"!=b&&b)if("_top"==b&&window.top)window.top.location.href=a;else if("_parent"==b&&window.parent)window.parent.location.href=a;else if("_blank"==b)window.open(a);else{var c=document.getElementsByName(b)[0];c?c.src=a:(c=AmCharts.windows[b])?c.opener&&!c.opener.closed?c.location.href=a:AmCharts.windows[b]=window.open(a):AmCharts.windows[b]=window.open(a)}else window.location.href=a};AmCharts.ifArray=function(a){return a&&0<a.length?!0:!1};
	AmCharts.callMethod=function(a,b){var c;for(c=0;c<b.length;c++){var d=b[c];if(d){if(d[a])d[a]();var e=d.length;if(0<e){var f;for(f=0;f<e;f++){var g=d[f];if(g&&g[a])g[a]()}}}}};AmCharts.toNumber=function(a){return"number"==typeof a?a:Number(String(a).replace(/[^0-9\-.]+/g,""))};
	AmCharts.toColor=function(a){if(""!==a&&void 0!==a)if(-1!=a.indexOf(",")){a=a.split(",");var b;for(b=0;b<a.length;b++){var c=a[b].substring(a[b].length-6,a[b].length);a[b]="#"+c}}else a=a.substring(a.length-6,a.length),a="#"+a;return a};AmCharts.toCoordinate=function(a,b,c){var d;void 0!==a&&(a=String(a),c&&c<b&&(b=c),d=Number(a),-1!=a.indexOf("!")&&(d=b-Number(a.substr(1))),-1!=a.indexOf("%")&&(d=b*Number(a.substr(0,a.length-1))/100));return d};
	AmCharts.fitToBounds=function(a,b,c){a<b&&(a=b);a>c&&(a=c);return a};AmCharts.isDefined=function(a){return void 0===a?!1:!0};AmCharts.stripNumbers=function(a){return a.replace(/[0-9]+/g,"")};AmCharts.roundTo=function(a,b){if(0>b)return a;var c=Math.pow(10,b);return Math.round(a*c)/c};AmCharts.toFixed=function(a,b){var c=String(Math.round(a*Math.pow(10,b)));if(0<b){var d=c.length;if(d<b){var e;for(e=0;e<b-d;e++)c="0"+c}d=c.substring(0,c.length-b);""===d&&(d=0);return d+"."+c.substring(c.length-b,c.length)}return String(c)};
	AmCharts.formatDuration=function(a,b,c,d,e,f){var g=AmCharts.intervals,h=f.decimalSeparator;if(a>=g[b].contains){var k=a-Math.floor(a/g[b].contains)*g[b].contains;"ss"==b&&(k=AmCharts.formatNumber(k,f),1==k.split(h)[0].length&&(k="0"+k));("mm"==b||"hh"==b)&&10>k&&(k="0"+k);c=k+""+d[b]+""+c;a=Math.floor(a/g[b].contains);b=g[b].nextInterval;return AmCharts.formatDuration(a,b,c,d,e,f)}"ss"==b&&(a=AmCharts.formatNumber(a,f),1==a.split(h)[0].length&&(a="0"+a));("mm"==b||"hh"==b)&&10>a&&(a="0"+a);c=a+""+
		d[b]+""+c;if(g[e].count>g[b].count)for(a=g[b].count;a<g[e].count;a++)b=g[b].nextInterval,"ss"==b||"mm"==b||"hh"==b?c="00"+d[b]+""+c:"DD"==b&&(c="0"+d[b]+""+c);":"==c.charAt(c.length-1)&&(c=c.substring(0,c.length-1));return c};
	AmCharts.formatNumber=function(a,b,c,d,e){a=AmCharts.roundTo(a,b.precision);isNaN(c)&&(c=b.precision);var f=b.decimalSeparator;b=b.thousandsSeparator;var g;g=0>a?"-":"";a=Math.abs(a);var h=String(a),k=!1;-1!=h.indexOf("e")&&(k=!0);0<=c&&!k&&(h=AmCharts.toFixed(a,c));var l="";if(k)l=h;else{var h=h.split("."),k=String(h[0]),m;for(m=k.length;0<=m;m-=3)l=m!=k.length?0!==m?k.substring(m-3,m)+b+l:k.substring(m-3,m)+l:k.substring(m-3,m);void 0!==h[1]&&(l=l+f+h[1]);void 0!==c&&0<c&&"0"!=l&&(l=AmCharts.addZeroes(l,
		f,c))}l=g+l;""===g&&!0===d&&0!==a&&(l="+"+l);!0===e&&(l+="%");return l};AmCharts.addZeroes=function(a,b,c){a=a.split(b);void 0===a[1]&&0<c&&(a[1]="0");return a[1].length<c?(a[1]+="0",AmCharts.addZeroes(a[0]+b+a[1],b,c)):void 0!==a[1]?a[0]+b+a[1]:a[0]};
	AmCharts.scientificToNormal=function(a){var b;a=String(a).split("e");var c;if("-"==a[1].substr(0,1)){b="0.";for(c=0;c<Math.abs(Number(a[1]))-1;c++)b+="0";b+=a[0].split(".").join("")}else{var d=0;b=a[0].split(".");b[1]&&(d=b[1].length);b=a[0].split(".").join("");for(c=0;c<Math.abs(Number(a[1]))-d;c++)b+="0"}return b};
	AmCharts.toScientific=function(a,b){if(0===a)return"0";var c=Math.floor(Math.log(Math.abs(a))*Math.LOG10E);Math.pow(10,c);mantissa=String(mantissa).split(".").join(b);return String(mantissa)+"e"+c};AmCharts.randomColor=function(){return"#"+("00000"+(16777216*Math.random()<<0).toString(16)).substr(-6)};
	AmCharts.hitTest=function(a,b,c){var d=!1,e=a.x,f=a.x+a.width,g=a.y,h=a.y+a.height,k=AmCharts.isInRectangle;d||(d=k(e,g,b));d||(d=k(e,h,b));d||(d=k(f,g,b));d||(d=k(f,h,b));d||!0===c||(d=AmCharts.hitTest(b,a,!0));return d};AmCharts.isInRectangle=function(a,b,c){return a>=c.x-5&&a<=c.x+c.width+5&&b>=c.y-5&&b<=c.y+c.height+5?!0:!1};AmCharts.isPercents=function(a){if(-1!=String(a).indexOf("%"))return!0};
	AmCharts.findPosX=function(a){var b=a,c=a.offsetLeft;if(a.offsetParent){for(;a=a.offsetParent;)c+=a.offsetLeft;for(;(b=b.parentNode)&&b!=document.body;)c-=b.scrollLeft||0}return c};AmCharts.findPosY=function(a){var b=a,c=a.offsetTop;if(a.offsetParent){for(;a=a.offsetParent;)c+=a.offsetTop;for(;(b=b.parentNode)&&b!=document.body;)c-=b.scrollTop||0}return c};AmCharts.findIfFixed=function(a){if(a.offsetParent)for(;a=a.offsetParent;)if("fixed"==AmCharts.getStyle(a,"position"))return!0;return!1};
	AmCharts.findIfAuto=function(a){return a.style&&"auto"==AmCharts.getStyle(a,"overflow")?!0:a.parentNode?AmCharts.findIfAuto(a.parentNode):!1};AmCharts.findScrollLeft=function(a,b){a.scrollLeft&&(b+=a.scrollLeft);return a.parentNode?AmCharts.findScrollLeft(a.parentNode,b):b};AmCharts.findScrollTop=function(a,b){a.scrollTop&&(b+=a.scrollTop);return a.parentNode?AmCharts.findScrollTop(a.parentNode,b):b};
	AmCharts.formatValue=function(a,b,c,d,e,f,g,h){if(b){void 0===e&&(e="");var k;for(k=0;k<c.length;k++){var l=c[k],m=b[l];void 0!==m&&(m=f?AmCharts.addPrefix(m,h,g,d):AmCharts.formatNumber(m,d),a=a.replace(new RegExp("\\[\\["+e+""+l+"\\]\\]","g"),m))}}return a};AmCharts.formatDataContextValue=function(a,b){if(a){var c=a.match(/\[\[.*?\]\]/g),d;for(d=0;d<c.length;d++){var e=c[d],e=e.substr(2,e.length-4);void 0!==b[e]&&(a=a.replace(new RegExp("\\[\\["+e+"\\]\\]","g"),b[e]))}}return a};
	AmCharts.massReplace=function(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];void 0===d&&(d="");a=a.replace(c,d)}return a};AmCharts.cleanFromEmpty=function(a){return a.replace(/\[\[[^\]]*\]\]/g,"")};
	AmCharts.addPrefix=function(a,b,c,d,e){var f=AmCharts.formatNumber(a,d),g="",h,k,l;if(0===a)return"0";0>a&&(g="-");a=Math.abs(a);if(1<a)for(h=b.length-1;-1<h;h--){if(a>=b[h].number&&(k=a/b[h].number,l=Number(d.precision),1>l&&(l=1),c=AmCharts.roundTo(k,l),l=AmCharts.formatNumber(c,{precision:-1,decimalSeparator:d.decimalSeparator,thousandsSeparator:d.thousandsSeparator}),!e||k==c)){f=g+""+l+""+b[h].prefix;break}}else for(h=0;h<c.length;h++)if(a<=c[h].number){k=a/c[h].number;l=Math.abs(Math.round(Math.log(k)*
		Math.LOG10E));k=AmCharts.roundTo(k,l);f=g+""+k+""+c[h].prefix;break}return f};AmCharts.remove=function(a){a&&a.remove()};AmCharts.recommended=function(){var a="js";document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")||swfobject&&swfobject.hasFlashPlayerVersion("8")&&(a="flash");return a};AmCharts.getEffect=function(a){">"==a&&(a="easeOutSine");"<"==a&&(a="easeInSine");"elastic"==a&&(a="easeOutElastic");return a};
	AmCharts.getObjById=function(a,b){var c,d;for(d=0;d<a.length;d++){var e=a[d];e.id==b&&(c=e)}return c};AmCharts.applyTheme=function(a,b,c){b||(b=AmCharts.theme);b&&b[c]&&AmCharts.extend(a,b[c])};AmCharts.isString=function(a){return"string"==typeof a?!0:!1};AmCharts.extend=function(a,b,c){for(var d in b)c?a.hasOwnProperty(d)||(a[d]=b[d]):a[d]=b[d];return a};
	AmCharts.copyProperties=function(a,b){for(var c in a)a.hasOwnProperty(c)&&"events"!=c&&void 0!==a[c]&&"function"!=typeof a[c]&&"cname"!=c&&(b[c]=a[c])};AmCharts.processObject=function(a,b,c){!1===a instanceof b&&(a=AmCharts.extend(new b(c),a));return a};AmCharts.fixNewLines=function(a){var b=RegExp("\\n","g");a&&(a=a.replace(b,"<br />"));return a};AmCharts.fixBrakes=function(a){if(AmCharts.isModern){var b=RegExp("<br>","g");a&&(a=a.replace(b,"\n"))}else a=AmCharts.fixNewLines(a);return a};
	AmCharts.deleteObject=function(a,b){if(a){if(void 0===b||null===b)b=20;if(0!==b)if("[object Array]"===Object.prototype.toString.call(a))for(var c=0;c<a.length;c++)AmCharts.deleteObject(a[c],b-1),a[c]=null;else if(a&&!a.tagName)try{for(c in a)a[c]&&("object"==typeof a[c]&&AmCharts.deleteObject(a[c],b-1),"function"!=typeof a[c]&&(a[c]=null))}catch(d){}}};
	AmCharts.bounce=function(a,b,c,d,e){return(b/=e)<1/2.75?7.5625*d*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c};AmCharts.easeInSine=function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c};AmCharts.easeOutSine=function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c};
	AmCharts.easeOutElastic=function(a,b,c,d,e){a=1.70158;var f=0,g=d;if(0===b)return c;if(1==(b/=e))return c+d;f||(f=.3*e);g<Math.abs(d)?(g=d,a=f/4):a=f/(2*Math.PI)*Math.asin(d/g);return g*Math.pow(2,-10*b)*Math.sin(2*(b*e-a)*Math.PI/f)+d+c};AmCharts.AxisBase=AmCharts.Class({construct:function(a){this.createEvents("clickItem","rollOverItem","rollOutItem");this.viY=this.viX=this.y=this.x=this.dy=this.dx=0;this.axisThickness=1;this.axisColor="#000000";this.axisAlpha=1;this.gridCount=this.tickLength=5;this.gridAlpha=.15;this.gridThickness=1;this.gridColor="#000000";this.dashLength=0;this.labelFrequency=1;this.showLastLabel=this.showFirstLabel=!0;this.fillColor="#FFFFFF";this.fillAlpha=0;this.labelsEnabled=!0;this.labelRotation=0;this.autoGridCount=
		!0;this.valueRollOverColor="#CC0000";this.offset=0;this.guides=[];this.visible=!0;this.counter=0;this.guides=[];this.ignoreAxisWidth=this.inside=!1;this.minHorizontalGap=75;this.minVerticalGap=35;this.titleBold=!0;this.minorGridEnabled=!1;this.minorGridAlpha=.07;this.autoWrap=!1;this.titleAlign="middle";this.labelOffset=0;AmCharts.applyTheme(this,a,"AxisBase")},zoom:function(a,b){this.start=a;this.end=b;this.dataChanged=!0;this.draw()},fixAxisPosition:function(){var a=this.position;"H"==this.orientation?
		("left"==a&&(a="bottom"),"right"==a&&(a="top")):("bottom"==a&&(a="left"),"top"==a&&(a="right"));this.position=a},draw:function(){var a=this.chart;this.allLabels=[];this.counter=0;this.destroy();this.fixAxisPosition();this.labels=[];var b=a.container,c=b.set();a.gridSet.push(c);this.set=c;b=b.set();a.axesLabelsSet.push(b);this.labelsSet=b;this.axisLine=new this.axisRenderer(this);this.autoGridCount?("V"==this.orientation?(a=this.height/this.minVerticalGap,3>a&&(a=3)):a=this.width/this.minHorizontalGap,
		this.gridCountR=Math.max(a,1)):this.gridCountR=this.gridCount;this.axisWidth=this.axisLine.axisWidth;this.addTitle()},setOrientation:function(a){this.orientation=a?"H":"V"},addTitle:function(){var a=this.title;if(a){var b=this.chart,c=this.titleColor;void 0===c&&(c=b.color);var d=this.titleFontSize;isNaN(d)&&(d=b.fontSize+1);this.titleLabel=AmCharts.text(b.container,a,c,b.fontFamily,d,this.titleAlign,this.titleBold)}},positionTitle:function(){var a=this.titleLabel;if(a){var b,c,d=this.labelsSet,e=
	{};0<d.length()?e=d.getBBox():(e.x=0,e.y=0,e.width=this.viW,e.height=this.viH);d.push(a);var d=e.x,f=e.y;AmCharts.VML&&(this.rotate?d-=this.x:f-=this.y);var g=e.width,e=e.height,h=this.viW,k=this.viH,l=0,m=a.getBBox().height/2,n=this.inside,p=this.titleAlign;switch(this.position){case "top":b="left"==p?-1:"right"==p?h:h/2;c=f-10-m;break;case "bottom":b="left"==p?-1:"right"==p?h:h/2;c=f+e+10+m;break;case "left":b=d-10-m;n&&(b-=5);c="left"==p?k+1:"right"==p?-1:k/2;l=-90;break;case "right":b=d+g+10+
		m-3,n&&(b+=7),c="left"==p?k+2:"right"==p?-2:k/2,l=-90}this.marginsChanged?(a.translate(b,c),this.tx=b,this.ty=c):a.translate(this.tx,this.ty);this.marginsChanged=!1;0!==l&&a.rotate(l)}},pushAxisItem:function(a,b){var c=this,d=a.graphics();0<d.length()&&(b?c.labelsSet.push(d):c.set.push(d));if(d=a.getLabel())this.labelsSet.push(d),d.click(function(b){c.handleMouse(b,a,"clickItem")}).mouseover(function(b){c.handleMouse(b,a,"rollOverItem")}).mouseout(function(b){c.handleMouse(b,a,"rollOutItem")})},handleMouse:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             b,c){this.fire(c,{type:c,value:b.value,serialDataItem:b.serialDataItem,axis:this,target:b.label,chart:this.chart,event:a})},addGuide:function(a){for(var b=this.guides,c=!1,d=0;d<b.length;d++)b[d]==a&&(c=!0);c||b.push(a)},removeGuide:function(a){var b=this.guides,c;for(c=0;c<b.length;c++)b[c]==a&&b.splice(c,1)},handleGuideOver:function(a){clearTimeout(this.chart.hoverInt);var b=a.graphics.getBBox(),c=b.x+b.width/2,b=b.y+b.height/2,d=a.fillColor;void 0===d&&(d=a.lineColor);this.chart.showBalloon(a.balloonText,
		d,!0,c,b)},handleGuideOut:function(a){this.chart.hideBalloon()},addEventListeners:function(a,b){var c=this;a.mouseover(function(){c.handleGuideOver(b)});a.mouseout(function(){c.handleGuideOut(b)})},getBBox:function(){var a=this.labelsSet.getBBox();AmCharts.VML||(a={x:a.x+this.x,y:a.y+this.y,width:a.width,height:a.height});return a},destroy:function(){AmCharts.remove(this.set);AmCharts.remove(this.labelsSet);var a=this.axisLine;a&&AmCharts.remove(a.set);AmCharts.remove(this.grid0)}});AmCharts.ValueAxis=AmCharts.Class({inherits:AmCharts.AxisBase,construct:function(a){this.cname="ValueAxis";this.createEvents("axisChanged","logarithmicAxisFailed","axisSelfZoomed","axisZoomed");AmCharts.ValueAxis.base.construct.call(this,a);this.dataChanged=!0;this.stackType="none";this.position="left";this.unitPosition="right";this.recalculateToPercents=this.includeHidden=this.includeGuidesInMinMax=this.integersOnly=!1;this.durationUnits={DD:"d. ",hh:":",mm:":",ss:""};this.scrollbar=!1;this.baseValue=
		0;this.radarCategoriesEnabled=!0;this.gridType="polygons";this.useScientificNotation=!1;this.axisTitleOffset=10;this.minMaxMultiplier=1;this.logGridLimit=2;AmCharts.applyTheme(this,a,this.cname)},updateData:function(){0>=this.gridCountR&&(this.gridCountR=1);this.totals=[];this.data=this.chart.chartData;var a=this.chart;"xy"!=a.type&&(this.stackGraphs("smoothedLine"),this.stackGraphs("line"),this.stackGraphs("column"),this.stackGraphs("step"));this.recalculateToPercents&&this.recalculate();this.synchronizationMultiplier&&
	this.synchronizeWith?(AmCharts.isString(this.synchronizeWith)&&(this.synchronizeWith=a.getValueAxisById(this.synchronizeWith)),this.synchronizeWith&&(this.synchronizeWithAxis(this.synchronizeWith),this.foundGraphs=!0)):(this.foundGraphs=!1,this.getMinMax())},draw:function(){AmCharts.ValueAxis.base.draw.call(this);var a=this.chart,b=this.set;"duration"==this.type&&(this.duration="ss");!0===this.dataChanged&&(this.updateData(),this.dataChanged=!1);if(this.logarithmic&&(0>=this.getMin(0,this.data.length-
			1)||0>=this.minimum))this.fire("logarithmicAxisFailed",{type:"logarithmicAxisFailed",chart:a});else{this.grid0=null;var c,d,e=a.dx,f=a.dy,g=!1,h=this.logarithmic;if(isNaN(this.min)||isNaN(this.max)||!this.foundGraphs||Infinity==this.min||-Infinity==this.max)g=!0;else{var k=this.labelFrequency,l=this.showFirstLabel,m=this.showLastLabel,n=1,p=0,q=Math.round((this.max-this.min)/this.step)+1,r;!0===h?(r=Math.log(this.max)*Math.LOG10E-Math.log(this.minReal)*Math.LOG10E,this.stepWidth=this.axisWidth/r,
	r>this.logGridLimit&&(q=Math.ceil(Math.log(this.max)*Math.LOG10E)+1,p=Math.round(Math.log(this.minReal)*Math.LOG10E),q>this.gridCountR&&(n=Math.ceil(q/this.gridCountR)))):this.stepWidth=this.axisWidth/(this.max-this.min);var s=0;1>this.step&&-1<this.step&&(s=AmCharts.getDecimals(this.step));this.integersOnly&&(s=0);s>this.maxDecCount&&(s=this.maxDecCount);var w=this.precision;isNaN(w)||(s=w);this.max=AmCharts.roundTo(this.max,this.maxDecCount);this.min=AmCharts.roundTo(this.min,this.maxDecCount);
		d={};d.precision=s;d.decimalSeparator=a.nf.decimalSeparator;d.thousandsSeparator=a.nf.thousandsSeparator;this.numberFormatter=d;var v,t=this.guides;c=t.length;if(0<c){var u=this.fillAlpha;for(d=this.fillAlpha=0;d<c;d++){var x=t[d],E=NaN,A=x.above;isNaN(x.toValue)||(E=this.getCoordinate(x.toValue),v=new this.axisItemRenderer(this,E,"",!0,NaN,NaN,x),this.pushAxisItem(v,A));var z=NaN;isNaN(x.value)||(z=this.getCoordinate(x.value),v=new this.axisItemRenderer(this,z,x.label,!0,NaN,(E-z)/2,x),this.pushAxisItem(v,
			A));isNaN(E-z)||(v=new this.guideFillRenderer(this,z,E,x),this.pushAxisItem(v,A),v=v.graphics(),x.graphics=v,x.balloonText&&this.addEventListeners(v,x))}this.fillAlpha=u}this.exponential=!1;for(d=p;d<q;d+=n)t=AmCharts.roundTo(this.step*d+this.min,s),-1!=String(t).indexOf("e")&&(this.exponential=!0,String(t).split("e"));this.duration&&(this.maxInterval=AmCharts.getMaxInterval(this.max,this.duration));var s=this.step,H,t=this.minorGridAlpha;this.minorGridEnabled&&(H=this.getMinorGridStep(s,this.stepWidth*
			s));for(d=p;d<q;d+=n)if(p=s*d+this.min,h&&this.max-this.min>5*this.min&&(p-=this.min),p=AmCharts.roundTo(p,this.maxDecCount+1),!this.integersOnly||Math.round(p)==p)if(isNaN(w)||Number(AmCharts.toFixed(p,w))==p){!0===h&&(0===p&&(p=this.minReal),r>this.logGridLimit&&(p=Math.pow(10,d)));v=this.formatValue(p,!1,d);Math.round(d/k)!=d/k&&(v=void 0);if(0===d&&!l||d==q-1&&!m)v=" ";c=this.getCoordinate(p);v=new this.axisItemRenderer(this,c,v,void 0,void 0,void 0,void 0,this.boldLabels);this.pushAxisItem(v);
			if(p==this.baseValue&&"radar"!=a.type){var F,G,x=this.viW,A=this.viH;v=this.viX;u=this.viY;"H"==this.orientation?0<=c&&c<=x+1&&(F=[c,c,c+e],G=[A,0,f]):0<=c&&c<=A+1&&(F=[0,x,x+e],G=[c,c,c+f]);F&&(c=AmCharts.fitToBounds(2*this.gridAlpha,0,1),c=AmCharts.line(a.container,F,G,this.gridColor,c,1,this.dashLength),c.translate(v,u),this.grid0=c,a.axesSet.push(c),c.toBack())}if(!isNaN(H)&&0<t&&d<q-1){v=this.gridAlpha;this.gridAlpha=this.minorGridAlpha;for(c=1;c<s/H;c++)u=this.getCoordinate(p+H*c),u=new this.axisItemRenderer(this,
				u,"",!1,0,0,!1,!1,0,!0),this.pushAxisItem(u);this.gridAlpha=v}}e=this.baseValue;this.min>this.baseValue&&this.max>this.baseValue&&(e=this.min);this.min<this.baseValue&&this.max<this.baseValue&&(e=this.max);h&&e<this.minReal&&(e=this.minReal);this.baseCoord=this.getCoordinate(e);e={type:"axisChanged",target:this,chart:a};e.min=h?this.minReal:this.min;e.max=this.max;this.fire("axisChanged",e);this.axisCreated=!0}h=this.axisLine.set;e=this.labelsSet;this.positionTitle();"radar"!=a.type?(a=this.viX,f=
		this.viY,b.translate(a,f),e.translate(a,f)):h.toFront();!this.visible||g?(b.hide(),h.hide(),e.hide()):(b.show(),h.show(),e.show());this.axisY=this.y-this.viY;this.axisX=this.x-this.viX}},formatValue:function(a,b,c){var d=this.exponential,e=this.logarithmic,f=this.numberFormatter,g=this.chart;!0===this.logarithmic&&(d=-1!=String(a).indexOf("e")?!0:!1);this.useScientificNotation&&(d=!0);this.usePrefixes&&(d=!1);d?(valueText=-1==String(a).indexOf("e")?a.toExponential(15):String(a),c=valueText.split("e"),
		b=Number(c[0]),c=Number(c[1]),b=AmCharts.roundTo(b,14),10==b&&(b=1,c+=1),valueText=b+"e"+c,0===a&&(valueText="0"),1==a&&(valueText="1")):(e&&(d=String(a).split("."),d[1]?(f.precision=d[1].length,0>c&&(f.precision=Math.abs(c))):f.precision=-1),valueText=this.usePrefixes?AmCharts.addPrefix(a,g.prefixesOfBigNumbers,g.prefixesOfSmallNumbers,f,!b):AmCharts.formatNumber(a,f,f.precision));this.duration&&(valueText=AmCharts.formatDuration(a,this.duration,"",this.durationUnits,this.maxInterval,f));this.recalculateToPercents?
		valueText+="%":(f=this.unit)&&(valueText="left"==this.unitPosition?f+valueText:valueText+f);this.labelFunction&&(valueText=this.labelFunction(a,valueText,this).toString());return valueText},getMinorGridStep:function(a,b){var c=[5,4,2];60>b&&c.shift();for(var d=Math.floor(Math.log(Math.abs(a))*Math.LOG10E),e=0;e<c.length;e++){var f=a/c[e],g=Math.floor(Math.log(Math.abs(f))*Math.LOG10E);if(!(0<Math.abs(d-g)))if(1>a){if(g=Math.pow(10,-g)*f,g==Math.round(g))return f}else if(f==Math.round(f))return f}},
		stackGraphs:function(a){var b=this.stackType;"stacked"==b&&(b="regular");"line"==b&&(b="none");"100% stacked"==b&&(b="100%");this.stackType=b;var c=[],d=[],e=[],f=[],g,h=this.chart.graphs,k,l,m,n,p=this.baseValue,q=!1;if("line"==a||"step"==a||"smoothedLine"==a)q=!0;if(q&&("regular"==b||"100%"==b))for(n=0;n<h.length;n++)m=h[n],m.hidden||(l=m.type,m.chart==this.chart&&m.valueAxis==this&&a==l&&m.stackable&&(k&&(m.stackGraph=k),k=m));for(k=this.start;k<=this.end;k++){var r=0;for(n=0;n<h.length;n++)if(m=
				h[n],m.hidden)m.newStack&&(e[k]=NaN,d[k]=NaN);else if(l=m.type,m.chart==this.chart&&m.valueAxis==this&&a==l&&m.stackable)if(l=this.data[k].axes[this.id].graphs[m.id],g=l.values.value,isNaN(g))m.newStack&&(e[k]=NaN,d[k]=NaN);else{var s=AmCharts.getDecimals(g);r<s&&(r=s);isNaN(f[k])?f[k]=Math.abs(g):f[k]+=Math.abs(g);f[k]=AmCharts.roundTo(f[k],r);s=m.fillToGraph;q&&s&&(s=this.data[k].axes[this.id].graphs[s.id])&&(l.values.open=s.values.value);"regular"==b&&(q&&(isNaN(c[k])?(c[k]=g,l.values.close=g,
			l.values.open=this.baseValue):(isNaN(g)?l.values.close=c[k]:l.values.close=g+c[k],l.values.open=c[k],c[k]=l.values.close)),"column"==a&&(m.newStack&&(e[k]=NaN,d[k]=NaN),l.values.close=g,0>g?(l.values.close=g,isNaN(d[k])?l.values.open=p:(l.values.close+=d[k],l.values.open=d[k]),d[k]=l.values.close):(l.values.close=g,isNaN(e[k])?l.values.open=p:(l.values.close+=e[k],l.values.open=e[k]),e[k]=l.values.close)))}}for(k=this.start;k<=this.end;k++)for(n=0;n<h.length;n++)(m=h[n],m.hidden)?m.newStack&&(e[k]=
			NaN,d[k]=NaN):(l=m.type,m.chart==this.chart&&m.valueAxis==this&&a==l&&m.stackable&&(l=this.data[k].axes[this.id].graphs[m.id],g=l.values.value,isNaN(g)||(c=g/f[k]*100,l.values.percents=c,l.values.total=f[k],m.newStack&&(e[k]=NaN,d[k]=NaN),"100%"==b&&(isNaN(d[k])&&(d[k]=0),isNaN(e[k])&&(e[k]=0),0>c?(l.values.close=AmCharts.fitToBounds(c+d[k],-100,100),l.values.open=d[k],d[k]=l.values.close):(l.values.close=AmCharts.fitToBounds(c+e[k],-100,100),l.values.open=e[k],e[k]=l.values.close)))))},recalculate:function(){var a=
			this.chart,b=a.graphs,c;for(c=0;c<b.length;c++){var d=b[c];if(d.valueAxis==this){var e="value";if("candlestick"==d.type||"ohlc"==d.type)e="open";var f,g,h=this.end+2,h=AmCharts.fitToBounds(this.end+1,0,this.data.length-1),k=this.start;0<k&&k--;var l;g=this.start;d.compareFromStart&&(g=0);if(!isNaN(a.startTime)&&(l=a.categoryAxis)){minDuration=l.minDuration();var m=new Date(a.startTime+minDuration/2),n=AmCharts.resetDateToMin(new Date(a.startTime),l.minPeriod).getTime();AmCharts.resetDateToMin(new Date(m),
			l.minPeriod).getTime()>n&&g++}if(l=a.recalculateFromDate)a.dataDateFormat&&(l=AmCharts.stringToDate(l,a.dataDateFormat)),g=a.getClosestIndex(a.chartData,"time",l.getTime(),!0,0,a.chartData.length),h=a.chartData.length-1;for(l=g;l<=h&&(g=this.data[l].axes[this.id].graphs[d.id],f=g.values[e],isNaN(f));l++);this.recBaseValue=f;for(e=k;e<=h;e++){g=this.data[e].axes[this.id].graphs[d.id];g.percents={};var k=g.values,p;for(p in k)g.percents[p]="percents"!=p?k[p]/f*100-100:k[p]}}}},getMinMax:function(){var a=
			!1,b=this.chart,c=b.graphs,d;for(d=0;d<c.length;d++){var e=c[d].type;("line"==e||"step"==e||"smoothedLine"==e)&&this.expandMinMax&&(a=!0)}a&&(0<this.start&&this.start--,this.end<this.data.length-1&&this.end++);"serial"==b.type&&(!0!==b.categoryAxis.parseDates||a||this.end<this.data.length-1&&this.end++);a=this.minMaxMultiplier;this.min=this.getMin(this.start,this.end);this.max=this.getMax();a=(this.max-this.min)*(a-1);this.min-=a;this.max+=a;a=this.guides.length;if(this.includeGuidesInMinMax&&0<a)for(b=
				                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          0;b<a;b++)c=this.guides[b],c.toValue<this.min&&(this.min=c.toValue),c.value<this.min&&(this.min=c.value),c.toValue>this.max&&(this.max=c.toValue),c.value>this.max&&(this.max=c.value);isNaN(this.minimum)||(this.min=this.minimum);isNaN(this.maximum)||(this.max=this.maximum);this.min>this.max&&(a=this.max,this.max=this.min,this.min=a);isNaN(this.minTemp)||(this.min=this.minTemp);isNaN(this.maxTemp)||(this.max=this.maxTemp);this.minReal=this.min;this.maxReal=this.max;0===this.min&&0===this.max&&(this.max=
			9);this.min>this.max&&(this.min=this.max-1);a=this.min;b=this.max;c=this.max-this.min;d=0===c?Math.pow(10,Math.floor(Math.log(Math.abs(this.max))*Math.LOG10E))/10:Math.pow(10,Math.floor(Math.log(Math.abs(c))*Math.LOG10E))/10;isNaN(this.maximum)&&isNaN(this.maxTemp)&&(this.max=Math.ceil(this.max/d)*d+d);isNaN(this.minimum)&&isNaN(this.minTemp)&&(this.min=Math.floor(this.min/d)*d-d);0>this.min&&0<=a&&(this.min=0);0<this.max&&0>=b&&(this.max=0);"100%"==this.stackType&&(this.min=0>this.min?-100:0,this.max=
			0>this.max?0:100);c=this.max-this.min;d=Math.pow(10,Math.floor(Math.log(Math.abs(c))*Math.LOG10E))/10;this.step=Math.ceil(c/this.gridCountR/d)*d;c=Math.pow(10,Math.floor(Math.log(Math.abs(this.step))*Math.LOG10E));c=this.fixStepE(c);d=Math.ceil(this.step/c);5<d&&(d=10);5>=d&&2<d&&(d=5);this.step=Math.ceil(this.step/(c*d))*c*d;1>c?(this.maxDecCount=Math.abs(Math.log(Math.abs(c))*Math.LOG10E),this.maxDecCount=Math.round(this.maxDecCount),this.step=AmCharts.roundTo(this.step,this.maxDecCount+1)):this.maxDecCount=
			0;this.min=this.step*Math.floor(this.min/this.step);this.max=this.step*Math.ceil(this.max/this.step);0>this.min&&0<=a&&(this.min=0);0<this.max&&0>=b&&(this.max=0);1<this.minReal&&1<this.max-this.minReal&&(this.minReal=Math.floor(this.minReal));c=Math.pow(10,Math.floor(Math.log(Math.abs(this.minReal))*Math.LOG10E));0===this.min&&(this.minReal=c);0===this.min&&1<this.minReal&&(this.minReal=1);0<this.min&&0<this.minReal-this.step&&(this.minReal=this.min+this.step<this.minReal?this.min+this.step:this.min);
			c=Math.log(b)*Math.LOG10E-Math.log(a)*Math.LOG10E;this.logarithmic&&(2<c?(this.minReal=this.min=Math.pow(10,Math.floor(Math.log(Math.abs(a))*Math.LOG10E)),this.max=Math.pow(10,Math.ceil(Math.log(Math.abs(b))*Math.LOG10E))):(b=Math.pow(10,Math.floor(Math.log(Math.abs(this.min))*Math.LOG10E))/10,a=Math.pow(10,Math.floor(Math.log(Math.abs(a))*Math.LOG10E))/10,b<a&&(this.minReal=this.min=10*a)))},fixStepE:function(a){a=a.toExponential(0).split("e");var b=Number(a[1]);9==Number(a[0])&&b++;return this.generateNumber(1,
			b)},generateNumber:function(a,b){var c="",d;d=0>b?Math.abs(b)-1:Math.abs(b);var e;for(e=0;e<d;e++)c+="0";return 0>b?Number("0."+c+String(a)):Number(String(a)+c)},getMin:function(a,b){var c,d;for(d=a;d<=b;d++){var e=this.data[d].axes[this.id].graphs,f;for(f in e)if(e.hasOwnProperty(f)){var g=this.chart.getGraphById(f);if(g.includeInMinMax&&(!g.hidden||this.includeHidden)){isNaN(c)&&(c=Infinity);this.foundGraphs=!0;g=e[f].values;this.recalculateToPercents&&(g=e[f].percents);var h;if(this.minMaxField)h=
			g[this.minMaxField],h<c&&(c=h);else for(var k in g)g.hasOwnProperty(k)&&"percents"!=k&&"total"!=k&&(h=g[k],h<c&&(c=h))}}}return c},getMax:function(){var a,b;for(b=this.start;b<=this.end;b++){var c=this.data[b].axes[this.id].graphs,d;for(d in c)if(c.hasOwnProperty(d)){var e=this.chart.getGraphById(d);if(e.includeInMinMax&&(!e.hidden||this.includeHidden)){isNaN(a)&&(a=-Infinity);this.foundGraphs=!0;e=c[d].values;this.recalculateToPercents&&(e=c[d].percents);var f;if(this.minMaxField)f=e[this.minMaxField],
		f>a&&(a=f);else for(var g in e)e.hasOwnProperty(g)&&"percents"!=g&&"total"!=g&&(f=e[g],f>a&&(a=f))}}}return a},dispatchZoomEvent:function(a,b){var c={type:"axisZoomed",startValue:a,endValue:b,target:this,chart:this.chart};this.fire(c.type,c)},zoomToValues:function(a,b){if(b<a){var c=b;b=a;a=c}a<this.min&&(a=this.min);b>this.max&&(b=this.max);c={type:"axisSelfZoomed"};c.chart=this.chart;c.valueAxis=this;c.multiplier=this.axisWidth/Math.abs(this.getCoordinate(b)-this.getCoordinate(a));c.position="V"==
		this.orientation?this.reversed?this.getCoordinate(a):this.getCoordinate(b):this.reversed?this.getCoordinate(b):this.getCoordinate(a);this.fire(c.type,c)},coordinateToValue:function(a){if(isNaN(a))return NaN;var b=this.axisWidth,c=this.stepWidth,d=this.reversed,e=this.rotate,f=this.min,g=this.minReal;return!0===this.logarithmic?Math.pow(10,(e?!0===d?(b-a)/c:a/c:!0===d?a/c:(b-a)/c)+Math.log(g)*Math.LOG10E):!0===d?e?f-(a-b)/c:a/c+f:e?a/c+f:f-(a-b)/c},getCoordinate:function(a){if(isNaN(a))return NaN;
			var b=this.rotate,c=this.reversed,d=this.axisWidth,e=this.stepWidth,f=this.min,g=this.minReal;!0===this.logarithmic?(a=Math.log(a)*Math.LOG10E-Math.log(g)*Math.LOG10E,b=b?!0===c?d-e*a:e*a:!0===c?e*a:d-e*a):b=!0===c?b?d-e*(a-f):e*(a-f):b?e*(a-f):d-e*(a-f);b=this.rotate?b+(this.x-this.viX):b+(this.y-this.viY);1E7<Math.abs(b)&&(b=1E7*(b/Math.abs(b)));return Math.round(b)},synchronizeWithAxis:function(a){this.synchronizeWith=a;this.listenTo(this.synchronizeWith,"axisChanged",this.handleSynchronization)},
		handleSynchronization:function(a){var b=this.synchronizeWith;a=b.min;var c=b.max,b=b.step,d=this.synchronizationMultiplier;d&&(this.min=a*d,this.max=c*d,this.step=b*d,a=Math.pow(10,Math.floor(Math.log(Math.abs(this.step))*Math.LOG10E)),a=Math.abs(Math.log(Math.abs(a))*Math.LOG10E),this.maxDecCount=a=Math.round(a),this.draw())}});AmCharts.RecAxis=AmCharts.Class({construct:function(a){var b=a.chart,c=a.axisThickness,d=a.axisColor,e=a.axisAlpha,f=a.offset,g=a.dx,h=a.dy,k=a.viX,l=a.viY,m=a.viH,n=a.viW,p=b.container;"H"==a.orientation?(d=AmCharts.line(p,[0,n],[0,0],d,e,c),this.axisWidth=a.width,"bottom"==a.position?(a=c/2+f+m+l-1,c=k):(a=-c/2-f+l+h,c=g+k)):(this.axisWidth=a.height,"right"==a.position?(d=AmCharts.line(p,[0,0,-g],[0,m,m-h],d,e,c),a=l+h,c=c/2+f+g+n+k-1):(d=AmCharts.line(p,[0,0],[0,m],d,e,c),a=l,c=-c/2-f+k));d.translate(c,
		a);b.axesSet.push(d);this.set=d}});AmCharts.RecItem=AmCharts.Class({construct:function(a,b,c,d,e,f,g,h,k,l,m){b=Math.round(b);this.value=c;void 0==c&&(c="");k||(k=0);void 0==d&&(d=!0);var n=a.chart.fontFamily,p=a.fontSize;void 0==p&&(p=a.chart.fontSize);var q=a.color;void 0==q&&(q=a.chart.color);void 0!==m&&(q=m);var r=a.chart.container,s=r.set();this.set=s;var w=a.axisThickness,v=a.axisColor,t=a.axisAlpha,u=a.tickLength,x=a.gridAlpha,E=a.gridThickness,A=a.gridColor,z=a.dashLength,H=a.fillColor,F=a.fillAlpha,G=a.labelsEnabled;m=a.labelRotation;
		var V=a.counter,N=a.inside,ia=a.labelOffset,da=a.dx,ba=a.dy,Sa=a.orientation,na=a.position,ta=a.previousCoord,L=a.viH,Y=a.viW,$=a.offset,oa,W;g?(G=!0,isNaN(g.tickLength)||(u=g.tickLength),void 0!=g.lineColor&&(A=g.lineColor),void 0!=g.color&&(q=g.color),isNaN(g.lineAlpha)||(x=g.lineAlpha),isNaN(g.dashLength)||(z=g.dashLength),isNaN(g.lineThickness)||(E=g.lineThickness),!0===g.inside&&(N=!0),isNaN(g.labelRotation)||(m=g.labelRotation),isNaN(g.fontSize)||(p=g.fontSize),g.position&&(na=g.position),void 0!==
		g.boldLabel&&(h=g.boldLabel),isNaN(g.labelOffset)||(ia=g.labelOffset)):""===c&&(u=0);W="start";e&&(W="middle");var Z=m*Math.PI/180,pa,I=0,D=0,aa=0,S=pa=0,Ta=0;"V"==Sa&&(m=0);var T;G&&(T=a.autoWrap&&0===m?AmCharts.wrappedText(r,c,q,n,p,W,h,e,0):AmCharts.text(r,c,q,n,p,W,h),W=T.getBBox(),S=W.width,Ta=W.height);if("H"==Sa){if(0<=b&&b<=Y+1&&(0<u&&0<t&&b+k<=Y+1&&(oa=AmCharts.line(r,[b+k,b+k],[0,u],v,t,E),s.push(oa)),0<x&&(W=AmCharts.line(r,[b,b+da,b+da],[L,L+ba,ba],A,x,E,z),s.push(W))),D=0,I=b,g&&90==
			m&&N&&(I-=p),!1===d?(W="start",D="bottom"==na?N?D+u:D-u:N?D-u:D+u,I+=3,e&&(I+=e/2-3,W="middle"),0<m&&(W="middle")):W="middle",1==V&&0<F&&!g&&!l&&ta<Y&&(d=AmCharts.fitToBounds(b,0,Y),ta=AmCharts.fitToBounds(ta,0,Y),pa=d-ta,0<pa&&(fill=AmCharts.rect(r,pa,a.height,H,F),fill.translate(d-pa+da,ba),s.push(fill))),"bottom"==na?(D+=L+p/2+$,N?(0<m?(D=L-S/2*Math.sin(Z)-u-3,I+=S/2*Math.cos(Z)-4+2):0>m?(D=L+S*Math.sin(Z)-u-3+2,I+=-S*Math.cos(Z)-Ta*Math.sin(Z)-4):D-=u+p+3+3,D-=ia):(0<m?(D=L+S/2*Math.sin(Z)+u+
				3,I-=S/2*Math.cos(Z)):0>m?(D=L+u+3-S/2*Math.sin(Z)+2,I+=S/2*Math.cos(Z)):D+=u+w+3+3,D+=ia)):(D+=ba+p/2-$,I+=da,N?(0<m?(D=S/2*Math.sin(Z)+u+3,I-=S/2*Math.cos(Z)):D+=u+3,D+=ia):(0<m?(D=-(S/2)*Math.sin(Z)-u-6,I+=S/2*Math.cos(Z)):D-=u+p+3+w+3,D-=ia)),"bottom"==na?pa=(N?L-u-1:L+w-1)+$:(aa=da,pa=(N?ba:ba-u-w+1)-$),f&&(I+=f),f=I,0<m&&(f+=S/2*Math.cos(Z)),T&&(p=0,N&&(p=S/2*Math.cos(Z)),f+p>Y+2||0>f))T.remove(),T=null}else{0<=b&&b<=L+1&&(0<u&&0<t&&b+k<=L+1&&(oa=AmCharts.line(r,[0,u],[b+k,b+k],v,t,E),s.push(oa)),
		0<x&&(W=AmCharts.line(r,[0,da,Y+da],[b,b+ba,b+ba],A,x,E,z),s.push(W)));W="end";if(!0===N&&"left"==na||!1===N&&"right"==na)W="start";D=b-p/2;1==V&&0<F&&!g&&!l&&(d=AmCharts.fitToBounds(b,0,L),ta=AmCharts.fitToBounds(ta,0,L),Z=d-ta,fill=AmCharts.polygon(r,[0,a.width,a.width,0],[0,0,Z,Z],H,F),fill.translate(da,d-Z+ba),s.push(fill));D+=p/2;"right"==na?(I+=da+Y+$,D+=ba,N?(f||(D-=p/2+3),I=I-(u+4)-ia):(I+=u+4+w,D-=2,I+=ia)):N?(I+=u+4-$,f||(D-=p/2+3),g&&(I+=da,D+=ba),I+=ia):(I+=-u-w-4-2-$,D-=2,I-=ia);oa&&
		("right"==na?(aa+=da+$+Y,pa+=ba,aa=N?aa-w:aa+w):(aa-=$,N||(aa-=u+w)));f&&(D+=f);N=-3;"right"==na&&(N+=ba);T&&(D>L+1||D<N)&&(T.remove(),T=null)}oa&&oa.translate(aa,pa);!1===a.visible&&(oa&&oa.remove(),T&&(T.remove(),T=null));T&&(T.attr({"text-anchor":W}),T.translate(I,D),0!==m&&T.rotate(-m,a.chart.backgroundColor),a.allLabels.push(T)," "!=c&&(this.label=T));l||(a.counter=0===V?1:0,a.previousCoord=b);0===this.set.node.childNodes.length&&this.set.remove()},graphics:function(){return this.set},getLabel:function(){return this.label}});AmCharts.RecFill=AmCharts.Class({construct:function(a,b,c,d){var e=a.dx,f=a.dy,g=a.orientation,h=0;if(c<b){var k=b;b=c;c=k}var l=d.fillAlpha;isNaN(l)&&(l=0);k=a.chart.container;d=d.fillColor;"V"==g?(b=AmCharts.fitToBounds(b,0,a.viH),c=AmCharts.fitToBounds(c,0,a.viH)):(b=AmCharts.fitToBounds(b,0,a.viW),c=AmCharts.fitToBounds(c,0,a.viW));c-=b;isNaN(c)&&(c=4,h=2,l=0);0>c&&"object"==typeof d&&(d=d.join(",").split(",").reverse());"V"==g?(a=AmCharts.rect(k,a.width,c,d,l),a.translate(e,b-h+f)):(a=AmCharts.rect(k,
		c,a.height,d,l),a.translate(b-h+e,f));this.set=k.set([a])},graphics:function(){return this.set},getLabel:function(){}});AmCharts.AmChart=AmCharts.Class({construct:function(a){this.theme=a;this.version="3.11.1";AmCharts.addChart(this);this.createEvents("dataUpdated","init","rendered","drawn","failed");this.height=this.width="100%";this.dataChanged=!0;this.chartCreated=!1;this.previousWidth=this.previousHeight=0;this.backgroundColor="#FFFFFF";this.borderAlpha=this.backgroundAlpha=0;this.color=this.borderColor="#000000";this.fontFamily="Verdana";this.fontSize=11;this.usePrefixes=!1;this.precision=-1;this.percentPrecision=
		2;this.decimalSeparator=".";this.thousandsSeparator=",";this.labels=[];this.allLabels=[];this.titles=[];this.marginRight=this.marginLeft=this.autoMarginOffset=0;this.timeOuts=[];this.creditsPosition="top-left";var b=document.createElement("div"),c=b.style;c.overflow="hidden";c.position="relative";c.textAlign="left";this.chartDiv=b;b=document.createElement("div");c=b.style;c.overflow="hidden";c.position="relative";c.textAlign="left";this.legendDiv=b;this.titleHeight=0;this.hideBalloonTime=150;this.handDrawScatter=
		2;this.handDrawThickness=1;this.prefixesOfBigNumbers=[{number:1E3,prefix:"k"},{number:1E6,prefix:"M"},{number:1E9,prefix:"G"},{number:1E12,prefix:"T"},{number:1E15,prefix:"P"},{number:1E18,prefix:"E"},{number:1E21,prefix:"Z"},{number:1E24,prefix:"Y"}];this.prefixesOfSmallNumbers=[{number:1E-24,prefix:"y"},{number:1E-21,prefix:"z"},{number:1E-18,prefix:"a"},{number:1E-15,prefix:"f"},{number:1E-12,prefix:"p"},{number:1E-9,prefix:"n"},{number:1E-6,prefix:"\u03bc"},{number:.001,prefix:"m"}];this.panEventsEnabled=
		!0;AmCharts.bezierX=3;AmCharts.bezierY=6;this.product="amcharts";this.animations=[];this.balloon=new AmCharts.AmBalloon(this.theme);this.balloon.chart=this;AmCharts.applyTheme(this,a,"AmChart")},drawChart:function(){this.drawBackground();this.redrawLabels();this.drawTitles();this.brr()},drawBackground:function(){AmCharts.remove(this.background);var a=this.container,b=this.backgroundColor,c=this.backgroundAlpha,d=this.set;AmCharts.isModern||0!==c||(c=.001);var e=this.updateWidth();this.realWidth=e;
		var f=this.updateHeight();this.realHeight=f;this.background=b=AmCharts.polygon(a,[0,e-1,e-1,0],[0,0,f-1,f-1],b,c,1,this.borderColor,this.borderAlpha);d.push(b);if(b=this.backgroundImage)this.path&&(b=this.path+b),this.bgImg=a=a.image(b,0,0,e,f),d.push(a)},drawTitles:function(){var a=this.titles;if(AmCharts.ifArray(a)){var b=20,c;for(c=0;c<a.length;c++){var d=a[c],e=d.color;void 0===e&&(e=this.color);var f=d.size;isNaN(f)&&(f=this.fontSize+2);isNaN(d.alpha);var g=this.marginLeft,e=AmCharts.text(this.container,
		d.text,e,this.fontFamily,f);e.translate(g+(this.realWidth-this.marginRight-g)/2,b);e.node.style.pointerEvents="none";g=!0;void 0!==d.bold&&(g=d.bold);g&&e.attr({"font-weight":"bold"});e.attr({opacity:d.alpha});b+=f+6;this.freeLabelsSet.push(e)}}},write:function(a){if(a="object"!=typeof a?document.getElementById(a):a){a.innerHTML="";this.div=a;a.style.overflow="hidden";a.style.textAlign="left";var b=this.chartDiv,c=this.legendDiv,d=this.legend,e=c.style,f=b.style;this.measure();var g,h=document.createElement("div");
		g=h.style;g.position="relative";this.containerDiv=h;a.appendChild(h);var k=this.exportConfig;k&&AmCharts.AmExport&&!this.AmExport&&(this.AmExport=new AmCharts.AmExport(this,k));this.amExport&&AmCharts.AmExport&&(this.AmExport=AmCharts.extend(this.amExport,new AmCharts.AmExport(this),!0));this.AmExport&&this.AmExport.init&&this.AmExport.init();if(d)switch(d=this.addLegend(d,d.divId),d.position){case "bottom":h.appendChild(b);h.appendChild(c);break;case "top":h.appendChild(c);h.appendChild(b);break;
			case "absolute":g.width=a.style.width;g.height=a.style.height;e.position="absolute";f.position="absolute";void 0!==d.left&&(e.left=d.left+"px");void 0!==d.right&&(e.right=d.right+"px");void 0!==d.top&&(e.top=d.top+"px");void 0!==d.bottom&&(e.bottom=d.bottom+"px");d.marginLeft=0;d.marginRight=0;h.appendChild(b);h.appendChild(c);break;case "right":g.width=a.style.width;g.height=a.style.height;e.position="relative";f.position="absolute";h.appendChild(b);h.appendChild(c);break;case "left":g.width=a.style.width;
				g.height=a.style.height;e.position="absolute";f.position="relative";h.appendChild(b);h.appendChild(c);break;case "outside":h.appendChild(b)}else h.appendChild(b);this.listenersAdded||(this.addListeners(),this.listenersAdded=!0);this.initChart()}},createLabelsSet:function(){AmCharts.remove(this.labelsSet);this.labelsSet=this.container.set();this.freeLabelsSet.push(this.labelsSet)},initChart:function(){AmCharts.callInitHandler(this);AmCharts.applyLang(this.language,this);var a=this.numberFormatter;
		a&&(isNaN(a.precision)||(this.precision=a.precision),void 0!==a.thousandsSeparator&&(this.thousandsSeparator=a.thousandsSeparator),void 0!==a.decimalSeparator&&(this.decimalSeparator=a.decimalSeparator));(a=this.percentFormatter)&&!isNaN(a.precision)&&(this.percentPrecision=a.precision);this.nf={precision:this.precision,thousandsSeparator:this.thousandsSeparator,decimalSeparator:this.decimalSeparator};this.pf={precision:this.percentPrecision,thousandsSeparator:this.thousandsSeparator,decimalSeparator:this.decimalSeparator};
		this.divIsFixed=AmCharts.findIfFixed(this.chartDiv);this.previousHeight=this.divRealHeight;this.previousWidth=this.divRealWidth;this.destroy();this.startInterval();a=0;document.attachEvent&&!window.opera&&(a=1);this.dmouseX=this.dmouseY=0;var b=document.getElementsByTagName("html")[0];b&&window.getComputedStyle&&(b=window.getComputedStyle(b,null))&&(this.dmouseY=AmCharts.removePx(b.getPropertyValue("margin-top")),this.dmouseX=AmCharts.removePx(b.getPropertyValue("margin-left")));this.mouseMode=a;
		(a=this.container)?(a.container.innerHTML="",this.chartDiv.appendChild(a.container),a.setSize(this.realWidth,this.realHeight)):a=new AmCharts.AmDraw(this.chartDiv,this.realWidth,this.realHeight,this);AmCharts.VML||AmCharts.SVG?(a.handDrawn=this.handDrawn,a.handDrawScatter=this.handDrawScatter,a.handDrawThickness=this.handDrawThickness,this.container=a,this.set&&this.set.remove(),this.set=a.set(),this.gridSet&&this.gridSet.remove(),this.gridSet=a.set(),this.cursorLineSet&&this.cursorLineSet.remove(),
			this.cursorLineSet=a.set(),this.graphsBehindSet&&this.graphsBehindSet.remove(),this.graphsBehindSet=a.set(),this.bulletBehindSet&&this.bulletBehindSet.remove(),this.bulletBehindSet=a.set(),this.columnSet&&this.columnSet.remove(),this.columnSet=a.set(),this.graphsSet&&this.graphsSet.remove(),this.graphsSet=a.set(),this.trendLinesSet&&this.trendLinesSet.remove(),this.trendLinesSet=a.set(),this.axesLabelsSet&&this.axesLabelsSet.remove(),this.axesLabelsSet=a.set(),this.axesSet&&this.axesSet.remove(),
			this.axesSet=a.set(),this.cursorSet&&this.cursorSet.remove(),this.cursorSet=a.set(),this.scrollbarsSet&&this.scrollbarsSet.remove(),this.scrollbarsSet=a.set(),this.bulletSet&&this.bulletSet.remove(),this.bulletSet=a.set(),this.freeLabelsSet&&this.freeLabelsSet.remove(),this.freeLabelsSet=a.set(),this.balloonsSet&&this.balloonsSet.remove(),this.balloonsSet=a.set(),this.zoomButtonSet&&this.zoomButtonSet.remove(),this.zoomButtonSet=a.set(),this.linkSet&&this.linkSet.remove(),this.linkSet=a.set(),this.renderFix()):
			this.fire("failed",{type:"failed",chart:this})},measure:function(){var a=this.div;if(a){var b=this.chartDiv,c=a.offsetWidth,d=a.offsetHeight,e=this.container;a.clientHeight&&(c=a.clientWidth,d=a.clientHeight);var f=AmCharts.removePx(AmCharts.getStyle(a,"padding-left")),g=AmCharts.removePx(AmCharts.getStyle(a,"padding-right")),h=AmCharts.removePx(AmCharts.getStyle(a,"padding-top")),k=AmCharts.removePx(AmCharts.getStyle(a,"padding-bottom"));isNaN(f)||(c-=f);isNaN(g)||(c-=g);isNaN(h)||(d-=h);isNaN(k)||
	(d-=k);f=a.style;a=f.width;f=f.height;-1!=a.indexOf("px")&&(c=AmCharts.removePx(a));-1!=f.indexOf("px")&&(d=AmCharts.removePx(f));a=AmCharts.toCoordinate(this.width,c);f=AmCharts.toCoordinate(this.height,d);this.balloon=AmCharts.processObject(this.balloon,AmCharts.AmBalloon,this.theme);this.balloon.chart=this;(a!=this.previousWidth||f!=this.previousHeight)&&0<a&&0<f&&(b.style.width=a+"px",b.style.height=f+"px",e&&e.setSize(a,f));this.balloon.setBounds(2,2,a-2,f);this.realWidth=a;this.realHeight=f;
		this.divRealWidth=c;this.divRealHeight=d}},destroy:function(){this.chartDiv.innerHTML="";this.clearTimeOuts();this.interval&&clearInterval(this.interval);this.interval=NaN},clearTimeOuts:function(){var a=this.timeOuts;if(a){var b;for(b=0;b<a.length;b++)clearTimeout(a[b])}this.timeOuts=[]},clear:function(a){AmCharts.callMethod("clear",[this.chartScrollbar,this.scrollbarV,this.scrollbarH,this.chartCursor]);this.chartCursor=this.scrollbarH=this.scrollbarV=this.chartScrollbar=null;this.clearTimeOuts();
		this.interval&&clearInterval(this.interval);this.container&&(this.container.remove(this.chartDiv),this.container.remove(this.legendDiv));a||AmCharts.removeChart(this)},setMouseCursor:function(a){"auto"==a&&AmCharts.isNN&&(a="default");this.chartDiv.style.cursor=a;this.legendDiv.style.cursor=a},redrawLabels:function(){this.labels=[];var a=this.allLabels;this.createLabelsSet();var b;for(b=0;b<a.length;b++)this.drawLabel(a[b])},drawLabel:function(a){if(this.container){var b=a.y,c=a.text,d=a.align,e=
		a.size,f=a.color,g=a.rotation,h=a.alpha,k=a.bold,l=AmCharts.toCoordinate(a.x,this.realWidth),b=AmCharts.toCoordinate(b,this.realHeight);l||(l=0);b||(b=0);void 0===f&&(f=this.color);isNaN(e)&&(e=this.fontSize);d||(d="start");"left"==d&&(d="start");"right"==d&&(d="end");"center"==d&&(d="middle",g?b=this.realHeight-b+b/2:l=this.realWidth/2-l);void 0===h&&(h=1);void 0===g&&(g=0);b+=e/2;c=AmCharts.text(this.container,c,f,this.fontFamily,e,d,k,h);c.translate(l,b);0!==g&&c.rotate(g);a.url?(c.setAttr("cursor",
		"pointer"),c.click(function(){AmCharts.getURL(a.url)})):c.node.style.pointerEvents="none";this.labelsSet.push(c);this.labels.push(c)}},addLabel:function(a,b,c,d,e,f,g,h,k,l){a={x:a,y:b,text:c,align:d,size:e,color:f,alpha:h,rotation:g,bold:k,url:l};this.container&&this.drawLabel(a);this.allLabels.push(a)},clearLabels:function(){var a=this.labels,b;for(b=a.length-1;0<=b;b--)a[b].remove();this.labels=[];this.allLabels=[]},updateHeight:function(){var a=this.divRealHeight,b=this.legend;if(b){var c=this.legendDiv.offsetHeight,
		b=b.position;if("top"==b||"bottom"==b){a-=c;if(0>a||isNaN(a))a=0;this.chartDiv.style.height=a+"px"}}return a},updateWidth:function(){var a=this.divRealWidth,b=this.divRealHeight,c=this.legend;if(c){var d=this.legendDiv,e=d.offsetWidth;isNaN(c.width)||(e=c.width);var f=d.offsetHeight,d=d.style,g=this.chartDiv.style,c=c.position;if("right"==c||"left"==c){a-=e;if(0>a||isNaN(a))a=0;g.width=a+"px";"left"==c?g.left=e+"px":d.left=a+"px";b>f&&(d.top=(b-f)/2+"px")}}return a},getTitleHeight:function(){var a=
		0,b=this.titles;if(0<b.length){var a=15,c;for(c=0;c<b.length;c++){var d=b[c].size;isNaN(d)&&(d=this.fontSize+2);a+=d+6}}return a},addTitle:function(a,b,c,d,e){isNaN(b)&&(b=this.fontSize+2);a={text:a,size:b,color:c,alpha:d,bold:e};this.titles.push(a);return a},addMouseWheel:function(){var a=this;window.addEventListener&&!a.wheelAdded&&(window.addEventListener("DOMMouseScroll",function(b){a.handleWheel.call(a,b)},!1),document.addEventListener("mousewheel",function(b){a.handleWheel.call(a,b)},!1),a.wheelAdded=
		!0)},handleWheel:function(a){if(this.mouseIsOver){var b=0;a||(a=window.event);a.wheelDelta?b=a.wheelDelta/120:a.detail&&(b=-a.detail/3);b&&this.handleWheelReal(b,a.shiftKey);a.preventDefault&&a.preventDefault()}},handleWheelReal:function(a){},addListeners:function(){var a=this,b=a.chartDiv;document.addEventListener?(a.panEventsEnabled&&(b.style.msTouchAction="none","ontouchstart"in document.documentElement&&(b.addEventListener("touchstart",function(b){a.handleTouchMove.call(a,b);a.handleTouchStart.call(a,
		b)},!0),b.addEventListener("touchmove",function(b){a.handleTouchMove.call(a,b)},!0),b.addEventListener("touchend",function(b){a.handleTouchEnd.call(a,b)},!0))),b.addEventListener("mousedown",function(b){a.mouseIsOver=!0;a.handleMouseMove.call(a,b);a.handleMouseDown.call(a,b)},!0),b.addEventListener("mouseover",function(b){a.handleMouseOver.call(a,b)},!0),b.addEventListener("mouseout",function(b){a.handleMouseOut.call(a,b)},!0)):(b.attachEvent("onmousedown",function(b){a.handleMouseDown.call(a,b)}),
		b.attachEvent("onmouseover",function(b){a.handleMouseOver.call(a,b)}),b.attachEvent("onmouseout",function(b){a.handleMouseOut.call(a,b)}))},dispDUpd:function(){var a;this.dispatchDataUpdated&&(this.dispatchDataUpdated=!1,a="dataUpdated",this.fire(a,{type:a,chart:this}));this.chartCreated||(a="init",this.fire(a,{type:a,chart:this}));this.chartRendered||(a="rendered",this.fire(a,{type:a,chart:this}),this.chartRendered=!0);a="drawn";this.fire(a,{type:a,chart:this})},validateSize:function(){var a=this;
		a.measure();var b=a.legend;if((a.realWidth!=a.previousWidth||a.realHeight!=a.previousHeight)&&0<a.realWidth&&0<a.realHeight){a.sizeChanged=!0;if(b){clearTimeout(a.legendInitTO);var c=setTimeout(function(){b.invalidateSize()},100);a.timeOuts.push(c);a.legendInitTO=c}a.marginsUpdated="xy"!=a.type?!1:!0;clearTimeout(a.initTO);c=setTimeout(function(){a.initChart()},150);a.timeOuts.push(c);a.initTO=c}a.renderFix();b&&b.renderFix()},invalidateSize:function(){this.previousHeight=this.previousWidth=NaN;this.invalidateSizeReal()},
		invalidateSizeReal:function(){var a=this;a.marginsUpdated=!1;clearTimeout(a.validateTO);var b=setTimeout(function(){a.validateSize()},5);a.timeOuts.push(b);a.validateTO=b},validateData:function(a){this.chartCreated&&(this.dataChanged=!0,this.marginsUpdated="xy"!=this.type?!1:!0,this.initChart(a))},validateNow:function(){this.chartRendered=!1;this.write(this.div)},showItem:function(a){a.hidden=!1;this.initChart()},hideItem:function(a){a.hidden=!0;this.initChart()},hideBalloon:function(){var a=this;
			clearInterval(a.hoverInt);clearTimeout(a.balloonTO);a.hoverInt=setTimeout(function(){a.hideBalloonReal.call(a)},a.hideBalloonTime)},cleanChart:function(){},hideBalloonReal:function(){var a=this.balloon;a&&a.hide()},showBalloon:function(a,b,c,d,e){var f=this;clearTimeout(f.balloonTO);clearInterval(f.hoverInt);f.balloonTO=setTimeout(function(){f.showBalloonReal.call(f,a,b,c,d,e)},1)},showBalloonReal:function(a,b,c,d,e){this.handleMouseMove();var f=this.balloon;f.enabled&&(f.followCursor(!1),f.changeColor(b),
			!c||f.fixedPosition?(f.setPosition(d,e),f.followCursor(!1)):f.followCursor(!0),a&&f.showBalloon(a))},handleTouchMove:function(a){this.hideBalloon();var b=this.chartDiv;a.touches&&(a=a.touches.item(0),this.mouseX=a.pageX-AmCharts.findPosX(b),this.mouseY=a.pageY-AmCharts.findPosY(b))},handleMouseOver:function(a){AmCharts.resetMouseOver();this.mouseIsOver=!0},handleMouseOut:function(a){AmCharts.resetMouseOver();this.mouseIsOver=!1},handleMouseMove:function(a){if(this.mouseIsOver){var b=this.chartDiv;
			a||(a=window.event);var c,d;if(a){this.posX=AmCharts.findPosX(b);this.posY=AmCharts.findPosY(b);switch(this.mouseMode){case 1:c=a.clientX-this.posX;d=a.clientY-this.posY;if(!this.divIsFixed){var b=document.body,e,f;b&&(e=b.scrollLeft,y1=b.scrollTop);if(b=document.documentElement)f=b.scrollLeft,y2=b.scrollTop;e=Math.max(e,f);f=Math.max(y1,y2);c+=e;d+=f}break;case 0:this.divIsFixed?(c=a.clientX-this.posX,d=a.clientY-this.posY):(c=a.pageX-this.posX,d=a.pageY-this.posY)}a.touches&&(a=a.touches.item(0),
				c=a.pageX-this.posX,d=a.pageY-this.posY);this.mouseX=c-this.dmouseX;this.mouseY=d-this.dmouseY}}},handleTouchStart:function(a){this.handleMouseDown(a)},handleTouchEnd:function(a){AmCharts.resetMouseOver();this.handleReleaseOutside(a)},handleReleaseOutside:function(a){},handleMouseDown:function(a){AmCharts.resetMouseOver();this.mouseIsOver=!0;a&&a.preventDefault&&a.preventDefault()},addLegend:function(a,b){a=AmCharts.processObject(a,AmCharts.AmLegend,this.theme);a.divId=b;var c;c="object"!=typeof b&&
		b?document.getElementById(b):b;this.legend=a;a.chart=this;c?(a.div=c,a.position="outside",a.autoMargins=!1):a.div=this.legendDiv;c=this.handleLegendEvent;this.listenTo(a,"showItem",c);this.listenTo(a,"hideItem",c);this.listenTo(a,"clickMarker",c);this.listenTo(a,"rollOverItem",c);this.listenTo(a,"rollOutItem",c);this.listenTo(a,"rollOverMarker",c);this.listenTo(a,"rollOutMarker",c);this.listenTo(a,"clickLabel",c);return a},removeLegend:function(){this.legend=void 0;this.legendDiv.innerHTML=""},handleResize:function(){(AmCharts.isPercents(this.width)||
		AmCharts.isPercents(this.height))&&this.invalidateSizeReal();this.renderFix()},renderFix:function(){if(!AmCharts.VML){var a=this.container;a&&a.renderFix()}},getSVG:function(){if(AmCharts.hasSVG)return this.container},animate:function(a,b,c,d,e,f,g){a["an_"+b]&&AmCharts.removeFromArray(this.animations,a["an_"+b]);c={obj:a,frame:0,attribute:b,from:c,to:d,time:e,effect:f,suffix:g};a["an_"+b]=c;this.animations.push(c);return c},setLegendData:function(a){var b=this.legend;b&&b.setData(a)},startInterval:function(){var a=
			this;clearInterval(a.interval);a.interval=setInterval(function(){a.updateAnimations.call(a)},AmCharts.updateRate)},stopAnim:function(a){AmCharts.removeFromArray(this.animations,a)},updateAnimations:function(){var a;this.container&&this.container.update();for(a=this.animations.length-1;0<=a;a--){var b=this.animations[a],c=1E3*b.time/AmCharts.updateRate,d=b.frame+1,e=b.obj,f=b.attribute;if(d<=c){b.frame++;var g=Number(b.from),h=Number(b.to)-g,c=AmCharts[b.effect](0,d,g,h,c);0===h?(this.animations.splice(a,
			1),e.node.style[f]=Number(b.to)+b.suffix):e.node.style[f]=c+b.suffix}else e.node.style[f]=Number(b.to)+b.suffix,this.animations.splice(a,1)}},inIframe:function(){try{return window.self!==window.top}catch(a){return!0}},brr:function(){}});AmCharts.Slice=AmCharts.Class({construct:function(){}});AmCharts.SerialDataItem=AmCharts.Class({construct:function(){}});AmCharts.GraphDataItem=AmCharts.Class({construct:function(){}});
	AmCharts.Guide=AmCharts.Class({construct:function(a){this.cname="Guide";AmCharts.applyTheme(this,a,this.cname)}});AmCharts.AmGraph=AmCharts.Class({construct:function(a){this.cname="AmGraph";this.createEvents("rollOverGraphItem","rollOutGraphItem","clickGraphItem","doubleClickGraphItem","rightClickGraphItem","clickGraph","rollOverGraph","rollOutGraph");this.type="line";this.stackable=!0;this.columnCount=1;this.columnIndex=0;this.centerCustomBullets=this.showBalloon=!0;this.maxBulletSize=50;this.minBulletSize=4;this.balloonText="[[value]]";this.hidden=this.scrollbar=this.animationPlayed=!1;this.pointPosition="middle";
		this.depthCount=1;this.includeInMinMax=!0;this.negativeBase=0;this.visibleInLegend=!0;this.showAllValueLabels=!1;this.showBulletsAt=this.showBalloonAt="close";this.lineThickness=1;this.dashLength=0;this.connect=!0;this.lineAlpha=1;this.bullet="none";this.bulletBorderThickness=2;this.bulletBorderAlpha=0;this.bulletAlpha=1;this.bulletSize=8;this.hideBulletsCount=this.bulletOffset=0;this.labelPosition="top";this.cornerRadiusTop=0;this.cursorBulletAlpha=1;this.gradientOrientation="vertical";this.dy=this.dx=
			0;this.periodValue="";this.clustered=!0;this.periodSpan=1;this.y=this.x=0;this.switchable=!0;this.tcc=this.minDistance=1;AmCharts.applyTheme(this,a,this.cname)},draw:function(){var a=this.chart;isNaN(this.precision)||(this.numberFormatter?this.numberFormatter.precision=this.precision:this.numberFormatter={precision:this.precision,decimalSeparator:a.decimalSeparator,thousandsSeparator:a.thousandsSeparator});var b=a.container;this.container=b;this.destroy();var c=b.set(),d=b.set();this.behindColumns?
		(a.graphsBehindSet.push(c),a.bulletBehindSet.push(d)):(a.graphsSet.push(c),a.bulletSet.push(d));var e=this.bulletAxis;AmCharts.isString(e)&&(this.bulletAxis=a.getValueAxisById(e));this.bulletSet=d;this.scrollbar||(e=a.marginLeftReal,a=a.marginTopReal,c.translate(e,a),d.translate(e,a));b=b.set();AmCharts.remove(this.columnsSet);c.push(b);this.set=c;this.columnsSet=b;this.columnsArray=[];this.ownColumns=[];this.allBullets=[];this.animationArray=[];AmCharts.ifArray(this.data)&&(c=!1,"xy"==this.chart.type?
	this.xAxis.axisCreated&&this.yAxis.axisCreated&&(c=!0):this.valueAxis.axisCreated&&(c=!0),!this.hidden&&c&&this.createGraph())},createGraph:function(){var a=this,b=a.chart;"inside"==a.labelPosition&&"column"!=a.type&&(a.labelPosition="bottom");a.startAlpha=b.startAlpha;a.seqAn=b.sequencedAnimation;a.baseCoord=a.valueAxis.baseCoord;void 0===a.fillAlphas&&(a.fillAlphas=0);a.bulletColorR=a.bulletColor;void 0===a.bulletColorR&&(a.bulletColorR=a.lineColorR,a.bulletColorNegative=a.negativeLineColor);void 0===
	a.bulletAlpha&&(a.bulletAlpha=a.lineAlpha);clearTimeout(a.playedTO);if(!isNaN(a.valueAxis.min)&&!isNaN(a.valueAxis.max)){switch(b.type){case "serial":a.categoryAxis&&(a.createSerialGraph(),"candlestick"==a.type&&1>a.valueAxis.minMaxMultiplier&&a.positiveClip(a.set));break;case "radar":a.createRadarGraph();break;case "xy":a.createXYGraph(),a.positiveClip(a.set)}a.playedTO=setTimeout(function(){a.setAnimationPlayed.call(a)},500*a.chart.startDuration)}},setAnimationPlayed:function(){this.animationPlayed=
		!0},createXYGraph:function(){var a=[],b=[],c=this.xAxis,d=this.yAxis;this.pmh=d.viH+1;this.pmw=c.viW+1;this.pmy=this.pmx=0;var e;for(e=this.start;e<=this.end;e++){var f=this.data[e].axes[c.id].graphs[this.id],g=f.values,h=g.x,k=g.y,g=c.getCoordinate(h),l=d.getCoordinate(k);!isNaN(h)&&!isNaN(k)&&(a.push(g),b.push(l),(h=this.createBullet(f,g,l,e))||(h=0),k=this.labelText)&&(f=this.createLabel(f,g,l,k),this.allBullets.push(f),this.positionLabel(g,l,f,this.labelPosition,h))}this.drawLineGraph(a,b);this.launchAnimation()},
		createRadarGraph:function(){var a=this.valueAxis.stackType,b=[],c=[],d,e,f;for(f=this.start;f<=this.end;f++){var g=this.data[f].axes[this.valueAxis.id].graphs[this.id],h;h="none"==a||"3d"==a?g.values.value:g.values.close;if(isNaN(h))this.drawLineGraph(b,c),b=[],c=[];else{var k=this.y-(this.valueAxis.getCoordinate(h)-this.height),l=180-360/(this.end-this.start+1)*f;h=k*Math.sin(l/180*Math.PI);k*=Math.cos(l/180*Math.PI);b.push(h);c.push(k);(l=this.createBullet(g,h,k,f))||(l=0);var m=this.labelText;
			m&&(g=this.createLabel(g,h,k,m),this.allBullets.push(g),this.positionLabel(h,k,g,this.labelPosition,l));isNaN(d)&&(d=h);isNaN(e)&&(e=k)}}b.push(d);c.push(e);this.drawLineGraph(b,c);this.launchAnimation()},positionLabel:function(a,b,c,d,e){var f=c.getBBox();switch(d){case "left":a-=(f.width+e)/2+2;break;case "top":b-=(e+f.height)/2+1;break;case "right":a+=(f.width+e)/2+2;break;case "bottom":b+=(e+f.height)/2+1}c.translate(a,b)},getGradRotation:function(){var a=270;"horizontal"==this.gradientOrientation&&
		(a=0);return this.gradientRotation=a},createSerialGraph:function(){this.dashLengthSwitched=this.fillColorsSwitched=this.lineColorSwitched=void 0;var a=this.chart,b=this.id,c=this.index,d=this.data,e=this.chart.container,f=this.valueAxis,g=this.type,h=this.columnWidthReal,k=this.showBulletsAt;isNaN(this.columnWidth)||(h=this.columnWidth);isNaN(h)&&(h=.8);var l=this.useNegativeColorIfDown,m=this.width,n=this.height,p=this.y,q=this.rotate,r=this.columnCount,s=AmCharts.toCoordinate(this.cornerRadiusTop,
			h/2),w=this.connect,v=[],t=[],u,x,E,A,z=this.chart.graphs.length,H,F=this.dx/this.tcc,G=this.dy/this.tcc,V=f.stackType,N=this.labelPosition,ia=this.start,da=this.end,ba=this.scrollbar,Sa=this.categoryAxis,na=this.baseCoord,ta=this.negativeBase,L=this.columnIndex,Y=this.lineThickness,$=this.lineAlpha,oa=this.lineColorR,W=this.dashLength,Z=this.set,pa,I=N,D=this.getGradRotation(),aa=this.chart.columnSpacing,S=Sa.cellWidth,Ta=(S*h-r)/r;aa>Ta&&(aa=Ta);var T,y,bb,kb=n+1,lb=m+1,cb=0,mb=0,nb,ob,db,eb,pb=
			this.fillColorsR,Da=this.negativeFillColors,wa=this.negativeLineColor,Ua=this.fillAlphas,Va=this.negativeFillAlphas;"object"==typeof Ua&&(Ua=Ua[0]);"object"==typeof Va&&(Va=Va[0]);var fb=f.getCoordinate(f.min);f.logarithmic&&(fb=f.getCoordinate(f.minReal));this.minCoord=fb;this.resetBullet&&(this.bullet="none");if(!(ba||"line"!=g&&"smoothedLine"!=g&&"step"!=g||(1==d.length&&"step"!=g&&"none"==this.bullet&&(this.bullet="round",this.resetBullet=!0),!Da&&void 0==wa||l))){var Na=ta;Na>f.max&&(Na=f.max);
			Na<f.min&&(Na=f.min);f.logarithmic&&(Na=f.minReal);var Aa=f.getCoordinate(Na),Hb=f.getCoordinate(f.max);q?(kb=n,lb=Math.abs(Hb-Aa),nb=n,ob=Math.abs(fb-Aa),eb=mb=0,f.reversed?(cb=0,db=Aa):(cb=Aa,db=0)):(lb=m,kb=Math.abs(Hb-Aa),ob=m,nb=Math.abs(fb-Aa),db=cb=0,f.reversed?(eb=p,mb=Aa):eb=Aa+1)}var Ba=Math.round;this.pmx=Ba(cb);this.pmy=Ba(mb);this.pmh=Ba(kb);this.pmw=Ba(lb);this.nmx=Ba(db);this.nmy=Ba(eb);this.nmh=Ba(nb);this.nmw=Ba(ob);AmCharts.isModern||(this.nmy=this.nmx=0,this.nmh=this.height);this.clustered||
		(r=1);h="column"==g?(S*h-aa*(r-1))/r:S*h;1>h&&(h=1);var J;if("line"==g||"step"==g||"smoothedLine"==g){if(0<ia){for(J=ia-1;-1<J;J--)if(T=d[J],y=T.axes[f.id].graphs[b],bb=y.values.value,!isNaN(bb)){ia=J;break}if(this.lineColorField)for(J=ia;-1<J;J--)if(T=d[J],y=T.axes[f.id].graphs[b],y.lineColor){this.bulletColorSwitched=this.lineColorSwitched=y.lineColor;break}if(this.fillColorsField)for(J=ia;-1<J;J--)if(T=d[J],y=T.axes[f.id].graphs[b],y.fillColors){this.fillColorsSwitched=y.fillColors;break}if(this.dashLengthField)for(J=
			                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ia;-1<J;J--)if(T=d[J],y=T.axes[f.id].graphs[b],!isNaN(y.dashLength)){this.dashLengthSwitched=y.dashLength;break}}if(da<d.length-1)for(J=da+1;J<d.length;J++)if(T=d[J],y=T.axes[f.id].graphs[b],bb=y.values.value,!isNaN(bb)){da=J;break}}da<d.length-1&&da++;var O=[],P=[],Ea=!1;if("line"==g||"step"==g||"smoothedLine"==g)if(this.stackable&&"regular"==V||"100%"==V||this.fillToGraph)Ea=!0;var Ib=this.noStepRisers,gb=-1E3,hb=-1E3,ib=this.minDistance,Fa=!0,Wa=!1;for(J=ia;J<=da;J++){T=d[J];y=T.axes[f.id].graphs[b];
			y.index=J;var Xa,Ga=NaN;if(l&&void 0==this.openField)for(var qb=J+1;qb<d.length&&(!d[qb]||!(Xa=d[J+1].axes[f.id].graphs[b])||!Xa.values||(Ga=Xa.values.value,isNaN(Ga)));qb++);var X,Q,R,ea,la=NaN,C=NaN,B=NaN,M=NaN,K=NaN,Ha=NaN,xa=NaN,Ia=NaN,ya=NaN,ca=NaN,ja=NaN,fa=NaN,ga=NaN,U=NaN,rb=NaN,sb=NaN,ka=NaN,ra=void 0,Ca=pb,Oa=Ua,ua=oa,qa,sa,tb=this.proCandlesticks,Ya=this.pattern;void 0!=y.pattern&&(Ya=y.pattern);void 0!=y.color&&(Ca=y.color);y.fillColors&&(Ca=y.fillColors);isNaN(y.alpha)||(Oa=y.alpha);
			isNaN(y.dashLength)||(W=y.dashLength);var va=y.values;f.recalculateToPercents&&(va=y.percents);if(va){U=this.stackable&&"none"!=V&&"3d"!=V?va.close:va.value;if("candlestick"==g||"ohlc"==g)U=va.close,sb=va.low,xa=f.getCoordinate(sb),rb=va.high,ya=f.getCoordinate(rb);ka=va.open;B=f.getCoordinate(U);isNaN(ka)||(K=f.getCoordinate(ka),l&&(Ga=ka,ka=K=NaN));l&&(void 0==this.openField?Xa&&(Xa.isNegative=Ga<U?!0:!1,isNaN(Ga)&&(y.isNegative=!Fa)):y.isNegative=Ga>U?!0:!1);if(!ba)switch(this.showBalloonAt){case "close":y.y=
				B;break;case "open":y.y=K;break;case "high":y.y=ya;break;case "low":y.y=xa}var la=T.x[Sa.id],Pa=this.periodSpan-1,ma=Math.floor(S/2)+Math.floor(Pa*S/2),za=ma,Jb=0;"left"==this.stepDirection&&(Jb=(2*S+Pa*S)/2,la-=Jb);"start"==this.pointPosition&&(la-=S/2+Math.floor(Pa*S/2),ma=0,za=Math.floor(S)+Math.floor(Pa*S));"end"==this.pointPosition&&(la+=S/2+Math.floor(Pa*S/2),ma=Math.floor(S)+Math.floor(Pa*S),za=0);if(Ib){var ub=this.columnWidth;isNaN(ub)||(ma*=ub,za*=ub)}ba||(y.x=la);-1E5>la&&(la=-1E5);la>
			m+1E5&&(la=m+1E5);q?(C=B,M=K,K=B=la,isNaN(ka)&&!this.fillToGraph&&(M=na),Ha=xa,Ia=ya):(M=C=la,isNaN(ka)&&!this.fillToGraph&&(K=na));if(!tb&&U<ka||tb&&U<pa)y.isNegative=!0,Da&&(Ca=Da),Va&&(Oa=Va),void 0!=wa&&(ua=wa);Wa=!1;isNaN(U)||(l?U>Ga?(Fa&&(Wa=!0),Fa=!1):(Fa||(Wa=!0),Fa=!0):y.isNegative=U<ta?!0:!1,pa=U);switch(g){case "line":if(isNaN(U))w||(this.drawLineGraph(v,t,O,P),v=[],t=[],O=[],P=[]);else{if(Math.abs(C-gb)>=ib||Math.abs(B-hb)>=ib)v.push(C),t.push(B),gb=C,hb=B;ca=C;ja=B;fa=C;ga=B;!Ea||isNaN(K)||
			isNaN(M)||(O.push(M),P.push(K));if(Wa||void 0!=y.lineColor||void 0!=y.fillColors||!isNaN(y.dashLength))this.drawLineGraph(v,t,O,P),v=[C],t=[B],O=[],P=[],!Ea||isNaN(K)||isNaN(M)||(O.push(M),P.push(K)),l?Fa?(this.lineColorSwitched=oa,this.fillColorsSwitched=pb):(this.lineColorSwitched=wa,this.fillColorsSwitched=Da):(this.lineColorSwitched=y.lineColor,this.fillColorsSwitched=y.fillColors),this.dashLengthSwitched=y.dashLength;y.gap&&(this.drawLineGraph(v,t,O,P),v=[],t=[],O=[],P=[])}break;case "smoothedLine":if(isNaN(U))w||
			(this.drawSmoothedGraph(v,t,O,P),v=[],t=[],O=[],P=[]);else{if(Math.abs(C-gb)>=ib||Math.abs(B-hb)>=ib)v.push(C),t.push(B),gb=C,hb=B;ca=C;ja=B;fa=C;ga=B;!Ea||isNaN(K)||isNaN(M)||(O.push(M),P.push(K));void 0==y.lineColor&&void 0==y.fillColors&&isNaN(y.dashLength)||(this.drawSmoothedGraph(v,t,O,P),v=[C],t=[B],O=[],P=[],!Ea||isNaN(K)||isNaN(M)||(O.push(M),P.push(K)),this.lineColorSwitched=y.lineColor,this.fillColorsSwitched=y.fillColors,this.dashLengthSwitched=y.dashLength);y.gap&&(this.drawSmoothedGraph(v,
				t,O,P),v=[],t=[],O=[],P=[])}break;case "step":if(!isNaN(U)){if(void 0==y.lineColor&&void 0==y.fillColors&&isNaN(y.dashLength)||(this.drawLineGraph(v,t,O,P),v=[],t=[],O=[],P=[],this.lineColorSwitched=y.lineColor,this.fillColorsSwitched=y.fillColors,this.dashLengthSwitched=y.dashLength),q?(isNaN(u)||(v.push(u),t.push(B-ma)),t.push(B-ma),v.push(C),t.push(B+za),v.push(C),!Ea||isNaN(K)||isNaN(M)||(O.push(E),P.push(K-ma),O.push(M),P.push(K-ma),O.push(M),P.push(K+za))):(isNaN(x)||(t.push(x),v.push(u),t.push(x),
					v.push(C-ma)),v.push(C-ma),t.push(B),v.push(C+za),t.push(B),!Ea||isNaN(K)||isNaN(M)||(O.push(M-ma),P.push(A),O.push(M-ma),P.push(K),O.push(M+za),P.push(K))),u=C,x=B,E=M,A=K,ca=C,ja=B,fa=C,ga=B,Wa&&(this.drawLineGraph(v,t,O,P),v=[],t=[],O=[],P=[],l&&(Fa?(this.lineColorSwitched=oa,this.fillColorsSwitched=pb):(this.lineColorSwitched=wa,this.fillColorsSwitched=Da))),Ib||y.gap)u=x=NaN,this.drawLineGraph(v,t,O,P),v=[],t=[],O=[],P=[]}else if(!w){if(1>=this.periodSpan||1<this.periodSpan&&C-u>ma+za)u=x=NaN;
				this.drawLineGraph(v,t,O,P);v=[];t=[];O=[];P=[]}break;case "column":qa=ua;void 0!=y.lineColor&&(qa=y.lineColor);var Kb=this.topRadius;if(!isNaN(U)){l||(y.isNegative=U<ta?!0:!1);y.isNegative&&(Da&&(Ca=Da),void 0!=wa&&(qa=wa));var Lb=f.min,Mb=f.max;if(!(U<Lb&&ka<Lb||U>Mb&&ka>Mb))if(q){"3d"==V?(Q=B-(r/2-this.depthCount+1)*(h+aa)+aa/2+G*L,X=M+F*L):(Q=Math.floor(B-(r/2-L)*(h+aa)+aa/2),X=M);R=h;ca=C;ja=Q+h/2;fa=C;ga=Q+h/2;Q+R>n+L*G&&(R=n-Q+L*G);Q<L*G&&(R+=Q,Q=L*G);ea=C-M;var Yb=X;X=AmCharts.fitToBounds(X,
				0,m);ea+=Yb-X;ea=AmCharts.fitToBounds(ea,-X,m-X+F*L);Q<n&&0<R&&(ra=new AmCharts.Cuboid(e,ea,R,F-a.d3x,G-a.d3y,Ca,Oa,Y,qa,$,D,s,q,W,Ya,Kb),"bottom"!=N&&"inside"!=N&&"middle"!=N&&(N=f.reversed?"left":"right",0>U&&(N=f.reversed?"right":"left")),"regular"==V||"100%"==V)&&(ca+=this.dx)}else{"3d"==V?(X=C-(r/2-this.depthCount+1)*(h+aa)+aa/2+F*L,Q=K+G*L):(X=C-(r/2-L)*(h+aa)+aa/2,Q=K);R=h;ca=X+h/2;ja=B;fa=X+h/2;ga=B;X+R>m+L*F&&(R=m-X+L*F);X<L*F&&(R+=X-L*F,X=L*F);ea=B-K;var Zb=Q;Q=AmCharts.fitToBounds(Q,this.dy,
				n);ea+=Zb-Q;ea=AmCharts.fitToBounds(ea,-Q+G*L,n-Q);if(X<m+L*F&&0<R)if(this.showOnAxis&&(Q-=G/2),ra=new AmCharts.Cuboid(e,R,ea,F-a.d3x,G-a.d3y,Ca,Oa,Y,qa,this.lineAlpha,D,s,q,W,Ya,Kb),0>U&&"middle"!=N&&"inside"!=N)N="bottom";else if(N=I,"regular"==V||"100%"==V)ja+=this.dy}if(ra&&(sa=ra.set,y.columnGraphics=sa,sa.translate(X,Q),this.columnsSet.push(sa),(y.url||this.showHandOnHover)&&sa.setAttr("cursor","pointer"),!ba)){"none"==V&&(H=q?(this.end+1-J)*z-c:z*J+c);"3d"==V&&(q?(H=(this.end+1-J)*z-c-1E3*
				this.depthCount,ca+=F*this.columnIndex,fa+=F*this.columnIndex,y.y+=F*this.columnIndex):(H=(z-c)*(J+1)+1E3*this.depthCount,ca+=3,ja+=G*this.columnIndex+7,ga+=G*this.columnIndex,y.y+=G*this.columnIndex));if("regular"==V||"100%"==V)"inside"!=N&&(N="middle"),H=q?0<va.value?(this.end+1-J)*z+c:(this.end+1-J)*z-c:0<va.value?z*J+c:z*J-c;this.columnsArray.push({column:ra,depth:H});y.x=q?Q+R/2:X+R/2;this.ownColumns.push(ra);this.animateColumns(ra,J,C,M,B,K);this.addListeners(sa,y)}}break;case "candlestick":if(!isNaN(ka)&&
				!isNaN(U)){var jb,vb;qa=ua;void 0!=y.lineColor&&(qa=y.lineColor);if(q){if(Q=B-h/2,X=M,R=h,Q+R>n&&(R=n-Q),0>Q&&(R+=Q,Q=0),Q<n&&0<R){var wb,xb;U>ka?(wb=[C,Ia],xb=[M,Ha]):(wb=[M,Ia],xb=[C,Ha]);!isNaN(Ia)&&!isNaN(Ha)&&B<n&&0<B&&(jb=AmCharts.line(e,wb,[B,B],qa,$,Y),vb=AmCharts.line(e,xb,[B,B],qa,$,Y));ea=C-M;ra=new AmCharts.Cuboid(e,ea,R,F,G,Ca,Ua,Y,qa,$,D,s,q,W,Ya)}}else if(X=C-h/2,Q=K+Y/2,R=h,X+R>m&&(R=m-X),0>X&&(R+=X,X=0),ea=B-K,X<m&&0<R){tb&&U>=ka&&(Oa=0);var ra=new AmCharts.Cuboid(e,R,ea,F,G,Ca,Oa,
				Y,qa,$,D,s,q,W,Ya),yb,zb;U>ka?(yb=[B,ya],zb=[K,xa]):(yb=[K,ya],zb=[B,xa]);!isNaN(ya)&&!isNaN(xa)&&C<m&&0<C&&(jb=AmCharts.line(e,[C,C],yb,qa,$,Y),vb=AmCharts.line(e,[C,C],zb,qa,$,Y))}ra&&(sa=ra.set,y.columnGraphics=sa,Z.push(sa),sa.translate(X,Q-Y/2),(y.url||this.showHandOnHover)&&sa.setAttr("cursor","pointer"),jb&&(Z.push(jb),Z.push(vb)),ca=C,ja=B,q?(ga=B,fa=C,"open"==k&&(fa=M),"high"==k&&(fa=Ia),"low"==k&&(fa=Ha)):(ga=B,"open"==k&&(ga=K),"high"==k&&(ga=ya),"low"==k&&(ga=xa),fa=C),ba||(y.x=q?Q+R/
			2:X+R/2,this.animateColumns(ra,J,C,M,B,K),this.addListeners(sa,y)))}break;case "ohlc":if(!(isNaN(ka)||isNaN(rb)||isNaN(sb)||isNaN(U))){U<ka&&(y.isNegative=!0,void 0!=wa&&(ua=wa));var Ab,Bb,Cb;if(q){var Db=B-h/2,Db=AmCharts.fitToBounds(Db,0,n),Nb=AmCharts.fitToBounds(B,0,n),Eb=B+h/2,Eb=AmCharts.fitToBounds(Eb,0,n);Bb=AmCharts.line(e,[M,M],[Db,Nb],ua,$,Y,W);0<B&&B<n&&(Ab=AmCharts.line(e,[Ha,Ia],[B,B],ua,$,Y,W));Cb=AmCharts.line(e,[C,C],[Nb,Eb],ua,$,Y,W);ga=B;fa=C;"open"==k&&(fa=M);"high"==k&&(fa=Ia);
				"low"==k&&(fa=Ha)}else{var Fb=C-h/2,Fb=AmCharts.fitToBounds(Fb,0,m),Ob=AmCharts.fitToBounds(C,0,m),Gb=C+h/2,Gb=AmCharts.fitToBounds(Gb,0,m);Bb=AmCharts.line(e,[Fb,Ob],[K,K],ua,$,Y,W);0<C&&C<m&&(Ab=AmCharts.line(e,[C,C],[xa,ya],ua,$,Y,W));Cb=AmCharts.line(e,[Ob,Gb],[B,B],ua,$,Y,W);ga=B;"open"==k&&(ga=K);"high"==k&&(ga=ya);"low"==k&&(ga=xa);fa=C}Z.push(Bb);Z.push(Ab);Z.push(Cb);ca=C;ja=B}}if(!ba&&!isNaN(U)){var Pb=this.hideBulletsCount;if(this.end-this.start<=Pb||0===Pb){var Ja=this.createBullet(y,
				fa,ga,J);Ja||(Ja=0);var Qb=this.labelText;if(Qb){var ha=this.createLabel(y,0,0,Qb),Ka=0,La=0,Rb=ha.getBBox(),Qa=Rb.width,Ma=Rb.height;switch(N){case "left":Ka=-(Qa/2+Ja/2+3);break;case "top":La=-(Ma/2+Ja/2+3);break;case "right":Ka=Ja/2+2+Qa/2;break;case "bottom":q&&"column"==g?(ca=na,0>U||0<U&&f.reversed?(Ka=-6,ha.attr({"text-anchor":"end"})):(Ka=6,ha.attr({"text-anchor":"start"}))):(La=Ja/2+Ma/2,ha.x=-(Qa/2+2));break;case "middle":"column"==g&&(q?(La=-(Ma/2)+this.fontSize/2,Ka=-(C-M)/2-F,Math.abs(C-
				M)<Qa&&!this.showAllValueLabels&&(ha.remove(),ha=null)):(La=-(B-K)/2-G,Math.abs(B-K)<Ma&&!this.showAllValueLabels&&(ha.remove(),ha=null)));break;case "inside":q?(La=-(Ma/2)+this.fontSize/2,Ka=0>ea?Qa/2+6:-Qa/2-6):La=0>ea?Ma:-Ma}if(ha){if(isNaN(ja)||isNaN(ca))ha.remove(),ha=null;else if(ca+=Ka,ja+=La,ha.translate(ca,ja),q){if(0>ja||ja>n)ha.remove(),ha=null}else{var Sb=0;"3d"==V&&(Sb=F*L);if(0>ca||ca>m+Sb)ha.remove(),ha=null}ha&&this.allBullets.push(ha)}}if("regular"==V||"100%"==V){var Tb=f.totalText;
				if(Tb){var Ra=this.createLabel(y,0,0,Tb,f.totalTextColor);this.allBullets.push(Ra);var Ub=Ra.getBBox(),Vb=Ub.width,Wb=Ub.height,Za,$a,Xb=f.totals[J];Xb&&Xb.remove();var ab=0;"column"!=g&&(ab=Ja);q?($a=B,Za=0>U?C-Vb/2-2-ab:C+Vb/2+3+ab):(Za=C,$a=0>U?B+Wb/2+ab:B-Wb/2-3-ab);Ra.translate(Za,$a);f.totals[J]=Ra;q?(0>$a||$a>n)&&Ra.remove():(0>Za||Za>m)&&Ra.remove()}}}}}}if("line"==g||"step"==g||"smoothedLine"==g)"smoothedLine"==g?this.drawSmoothedGraph(v,t,O,P):this.drawLineGraph(v,t,O,P),ba||this.launchAnimation();
			this.bulletsHidden&&this.hideBullets()},animateColumns:function(a,b,c,d,e,f){var g=this;c=g.chart.startDuration;0<c&&!g.animationPlayed&&(g.seqAn?(a.set.hide(),g.animationArray.push(a),a=setTimeout(function(){g.animate.call(g)},c/(g.end-g.start+1)*(b-g.start)*1E3),g.timeOuts.push(a)):g.animate(a))},createLabel:function(a,b,c,d,e){var f=this.chart,g=a.labelColor;g||(g=this.color);g||(g=f.color);e&&(g=e);e=this.fontSize;void 0===e&&(this.fontSize=e=f.fontSize);var h=this.labelFunction;d=f.formatString(d,
			a);d=AmCharts.cleanFromEmpty(d);h&&(d=h(a,d));a=AmCharts.text(this.container,d,g,f.fontFamily,e);a.node.style.pointerEvents="none";a.translate(b,c);this.bulletSet.push(a);return a},positiveClip:function(a){a.clipRect(this.pmx,this.pmy,this.pmw,this.pmh)},negativeClip:function(a){a.clipRect(this.nmx,this.nmy,this.nmw,this.nmh)},drawLineGraph:function(a,b,c,d){var e=this;if(1<a.length){var f=e.set,g=e.chart,h=e.container,k=h.set(),l=h.set();f.push(l);f.push(k);var m=e.lineAlpha,n=e.lineThickness,f=
			e.fillAlphas,p=e.lineColorR,q=e.negativeLineAlpha;isNaN(q)&&(q=m);var r=e.lineColorSwitched;r&&(p=r);var r=e.fillColorsR,s=e.fillColorsSwitched;s&&(r=s);var w=e.dashLength;(s=e.dashLengthSwitched)&&(w=s);var s=e.negativeLineColor,v=e.negativeFillColors,t=e.negativeFillAlphas,u=e.baseCoord;0!==e.negativeBase&&(u=e.valueAxis.getCoordinate(e.negativeBase));m=AmCharts.line(h,a,b,p,m,n,w,!1,!0);k.push(m);k.click(function(a){e.handleGraphEvent(a,"clickGraph")}).mouseover(function(a){e.handleGraphEvent(a,
			"rollOverGraph")}).mouseout(function(a){e.handleGraphEvent(a,"rollOutGraph")});void 0===s||e.useNegativeColorIfDown||(n=AmCharts.line(h,a,b,s,q,n,w,!1,!0),l.push(n));if(0<f||0<t)if(n=a.join(";").split(";"),q=b.join(";").split(";"),m=g.type,"serial"==m?0<c.length?(c.reverse(),d.reverse(),n=a.concat(c),q=b.concat(d)):e.rotate?(q.push(q[q.length-1]),n.push(u),q.push(q[0]),n.push(u),q.push(q[0]),n.push(n[0])):(n.push(n[n.length-1]),q.push(u),n.push(n[0]),q.push(u),n.push(a[0]),q.push(q[0])):"xy"==m&&
			(b=e.fillToAxis)&&(AmCharts.isString(b)&&(b=g.getValueAxisById(b)),"H"==b.orientation?(u="top"==b.position?0:b.viH,n.push(n[n.length-1]),q.push(u),n.push(n[0]),q.push(u),n.push(a[0]),q.push(q[0])):(u="left"==b.position?0:b.viW,q.push(q[q.length-1]),n.push(u),q.push(q[0]),n.push(u),q.push(q[0]),n.push(n[0]))),a=e.gradientRotation,0<f&&(g=AmCharts.polygon(h,n,q,r,f,1,"#000",0,a),g.pattern(e.pattern),k.push(g)),v||void 0!==s)isNaN(t)&&(t=f),v||(v=s),h=AmCharts.polygon(h,n,q,v,t,1,"#000",0,a),h.pattern(e.pattern),
			l.push(h),l.click(function(a){e.handleGraphEvent(a,"clickGraph")}).mouseover(function(a){e.handleGraphEvent(a,"rollOverGraph")}).mouseout(function(a){e.handleGraphEvent(a,"rollOutGraph")});e.applyMask(l,k)}},applyMask:function(a,b){var c=a.length();"serial"!=this.chart.type||this.scrollbar||(this.positiveClip(b),0<c&&this.negativeClip(a))},drawSmoothedGraph:function(a,b,c,d){if(1<a.length){var e=this.set,f=this.container,g=f.set(),h=f.set();e.push(h);e.push(g);var k=this.lineAlpha,l=this.lineThickness,
			e=this.dashLength,m=this.fillAlphas,n=this.lineColorR,p=this.fillColorsR,q=this.negativeLineColor,r=this.negativeFillColors,s=this.negativeFillAlphas,w=this.baseCoord,v=this.lineColorSwitched;v&&(n=v);(v=this.fillColorsSwitched)&&(p=v);v=this.negativeLineAlpha;isNaN(v)&&(v=k);k=new AmCharts.Bezier(f,a,b,n,k,l,p,0,e);g.push(k.path);void 0!==q&&(l=new AmCharts.Bezier(f,a,b,q,v,l,p,0,e),h.push(l.path));0<m&&(k=a.join(";").split(";"),n=b.join(";").split(";"),l="",0<c.length?(c.push("M"),d.push("M"),c.reverse(),
			d.reverse(),k=a.concat(c),n=b.concat(d)):(this.rotate?(l+=" L"+w+","+b[b.length-1],l+=" L"+w+","+b[0]):(l+=" L"+a[a.length-1]+","+w,l+=" L"+a[0]+","+w),l+=" L"+a[0]+","+b[0]),c=new AmCharts.Bezier(f,k,n,NaN,0,0,p,m,e,l),c.path.pattern(this.pattern),g.push(c.path),r||void 0!==q)&&(s||(s=m),r||(r=q),a=new AmCharts.Bezier(f,a,b,NaN,0,0,r,s,e,l),a.path.pattern(this.pattern),h.push(a.path));this.applyMask(h,g)}},launchAnimation:function(){var a=this,b=a.chart.startDuration;if(0<b&&!a.animationPlayed){var c=
			a.set,d=a.bulletSet;AmCharts.VML||(c.attr({opacity:a.startAlpha}),d.attr({opacity:a.startAlpha}));c.hide();d.hide();a.seqAn?(b=setTimeout(function(){a.animateGraphs.call(a)},a.index*b*1E3),a.timeOuts.push(b)):a.animateGraphs()}},animateGraphs:function(){var a=this.chart,b=this.set,c=this.bulletSet,d=this.x,e=this.y;b.show();c.show();var f=a.startDuration,a=a.startEffect;b&&(this.rotate?(b.translate(-1E3,e),c.translate(-1E3,e)):(b.translate(d,-1E3),c.translate(d,-1E3)),b.animate({opacity:1,translate:d+
		","+e},f,a),c.animate({opacity:1,translate:d+","+e},f,a))},animate:function(a){var b=this.chart,c=this.animationArray;!a&&0<c.length&&(a=c[0],c.shift());c=AmCharts[AmCharts.getEffect(b.startEffect)];b=b.startDuration;a&&(this.rotate?a.animateWidth(b,c):a.animateHeight(b,c),a.set.show())},legendKeyColor:function(){var a=this.legendColor,b=this.lineAlpha;void 0===a&&(a=this.lineColorR,0===b&&(b=this.fillColorsR)&&(a="object"==typeof b?b[0]:b));return a},legendKeyAlpha:function(){var a=this.legendAlpha;
			void 0===a&&(a=this.lineAlpha,this.fillAlphas>a&&(a=this.fillAlphas),0===a&&(a=this.bulletAlpha),0===a&&(a=1));return a},createBullet:function(a,b,c,d){if(!isNaN(b)&&!isNaN(c)){d=this.container;var e=this.bulletOffset,f=this.bulletSize;isNaN(a.bulletSize)||(f=a.bulletSize);var g=a.values.value,h=this.maxValue,k=this.minValue,l=this.maxBulletSize,m=this.minBulletSize;isNaN(h)||(isNaN(g)||(f=(g-k)/(h-k)*(l-m)+m),k==h&&(f=l));h=f;this.bulletAxis&&(f=a.values.error,isNaN(f)||(g=f),f=this.bulletAxis.stepWidth*
			g);f<this.minBulletSize&&(f=this.minBulletSize);this.rotate?b=a.isNegative?b-e:b+e:c=a.isNegative?c+e:c-e;var n,m=this.bulletColorR;a.lineColor&&(this.bulletColorSwitched=a.lineColor);this.bulletColorSwitched&&(m=this.bulletColorSwitched);a.isNegative&&void 0!==this.bulletColorNegative&&(m=this.bulletColorNegative);void 0!==a.color&&(m=a.color);var p;"xy"==this.chart.type&&this.valueField&&(p=this.pattern,a.pattern&&(p=a.pattern));e=this.bullet;a.bullet&&(e=a.bullet);var g=this.bulletBorderThickness,
			k=this.bulletBorderColorR,l=this.bulletBorderAlpha,q=this.bulletAlpha;k||(k=m);this.useLineColorForBulletBorder&&(k=this.lineColorR);var r=a.alpha;isNaN(r)||(q=r);if("none"!=this.bullet||a.bullet)n=AmCharts.bullet(d,e,f,m,q,g,k,l,h,0,p);if(this.customBullet||a.customBullet)p=this.customBullet,a.customBullet&&(p=a.customBullet),p&&(n&&n.remove(),"function"==typeof p?(n=new p,n.chart=this.chart,a.bulletConfig&&(n.availableSpace=c,n.graph=this,n.graphDataItem=a,n.bulletY=c,a.bulletConfig.minCoord=this.minCoord-
			c,n.bulletConfig=a.bulletConfig),n.write(d),n=n.set):(this.chart.path&&(p=this.chart.path+p),n=d.set(),d=d.image(p,0,0,f,f),n.push(d),this.centerCustomBullets&&d.translate(-f/2,-f/2)));n&&((a.url||this.showHandOnHover)&&n.setAttr("cursor","pointer"),"serial"==this.chart.type&&(0>b-0||b-0>this.width||c<-f/2||c-0>this.height)&&(n.remove(),n=null),n&&(this.bulletSet.push(n),n.translate(b,c),this.addListeners(n,a),this.allBullets.push(n)),a.bx=b,a.by=c);a.bulletGraphics=n;return f}},showBullets:function(){var a=
			this.allBullets,b;this.bulletsHidden=!1;for(b=0;b<a.length;b++)a[b].show()},hideBullets:function(){var a=this.allBullets,b;this.bulletsHidden=!0;for(b=0;b<a.length;b++)a[b].hide()},addListeners:function(a,b){var c=this;a.mouseover(function(a){c.handleRollOver(b,a)}).mouseout(function(a){c.handleRollOut(b,a)}).touchend(function(a){c.handleRollOver(b,a);c.chart.panEventsEnabled&&c.handleClick(b,a)}).touchstart(function(a){c.handleRollOver(b,a)}).click(function(a){c.handleClick(b,a)}).dblclick(function(a){c.handleDoubleClick(b,
			a)}).contextmenu(function(a){c.handleRightClick(b,a)})},handleRollOver:function(a,b){if(a){var c=this.chart,d={type:"rollOverGraphItem",item:a,index:a.index,graph:this,target:this,chart:this.chart,event:b};this.fire("rollOverGraphItem",d);c.fire("rollOverGraphItem",d);clearTimeout(c.hoverInt);d=this.showBalloon;c.chartCursor&&"serial"==c.type&&(d=!1,!c.chartCursor.valueBalloonsEnabled&&this.showBalloon&&(d=!0));if(d){var d=c.formatString(this.balloonText,a,!0),e=this.balloonFunction;e&&(d=e(a,a.graph));
			d=AmCharts.cleanFromEmpty(d);e=c.getBalloonColor(this,a);c.balloon.showBullet=!1;c.balloon.pointerOrientation="V";var f=a.x,g=a.y;c.rotate&&(f=a.y,g=a.x);c.showBalloon(d,e,!0,f+c.marginLeftReal,g+c.marginTopReal)}}this.handleGraphEvent(b,"rollOverGraph")},handleRollOut:function(a,b){this.chart.hideBalloon();if(a){var c={type:"rollOutGraphItem",item:a,index:a.index,graph:this,target:this,chart:this.chart,event:b};this.fire("rollOutGraphItem",c);this.chart.fire("rollOutGraphItem",c)}this.handleGraphEvent(b,
			"rollOutGraph")},handleClick:function(a,b){if(a){var c={type:"clickGraphItem",item:a,index:a.index,graph:this,target:this,chart:this.chart,event:b};this.fire("clickGraphItem",c);this.chart.fire("clickGraphItem",c);AmCharts.getURL(a.url,this.urlTarget)}this.handleGraphEvent(b,"clickGraph")},handleGraphEvent:function(a,b){var c={type:b,graph:this,target:this,chart:this.chart,event:a};this.fire(b,c);this.chart.fire(b,c)},handleRightClick:function(a,b){if(a){var c={type:"rightClickGraphItem",item:a,index:a.index,
			graph:this,target:this,chart:this.chart,event:b};this.fire("rightClickGraphItem",c);this.chart.fire("rightClickGraphItem",c)}},handleDoubleClick:function(a,b){if(a){var c={type:"doubleClickGraphItem",item:a,index:a.index,graph:this,target:this,chart:this.chart,event:b};this.fire("doubleClickGraphItem",c);this.chart.fire("doubleClickGraphItem",c)}},zoom:function(a,b){this.start=a;this.end=b;this.draw()},changeOpacity:function(a){var b=this.set;b&&b.setAttr("opacity",a);if(b=this.ownColumns){var c;
			for(c=0;c<b.length;c++){var d=b[c].set;d&&d.setAttr("opacity",a)}}(b=this.bulletSet)&&b.setAttr("opacity",a)},destroy:function(){AmCharts.remove(this.set);AmCharts.remove(this.bulletSet);var a=this.timeOuts;if(a){var b;for(b=0;b<a.length;b++)clearTimeout(a[b])}this.timeOuts=[]}});AmCharts.ChartCursor=AmCharts.Class({construct:function(a){this.cname="ChartCursor";this.createEvents("changed","zoomed","onHideCursor","draw","selected","moved");this.enabled=!0;this.cursorAlpha=1;this.selectionAlpha=.2;this.cursorColor="#CC0000";this.categoryBalloonAlpha=1;this.color="#FFFFFF";this.type="cursor";this.zoomed=!1;this.zoomable=!0;this.pan=!1;this.categoryBalloonDateFormat="MMM DD, YYYY";this.categoryBalloonEnabled=this.valueBalloonsEnabled=!0;this.rolledOver=!1;this.cursorPosition=
		"middle";this.bulletsEnabled=this.skipZoomDispatch=!1;this.bulletSize=8;this.selectWithoutZooming=this.oneBalloonOnly=!1;this.graphBulletSize=1.7;this.animationDuration=.3;this.zooming=!1;this.adjustment=0;this.avoidBalloonOverlapping=!0;AmCharts.applyTheme(this,a,this.cname)},draw:function(){var a=this;a.destroy();var b=a.chart,c=b.container;a.rotate=b.rotate;a.container=c;c=c.set();c.translate(a.x,a.y);a.set=c;b.cursorSet.push(c);c=new AmCharts.AmBalloon;c.chart=b;a.categoryBalloon=c;AmCharts.copyProperties(b.balloon,
		c);c.cornerRadius=0;c.shadowAlpha=0;c.borderThickness=1;c.borderAlpha=1;c.showBullet=!1;var d=a.categoryBalloonColor;void 0===d&&(d=a.cursorColor);c.fillColor=d;c.fillAlpha=a.categoryBalloonAlpha;c.borderColor=d;c.color=a.color;d=a.valueLineAxis;AmCharts.isString(d)&&(d=b.getValueAxisById(d));d||(d=b.valueAxes[0]);a.valueLineAxis=d;a.valueLineBalloonEnabled&&(d=new AmCharts.AmBalloon,a.vaBalloon=d,AmCharts.copyProperties(c,d),d.animationDuration=0,a.rotate||(d.pointerOrientation="H"));a.rotate&&(c.pointerOrientation=
		"H");a.extraWidth=0;a.prevX=[];a.prevY=[];a.prevTX=[];a.prevTY=[];if(a.valueBalloonsEnabled)for(c=0;c<b.graphs.length;c++)d=new AmCharts.AmBalloon,d.chart=b,AmCharts.copyProperties(b.balloon,d),b.graphs[c].valueBalloon=d;"cursor"==a.type?a.createCursor():a.createCrosshair();a.interval=setInterval(function(){a.detectMovement.call(a)},40)},updateData:function(){var a=this.chart;this.data=a.chartData;this.firstTime=a.firstTime;this.lastTime=a.lastTime},createCursor:function(){var a=this.chart,b=this.cursorAlpha,
		c=a.categoryAxis,d=this.categoryBalloon,e,f,g,h;g=a.dx;h=a.dy;var k=this.width,l=this.height,a=a.rotate;d.pointerWidth=c.tickLength;a?(e=[0,k,k+g],f=[0,0,h],g=[g,0,0],h=[h,0,l]):(e=[g,0,0],f=[h,0,l],g=[0,k,k+g],h=[0,0,h]);this.line=e=AmCharts.line(this.container,e,f,this.cursorColor,b,1);(f=this.fullRectSet)?(f.push(e),f.translate(this.x,this.y)):this.set.push(e);this.valueLineEnabled&&(e=this.valueLineAlpha,isNaN(e)||(b=e),this.vLine=b=AmCharts.line(this.container,g,h,this.cursorColor,b,1),this.set.push(b));
		this.setBalloonBounds(d,c,a);(c=this.vaBalloon)&&this.setBalloonBounds(c,this.valueLineAxis,!a);this.hideCursor()},createCrosshair:function(){var a=this.cursorAlpha,b=this.container,c=AmCharts.line(b,[0,0],[0,this.height],this.cursorColor,a,1),a=AmCharts.line(b,[0,this.width],[0,0],this.cursorColor,a,1);this.set.push(c);this.set.push(a);this.vLine=c;this.hLine=a;this.hideCursor()},detectMovement:function(){var a=this.chart;if(a.mouseIsOver){var b=a.mouseX-this.x,c=a.mouseY-this.y;-.5<b&&b<this.width+
	1&&0<c&&c<this.height?(this.drawing?this.rolledOver||a.setMouseCursor("crosshair"):this.pan&&(this.rolledOver||a.setMouseCursor("move")),this.rolledOver=!0,(this.valueLineEnabled||this.valueLineBalloonEnabled)&&this.updateVLine(b,c),this.setPosition()):this.rolledOver&&(this.handleMouseOut(),this.rolledOver=!1)}else this.rolledOver&&(this.handleMouseOut(),this.rolledOver=!1)},updateVLine:function(a,b){var c=this.vLine,d=this.vaBalloon;if((c||d)&&!this.panning&&!this.drawing){c&&c.show();var e=this.valueLineAxis,
		f,g=this.rotate;g?(c&&c.translate(a,0),e&&(f=e.coordinateToValue(a)),c=a):(c&&c.translate(0,b),e&&(f=e.coordinateToValue(b)),c=b-1);if(d&&!isNaN(f)&&this.prevLineValue!=f){var h=e.formatValue(f,!0);d&&(this.setBalloonPosition(d,e,c,!g),d.showBalloon(h))}this.prevLineValue=f}},getMousePosition:function(){var a,b=this.width,c=this.height;a=this.chart;this.rotate?(a=a.mouseY-this.y,0>a&&(a=0),a>c&&(a=c)):(a=a.mouseX-this.x-1,0>a&&(a=0),a>b&&(a=b));return a},updateCrosshair:function(){var a=this.chart,
		b=a.mouseX-this.x,c=a.mouseY-this.y,d=this.vLine,e=this.hLine,b=AmCharts.fitToBounds(b,0,this.width),c=AmCharts.fitToBounds(c,0,this.height);0<this.cursorAlpha&&(d.show(),e.show(),d.translate(b,0),e.translate(0,c));this.zooming&&(a.hideXScrollbar&&(b=NaN),a.hideYScrollbar&&(c=NaN),this.updateSelectionSize(b,c));this.fireMoved();a.mouseIsOver||this.zooming||this.hideCursor()},fireMoved:function(){var a=this.chart,b={type:"moved",target:this};b.chart=a;b.zooming=this.zooming;b.x=a.mouseX-this.x;b.y=
		a.mouseY-this.y;this.fire("moved",b)},updateSelectionSize:function(a,b){AmCharts.remove(this.selection);var c=this.selectionPosX,d=this.selectionPosY,e=0,f=0,g=this.width,h=this.height;isNaN(a)||(c>a&&(e=a,g=c-a),c<a&&(e=c,g=a-c),c==a&&(e=a,g=0),g+=this.extraWidth,e-=this.extraWidth/2);isNaN(b)||(d>b&&(f=b,h=d-b),d<b&&(f=d,h=b-d),d==b&&(f=b,h=0),h+=this.extraWidth,f-=this.extraWidth/2);0<g&&0<h&&(c=AmCharts.rect(this.container,g,h,this.cursorColor,this.selectionAlpha),c.translate(e+this.x,f+this.y),
		this.selection=c)},arrangeBalloons:function(){var a=this.valueBalloons,b=this.x,c=this.y,d=this.height+c;a.sort(this.compareY);var e;for(e=0;e<a.length;e++){var f=a[e].balloon;f.setBounds(b,c,b+this.width,d);f.prevX=this.prevX[e];f.prevY=this.prevY[e];f.prevTX=this.prevTX[e];f.prevTY=this.prevTY[e];f.draw();d=f.yPos-3}this.arrangeBalloons2()},compareY:function(a,b){return a.yy<b.yy?1:-1},arrangeBalloons2:function(){var a=this.valueBalloons;a.reverse();var b,c=this.x,d,e,f=a.length;for(e=0;e<f;e++){var g=
		a[e].balloon;b=g.bottom;var h=g.bottom-g.yPos,k=f-e-1;0<e&&b-h<d+3&&(g.setBounds(c,d+3,c+this.width,d+h+3),g.prevX=this.prevX[k],g.prevY=this.prevY[k],g.prevTX=this.prevTX[k],g.prevTY=this.prevTY[k],g.draw());g.set&&g.set.show();this.prevX[k]=g.prevX;this.prevY[k]=g.prevY;this.prevTX[k]=g.prevTX;this.prevTY[k]=g.prevTY;d=g.bottom}},showBullets:function(){AmCharts.remove(this.allBullets);var a=this.container,b=a.set();this.set.push(b);this.set.show();this.allBullets=b;var b=this.chart.graphs,c;for(c=
			                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0;c<b.length;c++){var d=b[c];if(!d.hidden&&d.balloonText){var e=this.data[this.index].axes[d.valueAxis.id].graphs[d.id],f=e.y;if(!isNaN(f)){var g,h;g=e.x;this.rotate?(h=f,f=g):h=g;d=AmCharts.circle(a,this.bulletSize/2,this.chart.getBalloonColor(d,e,!0),d.cursorBulletAlpha);d.translate(h,f);this.allBullets.push(d)}}}},destroy:function(){this.clear();AmCharts.remove(this.selection);this.selection=null;var a=this.categoryBalloon;a&&a.destroy();(a=this.vaBalloon)&&a.destroy();this.destroyValueBalloons();
		AmCharts.remove(this.set)},clear:function(){clearInterval(this.interval)},destroyValueBalloons:function(){var a=this.valueBalloons;if(a){var b;for(b=0;b<a.length;b++)a[b].balloon.hide()}},zoom:function(a,b,c,d){var e=this.chart;this.destroyValueBalloons();this.zooming=!1;var f;this.rotate?this.selectionPosY=f=e.mouseY:this.selectionPosX=f=e.mouseX;this.start=a;this.end=b;this.startTime=c;this.endTime=d;this.zoomed=!0;d=e.categoryAxis;e=this.rotate;b=this.width;c=this.height;a=d.stepWidth;this.fullWidth&&
	(f=1,d.parseDates&&!d.equalSpacing&&(f=d.minDuration()),e?this.extraWidth=c=a*f:(this.extraWidth=b=a*f,this.categoryBalloon.minWidth=b),this.line&&this.line.remove(),this.line=AmCharts.rect(this.container,b,c,this.cursorColor,this.cursorAlpha,0),this.fullRectSet&&this.fullRectSet.push(this.line));this.stepWidth=a;this.tempVal=this.valueBalloonsEnabled;this.valueBalloonsEnabled=!1;this.setPosition();this.valueBalloonsEnabled=this.tempVal;this.hideCursor()},hideObj:function(a){a&&a.hide()},hideCursor:function(a){void 0===
	a&&(a=!0);this.hideObj(this.set);this.hideObj(this.categoryBalloon);this.hideObj(this.line);this.hideObj(this.vLine);this.hideObj(this.hLine);this.hideObj(this.vaBalloon);this.hideObj(this.allBullets);this.destroyValueBalloons();this.selectWithoutZooming||AmCharts.remove(this.selection);this.previousIndex=NaN;a&&this.fire("onHideCursor",{type:"onHideCursor",chart:this.chart,target:this});this.drawing||this.chart.setMouseCursor("auto");this.normalizeBulletSize()},setPosition:function(a,b,c){void 0===
	b&&(b=!0);if("cursor"==this.type){if(this.tempPosition=NaN,AmCharts.ifArray(this.data))isNaN(a)&&(a=this.getMousePosition()),(a!=this.previousMousePosition||!0===this.zoomed||this.oneBalloonOnly)&&!isNaN(a)&&("mouse"==this.cursorPosition&&(this.tempPosition=a),isNaN(c)&&(c=this.chart.categoryAxis.xToIndex(a)),c!=this.previousIndex||this.zoomed||"mouse"==this.cursorPosition||this.oneBalloonOnly)&&(this.updateCursor(c,b),this.zoomed=!1),this.previousMousePosition=a}else this.updateCrosshair()},normalizeBulletSize:function(){var a=
		this.resizedBullets;if(a)for(var b=0;b<a.length;b++){var c=a[b],d=c.bulletGraphics;d&&(d.translate(c.bx,c.by,1),c=c.graph,isNaN(this.graphBulletAlpha)||(d.setAttr("fill-opacity",c.bulletAlpha),d.setAttr("stroke-opacity",c.bulletBorderAlpha)))}},updateCursor:function(a,b){var c=this.chart,d=this.fullWidth,e=c.mouseX-this.x,f=c.mouseY-this.y;this.drawingNow&&(AmCharts.remove(this.drawingLine),this.drawingLine=AmCharts.line(this.container,[this.x+this.drawStartX,this.x+e],[this.y+this.drawStartY,this.y+
	f],this.cursorColor,1,1));if(this.enabled){void 0===b&&(b=!0);this.index=a+=this.adjustment;var g=c.categoryAxis,h=c.dx,k=c.dy,l=this.x+1,m=this.y+1,n=this.width,p=this.height,q=this.data[a];this.fireMoved();if(q){var r=q.x[g.id],s=c.rotate,w=this.stepWidth,v=this.categoryBalloon,t=this.firstTime,u=this.lastTime,x=this.cursorPosition,E=this.zooming,A=this.panning,z=c.graphs;if(c.mouseIsOver||E||A||this.forceShow)if(this.forceShow=!1,A){var h=this.panClickPos,c=this.panClickEndTime,E=this.panClickStartTime,
		H=this.panClickEnd,l=this.panClickStart,e=(s?h-f:h-e)/w;if(!g.parseDates||g.equalSpacing)e=Math.round(e);0!==e&&(h={type:"zoomed",target:this},h.chart=this.chart,g.parseDates&&!g.equalSpacing?(c+e>u&&(e=u-c),E+e<t&&(e=t-E),h.start=Math.round(E+e),h.end=Math.round(c+e),this.fire(h.type,h)):H+e>=this.data.length||0>l+e||(h.start=l+e,h.end=H+e,this.fire(h.type,h)))}else{"start"==x?r-=g.cellWidth/2:"mouse"==x&&(c.mouseIsOver?r=s?f-2:e-2:isNaN(this.tempPosition)||(r=this.tempPosition-2));if(s){if(0>r)if(E)r=
		0;else{this.hideCursor();return}if(r>p+1)if(E)r=p+1;else{this.hideCursor();return}}else{if(0>r)if(E)r=0;else{this.hideCursor();return}if(r>n)if(E)r=n;else{this.hideCursor();return}}if(0<this.cursorAlpha){var F=this.line;s?(t=0,u=r+k,d&&(u-=g.cellWidth/2)):(t=r,u=0,d&&(t-=g.cellWidth/2));w=this.animationDuration;0<w&&!this.zooming?isNaN(this.previousX)?F.translate(t,u):(F.translate(this.previousX,this.previousY),F.animate({translate:t+","+u},w,"easeOutSine")):F.translate(t,u);this.previousX=t;this.previousY=
		u;F.show()}this.linePos=s?r+k:r;E&&(d&&F.hide(),s?this.updateSelectionSize(NaN,r):this.updateSelectionSize(r,NaN));w=!0;E&&(w=!1);this.categoryBalloonEnabled&&w?(this.setBalloonPosition(v,g,r,s),(t=this.categoryBalloonFunction)?v.showBalloon(t(q.category)):g.parseDates?(g=AmCharts.formatDate(q.category,this.categoryBalloonDateFormat,c),-1!=g.indexOf("fff")&&(g=AmCharts.formatMilliseconds(g,q.category)),v.showBalloon(g)):v.showBalloon(AmCharts.fixNewLines(q.category))):v.hide();z&&this.bulletsEnabled&&
	this.showBullets();if(this.oneBalloonOnly){r=Infinity;for(g=0;g<z.length;g++)t=z[g],t.showBalloon&&!t.hidden&&t.balloonText&&(u=q.axes[t.valueAxis.id].graphs[t.id],v=u.y,isNaN(v)||(s?Math.abs(e-v)<r&&(r=Math.abs(e-v),H=t):Math.abs(f-v)<r&&(r=Math.abs(f-v),H=t)));this.mostCloseGraph&&(H=this.mostCloseGraph)}if(a!=this.previousIndex||H!=this.previousMostCloseGraph)if(this.normalizeBulletSize(),this.destroyValueBalloons(),this.resizedBullets=[],z&&this.valueBalloonsEnabled&&w&&c.balloon.enabled){this.valueBalloons=
		w=[];for(g=0;g<z.length;g++)if(t=z[g],v=NaN,(!this.oneBalloonOnly||t==H)&&t.showBalloon&&!t.hidden&&t.balloonText&&("step"==t.type&&"left"==t.stepDirection&&(q=this.data[a+1]),q)){if(u=q.axes[t.valueAxis.id].graphs[t.id])v=u.y;if(this.showNextAvailable&&isNaN(v)&&a+1<this.data.length)for(r=a+1;r<this.data.length;r++)if(d=this.data[r])if(u=d.axes[t.valueAxis.id].graphs[t.id],v=u.y,!isNaN(v))break;if(!isNaN(v)){d=u.x;k=!0;if(s){if(r=v,0>d||d>p)k=!1}else if(r=d,d=v,0>r||r>n+h+1)k=!1;k&&(k=this.graphBulletSize,
		F=this.graphBulletAlpha,1==k&&isNaN(F)||!AmCharts.isModern||!(x=u.bulletGraphics)||(x.getBBox(),x.translate(u.bx,u.by,k),this.resizedBullets.push(u),isNaN(F)||(x.setAttr("fill-opacity",F),x.setAttr("stroke-opacity",F))),k=t.valueBalloon,F=c.getBalloonColor(t,u),k.setBounds(l,m,l+n,m+p),k.pointerOrientation="H",x=this.balloonPointerOrientation,"vertical"==x&&(k.pointerOrientation="V"),"horizontal"==x&&(k.pointerOrientation="H"),k.changeColor(F),void 0!==t.balloonAlpha&&(k.fillAlpha=t.balloonAlpha),
	void 0!==t.balloonTextColor&&(k.color=t.balloonTextColor),k.setPosition(r+l,d+m),r=c.formatString(t.balloonText,u,!0),(d=t.balloonFunction)&&(r=d(u,t).toString()),""!==r&&(s?k.showBalloon(r):(k.text=r,k.show=!0),w.push({yy:v,balloon:k})),!s&&k.set&&(k.set.hide(),t=k.textDiv)&&(t.style.visibility="hidden"))}}this.avoidBalloonOverlapping&&this.arrangeBalloons()}b?(h={type:"changed"},h.index=a,h.chart=this.chart,h.zooming=E,h.mostCloseGraph=H,h.position=s?f:e,h.target=this,c.fire("changed",h),this.fire("changed",
		h),this.skipZoomDispatch=!1):(this.skipZoomDispatch=!0,c.updateLegendValues(a));this.previousIndex=a;this.previousMostCloseGraph=H}}}else this.hideCursor()},setBalloonPosition:function(a,b,c,d){var e=b.position,f=b.inside;b=b.axisThickness;var g=this.chart,h=g.dx,g=g.dy,k=this.x,l=this.y,m=this.width,n=this.height;d?(f&&("right"==e?a.setBounds(k,l+g,k+m+h,l+c+g):a.setBounds(k,l+g,k+m+h,l+c)),"right"==e?f?a.setPosition(k+m+h,l+c+g):a.setPosition(k+m+h+b,l+c+g):f?a.setPosition(k,l+c):a.setPosition(k-
		b,l+c)):"top"==e?f?a.setPosition(k+c+h,l+g):a.setPosition(k+c+h,l+g-b+1):f?a.setPosition(k+c,l+n):a.setPosition(k+c,l+n+b-1)},setBalloonBounds:function(a,b,c){var d=b.position,e=b.inside,f=b.axisThickness,g=b.tickLength,h=this.chart,k=h.dx,h=h.dy,l=this.x,m=this.y,n=this.width,p=this.height;c?(e&&(a.pointerWidth=0),"right"==d?e?a.setBounds(l,m+h,l+n+k,m+p+h):a.setBounds(l+n+k+f,m+h,l+n+1E3,m+p+h):e?a.setBounds(l,m,n+l,p+m):a.setBounds(-1E3,-1E3,l-g-f,m+p+15)):(a.maxWidth=n,b.parseDates&&(g=0,a.pointerWidth=
		0),"top"==d?e?a.setBounds(l+k,m+h,n+k+l,p+m):a.setBounds(l+k,-1E3,n+k+l,m+h-g-f):e?a.setBounds(l,m,n+l,p+m-g):a.setBounds(l,m+p+g+f-1,l+n,m+p+g+f))},enableDrawing:function(a){this.enabled=!a;this.hideCursor();this.rolledOver=!1;this.drawing=a},isZooming:function(a){a&&a!=this.zooming&&this.handleMouseDown("fake");a||a==this.zooming||this.handleMouseUp()},handleMouseOut:function(){if(this.enabled)if(this.zooming)this.setPosition();else{this.index=void 0;var a={type:"changed",index:void 0,target:this};
		a.chart=this.chart;this.fire("changed",a);this.hideCursor()}},handleReleaseOutside:function(){this.handleMouseUp()},handleMouseUp:function(){var a=this.chart,b=this.data,c;if(a){var d=a.mouseX-this.x,e=a.mouseY-this.y;if(this.drawingNow){this.drawingNow=!1;AmCharts.remove(this.drawingLine);c=this.drawStartX;var f=this.drawStartY;if(2<Math.abs(c-d)||2<Math.abs(f-e))c={type:"draw",target:this,chart:a,initialX:c,initialY:f,finalX:d,finalY:e},this.fire(c.type,c)}if(this.enabled&&0<b.length){if(this.pan)this.rolledOver=
		!1;else if(this.zoomable&&this.zooming){c=this.selectWithoutZooming?{type:"selected"}:{type:"zoomed"};c.target=this;c.chart=a;if("cursor"==this.type)this.rotate?this.selectionPosY=e:this.selectionPosX=e=d,2>Math.abs(e-this.initialMouse)&&this.fromIndex==this.index||(this.index<this.fromIndex?(c.end=this.fromIndex,c.start=this.index):(c.end=this.index,c.start=this.fromIndex),e=a.categoryAxis,e.parseDates&&!e.equalSpacing&&(b[c.start]&&(c.start=b[c.start].time),b[c.end]&&(c.end=a.getEndTime(b[c.end].time))),
	this.skipZoomDispatch||this.fire(c.type,c));else{var g=this.initialMouseX,h=this.initialMouseY;3>Math.abs(d-g)&&3>Math.abs(e-h)||(b=Math.min(g,d),f=Math.min(h,e),d=Math.abs(g-d),e=Math.abs(h-e),a.hideXScrollbar&&(b=0,d=this.width),a.hideYScrollbar&&(f=0,e=this.height),c.selectionHeight=e,c.selectionWidth=d,c.selectionY=f,c.selectionX=b,this.skipZoomDispatch||this.fire(c.type,c))}this.selectWithoutZooming||AmCharts.remove(this.selection)}this.skipZoomDispatch=!1}}this.panning=this.zooming=!1},showCursorAt:function(a){var b=
		this.chart.categoryAxis;a=b.parseDates?b.dateToCoordinate(a):b.categoryToCoordinate(a);this.previousMousePosition=NaN;this.forceShow=!0;this.setPosition(a,!1)},clearSelection:function(){AmCharts.remove(this.selection)},handleMouseDown:function(a){if(this.zoomable||this.pan||this.drawing){var b=this.rotate,c=this.chart,d=c.mouseX-this.x,e=c.mouseY-this.y;if(0<d&&d<this.width&&0<e&&e<this.height||"fake"==a)this.setPosition(),this.selectWithoutZooming&&AmCharts.remove(this.selection),this.drawing?(this.drawStartY=
		e,this.drawStartX=d,this.drawingNow=!0):this.pan?(this.zoomable=!1,c.setMouseCursor("move"),this.panning=!0,this.panClickPos=b?e:d,this.panClickStart=this.start,this.panClickEnd=this.end,this.panClickStartTime=this.startTime,this.panClickEndTime=this.endTime):this.zoomable&&("cursor"==this.type?(this.fromIndex=this.index,b?(this.initialMouse=e,this.selectionPosY=this.linePos):(this.initialMouse=d,this.selectionPosX=this.linePos)):(this.initialMouseX=d,this.initialMouseY=e,this.selectionPosX=d,this.selectionPosY=
		e),this.zooming=!0)}}});AmCharts.SimpleChartScrollbar=AmCharts.Class({construct:function(a){this.createEvents("zoomed");this.backgroundColor="#D4D4D4";this.backgroundAlpha=1;this.selectedBackgroundColor="#EFEFEF";this.scrollDuration=this.selectedBackgroundAlpha=1;this.resizeEnabled=!0;this.hideResizeGrips=!1;this.scrollbarHeight=20;this.updateOnReleaseOnly=!1;9>document.documentMode&&(this.updateOnReleaseOnly=!0);this.dragIconWidth=18;this.dragIconHeight=25;AmCharts.applyTheme(this,a,"SimpleChartScrollbar")},draw:function(){var a=
		this;a.destroy();a.interval=setInterval(function(){a.updateScrollbar.call(a)},40);var b=a.chart.container,c=a.rotate,d=a.chart,e=b.set();a.set=e;d.scrollbarsSet.push(e);var f,g;c?(f=a.scrollbarHeight,g=d.plotAreaHeight):(g=a.scrollbarHeight,f=d.plotAreaWidth);a.width=f;if((a.height=g)&&f){var h=AmCharts.rect(b,f,g,a.backgroundColor,a.backgroundAlpha,1,a.backgroundColor,a.backgroundAlpha);a.bg=h;e.push(h);h=AmCharts.rect(b,f,g,"#000",.005);e.push(h);a.invisibleBg=h;h.click(function(){a.handleBgClick()}).mouseover(function(){a.handleMouseOver()}).mouseout(function(){a.handleMouseOut()}).touchend(function(){a.handleBgClick()});
		h=AmCharts.rect(b,f,g,a.selectedBackgroundColor,a.selectedBackgroundAlpha);a.selectedBG=h;e.push(h);f=AmCharts.rect(b,f,g,"#000",.005);a.dragger=f;e.push(f);f.mousedown(function(b){a.handleDragStart(b)}).mouseup(function(){a.handleDragStop()}).mouseover(function(){a.handleDraggerOver()}).mouseout(function(){a.handleMouseOut()}).touchstart(function(b){a.handleDragStart(b)}).touchend(function(){a.handleDragStop()});f=d.pathToImages;c?(h=f+"dragIconH.gif",f=a.dragIconWidth,c=a.dragIconHeight):(h=f+"dragIcon.gif",
			c=a.dragIconWidth,f=a.dragIconHeight);g=b.image(h,0,0,c,f);var h=b.image(h,0,0,c,f),k=10,l=20;d.panEventsEnabled&&(k=25,l=a.scrollbarHeight);var m=AmCharts.rect(b,k,l,"#000",.005),n=AmCharts.rect(b,k,l,"#000",.005);n.translate(-(k-c)/2,-(l-f)/2);m.translate(-(k-c)/2,-(l-f)/2);c=b.set([g,n]);b=b.set([h,m]);a.iconLeft=c;a.iconRight=b;c.mousedown(function(){a.leftDragStart()}).mouseup(function(){a.leftDragStop()}).mouseover(function(){a.iconRollOver()}).mouseout(function(){a.iconRollOut()}).touchstart(function(b){a.leftDragStart()}).touchend(function(){a.leftDragStop()});
		b.mousedown(function(){a.rightDragStart()}).mouseup(function(){a.rightDragStop()}).mouseover(function(){a.iconRollOver()}).mouseout(function(){a.iconRollOut()}).touchstart(function(b){a.rightDragStart()}).touchend(function(){a.rightDragStop()});AmCharts.ifArray(d.chartData)?e.show():e.hide();a.hideDragIcons();a.clipDragger(!1)}e.translate(a.x,a.y)},updateScrollbarSize:function(a,b){var c=this.dragger,d,e,f,g;this.rotate?(d=0,e=a,f=this.width+1,g=b-a,c.setAttr("height",b-a),c.setAttr("y",e)):(d=a,
		e=0,f=b-a,g=this.height+1,c.setAttr("width",b-a),c.setAttr("x",d));this.clipAndUpdate(d,e,f,g)},updateScrollbar:function(){var a,b=!1,c,d,e=this.x,f=this.y,g=this.dragger,h=this.getDBox();c=h.x+e;d=h.y+f;var k=h.width,h=h.height,l=this.rotate,m=this.chart,n=this.width,p=this.height,q=m.mouseX,r=m.mouseY;a=this.initialMouse;this.forceClip&&this.clipDragger(!0);m.mouseIsOver&&(this.dragging&&(m=this.initialCoord,l?(a=m+(r-a),0>a&&(a=0),m=p-h,a>m&&(a=m),g.setAttr("y",a)):(a=m+(q-a),0>a&&(a=0),m=n-k,
	a>m&&(a=m),g.setAttr("x",a)),this.clipDragger(!0)),this.resizingRight&&(l?(a=r-d,a+d>p+f&&(a=p-d+f),0>a?(this.resizingRight=!1,b=this.resizingLeft=!0):(0===a&&(a=.1),g.setAttr("height",a))):(a=q-c,a+c>n+e&&(a=n-c+e),0>a?(this.resizingRight=!1,b=this.resizingLeft=!0):(0===a&&(a=.1),g.setAttr("width",a))),this.clipDragger(!0)),this.resizingLeft&&(l?(c=d,d=r,d<f&&(d=f),d>p+f&&(d=p+f),a=!0===b?c-d:h+c-d,0>a?(this.resizingRight=!0,this.resizingLeft=!1,g.setAttr("y",c+h-f)):(0===a&&(a=.1),g.setAttr("y",
		d-f),g.setAttr("height",a))):(d=q,d<e&&(d=e),d>n+e&&(d=n+e),a=!0===b?c-d:k+c-d,0>a?(this.resizingRight=!0,this.resizingLeft=!1,g.setAttr("x",c+k-e)):(0===a&&(a=.1),g.setAttr("x",d-e),g.setAttr("width",a))),this.clipDragger(!0)))},stopForceClip:function(){this.forceClip=!1},clipDragger:function(a){var b=this.getDBox();if(b){var c=b.x,d=b.y,e=b.width,b=b.height,f=!1;if(this.rotate){if(c=0,e=this.width+1,this.clipY!=d||this.clipH!=b)f=!0}else if(d=0,b=this.height+1,this.clipX!=c||this.clipW!=e)f=!0;
		f&&(this.clipAndUpdate(c,d,e,b),a&&(this.updateOnReleaseOnly||this.dispatchScrollbarEvent()))}},maskGraphs:function(){},clipAndUpdate:function(a,b,c,d){this.clipX=a;this.clipY=b;this.clipW=c;this.clipH=d;this.selectedBG.clipRect(a,b,c,d);this.updateDragIconPositions();this.maskGraphs(a,b,c,d)},dispatchScrollbarEvent:function(){if(this.skipEvent)this.skipEvent=!1;else{var a=this.chart;a.hideBalloon();var b=this.getDBox(),c=b.x,d=b.y,e=b.width,b=b.height;this.rotate?(c=d,e=this.height/b):e=this.width/
		e;a={type:"zoomed",position:c,chart:a,target:this,multiplier:e};this.fire(a.type,a)}},updateDragIconPositions:function(){var a=this.getDBox(),b=a.x,c=a.y,d=this.iconLeft,e=this.iconRight,f,g,h=this.scrollbarHeight;this.rotate?(f=this.dragIconWidth,g=this.dragIconHeight,d.translate(this.x+(h-g)/2,this.y+c-f/2),e.translate(this.x+(h-g)/2,this.y+c+a.height-f/2)):(f=this.dragIconHeight,g=this.dragIconWidth,d.translate(this.x+b-g/2,this.y+(h-f)/2),e.translate(this.x+b-g/2+a.width,this.y+(h-f)/2))},showDragIcons:function(){this.resizeEnabled&&
	(this.iconLeft.show(),this.iconRight.show())},hideDragIcons:function(){if(!this.resizingLeft&&!this.resizingRight&&!this.dragging){if(this.hideResizeGrips||!this.resizeEnabled)this.iconLeft.hide(),this.iconRight.hide();this.removeCursors()}},removeCursors:function(){this.chart.setMouseCursor("auto")},relativeZoom:function(a,b){this.dragger.stop();this.multiplier=a;this.position=b;this.updateScrollbarSize(b,this.rotate?b+this.height/a:b+this.width/a)},destroy:function(){this.clear();AmCharts.remove(this.set);
		AmCharts.remove(this.iconRight);AmCharts.remove(this.iconLeft)},clear:function(){clearInterval(this.interval)},handleDragStart:function(){var a=this.chart;this.dragger.stop();this.removeCursors();this.dragging=!0;var b=this.getDBox();this.rotate?(this.initialCoord=b.y,this.initialMouse=a.mouseY):(this.initialCoord=b.x,this.initialMouse=a.mouseX)},handleDragStop:function(){this.updateOnReleaseOnly&&(this.updateScrollbar(),this.skipEvent=!1,this.dispatchScrollbarEvent());this.dragging=!1;this.mouseIsOver&&
	this.removeCursors();this.updateScrollbar()},handleDraggerOver:function(){this.handleMouseOver()},leftDragStart:function(){this.dragger.stop();this.resizingLeft=!0},leftDragStop:function(){this.resizingLeft=!1;this.mouseIsOver||this.removeCursors();this.updateOnRelease()},rightDragStart:function(){this.dragger.stop();this.resizingRight=!0},rightDragStop:function(){this.resizingRight=!1;this.mouseIsOver||this.removeCursors();this.updateOnRelease()},iconRollOut:function(){this.removeCursors()},iconRollOver:function(){this.rotate?
		this.chart.setMouseCursor("n-resize"):this.chart.setMouseCursor("e-resize");this.handleMouseOver()},getDBox:function(){if(this.dragger)return this.dragger.getBBox()},handleBgClick:function(){var a=this;if(!a.resizingRight&&!a.resizingLeft){a.zooming=!0;var b,c,d=a.scrollDuration,e=a.dragger;b=a.getDBox();var f=b.height,g=b.width;c=a.chart;var h=a.y,k=a.x,l=a.rotate;l?(b="y",c=c.mouseY-f/2-h,c=AmCharts.fitToBounds(c,0,a.height-f)):(b="x",c=c.mouseX-g/2-k,c=AmCharts.fitToBounds(c,0,a.width-g));a.updateOnReleaseOnly?
		(a.skipEvent=!1,e.setAttr(b,c),a.dispatchScrollbarEvent(),a.clipDragger()):(c=Math.round(c),l?e.animate({y:c},d,">"):e.animate({x:c},d,">"),a.forceClip=!0,clearTimeout(a.forceTO),a.forceTO=setTimeout(function(){a.stopForceClip.call(a)},3E3*d))}},updateOnRelease:function(){this.updateOnReleaseOnly&&(this.updateScrollbar(),this.skipEvent=!1,this.dispatchScrollbarEvent())},handleReleaseOutside:function(){if(this.set){if(this.resizingLeft||this.resizingRight||this.dragging)this.updateOnRelease(),this.removeCursors();
		this.mouseIsOver=this.dragging=this.resizingRight=this.resizingLeft=!1;this.hideDragIcons();this.updateScrollbar()}},handleMouseOver:function(){this.mouseIsOver=!0;this.showDragIcons()},handleMouseOut:function(){this.mouseIsOver=!1;this.hideDragIcons()}});AmCharts.ChartScrollbar=AmCharts.Class({inherits:AmCharts.SimpleChartScrollbar,construct:function(a){this.cname="ChartScrollbar";AmCharts.ChartScrollbar.base.construct.call(this,a);this.graphLineColor="#BBBBBB";this.graphLineAlpha=0;this.graphFillColor="#BBBBBB";this.graphFillAlpha=1;this.selectedGraphLineColor="#888888";this.selectedGraphLineAlpha=0;this.selectedGraphFillColor="#888888";this.selectedGraphFillAlpha=1;this.gridCount=0;this.gridColor="#FFFFFF";this.gridAlpha=.7;this.skipEvent=this.autoGridCount=
		!1;this.color="#FFFFFF";this.scrollbarCreated=!1;this.offset=0;AmCharts.applyTheme(this,a,this.cname)},init:function(){var a=this.categoryAxis,b=this.chart;a||(this.categoryAxis=a=new AmCharts.CategoryAxis);a.chart=b;a.id="scrollbar";a.dateFormats=b.categoryAxis.dateFormats;a.markPeriodChange=b.categoryAxis.markPeriodChange;a.boldPeriodBeginning=b.categoryAxis.boldPeriodBeginning;a.axisItemRenderer=AmCharts.RecItem;a.axisRenderer=AmCharts.RecAxis;a.guideFillRenderer=AmCharts.RecFill;a.inside=!0;a.fontSize=
		this.fontSize;a.tickLength=0;a.axisAlpha=0;AmCharts.isString(this.graph)&&(this.graph=AmCharts.getObjById(b.graphs,this.graph));if(a=this.graph){var c=this.valueAxis;c||(this.valueAxis=c=new AmCharts.ValueAxis,c.visible=!1,c.scrollbar=!0,c.axisItemRenderer=AmCharts.RecItem,c.axisRenderer=AmCharts.RecAxis,c.guideFillRenderer=AmCharts.RecFill,c.labelsEnabled=!1,c.chart=b);b=this.unselectedGraph;b||(b=new AmCharts.AmGraph,b.scrollbar=!0,this.unselectedGraph=b,b.negativeBase=a.negativeBase,b.noStepRisers=
		a.noStepRisers);b=this.selectedGraph;b||(b=new AmCharts.AmGraph,b.scrollbar=!0,this.selectedGraph=b,b.negativeBase=a.negativeBase,b.noStepRisers=a.noStepRisers)}this.scrollbarCreated=!0},draw:function(){var a=this;AmCharts.ChartScrollbar.base.draw.call(a);a.scrollbarCreated||a.init();var b=a.chart,c=b.chartData,d=a.categoryAxis,e=a.rotate,f=a.x,g=a.y,h=a.width,k=a.height,l=b.categoryAxis,m=a.set;d.setOrientation(!e);d.parseDates=l.parseDates;d.rotate=e;d.equalSpacing=l.equalSpacing;d.minPeriod=l.minPeriod;
		d.startOnAxis=l.startOnAxis;d.viW=h;d.viH=k;d.width=h;d.height=k;d.gridCount=a.gridCount;d.gridColor=a.gridColor;d.gridAlpha=a.gridAlpha;d.color=a.color;d.tickLength=0;d.axisAlpha=0;d.autoGridCount=a.autoGridCount;d.parseDates&&!d.equalSpacing&&d.timeZoom(b.firstTime,b.lastTime);d.zoom(0,c.length-1);if(l=a.graph){var n=a.valueAxis,p=l.valueAxis;n.id=p.id;n.rotate=e;n.setOrientation(e);n.width=h;n.height=k;n.viW=h;n.viH=k;n.dataProvider=c;n.reversed=p.reversed;n.logarithmic=p.logarithmic;n.gridAlpha=
			0;n.axisAlpha=0;m.push(n.set);e?(n.y=g,n.x=0):(n.x=f,n.y=0);var f=Infinity,g=-Infinity,q;for(q=0;q<c.length;q++){var r=c[q].axes[p.id].graphs[l.id].values,s;for(s in r)if(r.hasOwnProperty(s)&&"percents"!=s&&"total"!=s){var w=r[s];w<f&&(f=w);w>g&&(g=w)}}Infinity!=f&&(n.minimum=f);-Infinity!=g&&(n.maximum=g+.1*(g-f));f==g&&(n.minimum-=1,n.maximum+=1);void 0!==a.minimum&&(n.minimum=a.minimum);void 0!==a.maximum&&(n.maximum=a.maximum);n.zoom(0,c.length-1);s=a.unselectedGraph;s.id=l.id;s.rotate=e;s.chart=
			b;s.data=c;s.valueAxis=n;s.chart=l.chart;s.categoryAxis=a.categoryAxis;s.periodSpan=l.periodSpan;s.valueField=l.valueField;s.openField=l.openField;s.closeField=l.closeField;s.highField=l.highField;s.lowField=l.lowField;s.lineAlpha=a.graphLineAlpha;s.lineColorR=a.graphLineColor;s.fillAlphas=a.graphFillAlpha;s.fillColorsR=a.graphFillColor;s.connect=l.connect;s.hidden=l.hidden;s.width=h;s.height=k;s.pointPosition=l.pointPosition;s.stepDirection=l.stepDirection;s.periodSpan=l.periodSpan;p=a.selectedGraph;
			p.id=l.id;p.rotate=e;p.chart=b;p.data=c;p.valueAxis=n;p.chart=l.chart;p.categoryAxis=d;p.periodSpan=l.periodSpan;p.valueField=l.valueField;p.openField=l.openField;p.closeField=l.closeField;p.highField=l.highField;p.lowField=l.lowField;p.lineAlpha=a.selectedGraphLineAlpha;p.lineColorR=a.selectedGraphLineColor;p.fillAlphas=a.selectedGraphFillAlpha;p.fillColorsR=a.selectedGraphFillColor;p.connect=l.connect;p.hidden=l.hidden;p.width=h;p.height=k;p.pointPosition=l.pointPosition;p.stepDirection=l.stepDirection;
			p.periodSpan=l.periodSpan;b=a.graphType;b||(b=l.type);s.type=b;p.type=b;c=c.length-1;s.zoom(0,c);p.zoom(0,c);p.set.click(function(){a.handleBackgroundClick()}).mouseover(function(){a.handleMouseOver()}).mouseout(function(){a.handleMouseOut()});s.set.click(function(){a.handleBackgroundClick()}).mouseover(function(){a.handleMouseOver()}).mouseout(function(){a.handleMouseOut()});m.push(s.set);m.push(p.set)}m.push(d.set);m.push(d.labelsSet);a.bg.toBack();a.invisibleBg.toFront();a.dragger.toFront();a.iconLeft.toFront();
		a.iconRight.toFront()},timeZoom:function(a,b,c){this.startTime=a;this.endTime=b;this.timeDifference=b-a;this.skipEvent=!AmCharts.toBoolean(c);this.zoomScrollbar();this.skipEvent||this.dispatchScrollbarEvent()},zoom:function(a,b){this.start=a;this.end=b;this.skipEvent=!0;this.zoomScrollbar()},dispatchScrollbarEvent:function(){if(this.skipEvent)this.skipEvent=!1;else{var a=this.chart.chartData,b,c,d=this.dragger.getBBox();b=d.x;var e=d.y,f=d.width,d=d.height,g=this.chart;this.rotate?(b=e,c=d):c=f;f=
	{type:"zoomed",target:this};f.chart=g;var h=this.categoryAxis,k=this.stepWidth,e=g.minSelectedTime,d=!1;if(h.parseDates&&!h.equalSpacing){if(a=g.lastTime,g=g.firstTime,h.minDuration(),h=Math.round(b/k)+g,b=this.dragging?h+this.timeDifference:Math.round((b+c)/k)+g,h>b&&(h=b),0<e&&b-h<e&&(b=Math.round(h+(b-h)/2),d=Math.round(e/2),h=b-d,b+=d,d=!0),b>a&&(b=a),b-e<h&&(h=b-e),h<g&&(h=g),h+e>b&&(b=h+e),h!=this.startTime||b!=this.endTime)this.startTime=h,this.endTime=b,f.start=h,f.end=b,f.startDate=new Date(h),
		f.endDate=new Date(b),this.fire(f.type,f)}else if(h.startOnAxis||(b+=k/2),c-=this.stepWidth/2,e=h.xToIndex(b),b=h.xToIndex(b+c),e!=this.start||this.end!=b)h.startOnAxis&&(this.resizingRight&&e==b&&b++,this.resizingLeft&&e==b&&(0<e?e--:b=1)),this.start=e,this.end=this.dragging?this.start+this.difference:b,f.start=this.start,f.end=this.end,h.parseDates&&(a[this.start]&&(f.startDate=new Date(a[this.start].time)),a[this.end]&&(f.endDate=new Date(a[this.end].time))),this.fire(f.type,f);d&&this.zoomScrollbar()}},
		zoomScrollbar:function(){var a,b;a=this.chart;var c=a.chartData,d=this.categoryAxis;d.parseDates&&!d.equalSpacing?(c=d.stepWidth,d=a.firstTime,a=c*(this.startTime-d),b=c*(this.endTime-d)):(a=c[this.start].x[d.id],b=c[this.end].x[d.id],c=d.stepWidth,d.startOnAxis||(d=c/2,a-=d,b+=d));this.stepWidth=c;this.updateScrollbarSize(a,b)},maskGraphs:function(a,b,c,d){var e=this.selectedGraph;e&&e.set.clipRect(a,b,c,d)},handleDragStart:function(){AmCharts.ChartScrollbar.base.handleDragStart.call(this);this.difference=
			this.end-this.start;this.timeDifference=this.endTime-this.startTime;0>this.timeDifference&&(this.timeDifference=0)},handleBackgroundClick:function(){AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);this.dragging||(this.difference=this.end-this.start,this.timeDifference=this.endTime-this.startTime,0>this.timeDifference&&(this.timeDifference=0))}});AmCharts.AmBalloon=AmCharts.Class({construct:function(a){this.cname="AmBalloon";this.enabled=!0;this.fillColor="#FFFFFF";this.fillAlpha=.8;this.borderThickness=2;this.borderColor="#FFFFFF";this.borderAlpha=1;this.cornerRadius=0;this.maximumWidth=220;this.horizontalPadding=8;this.verticalPadding=4;this.pointerWidth=6;this.pointerOrientation="V";this.color="#000000";this.adjustBorderColor=!0;this.show=this.follow=this.showBullet=!1;this.bulletSize=3;this.shadowAlpha=.4;this.shadowColor="#000000";this.fadeOutDuration=
		this.animationDuration=.3;this.fixedPosition=!1;this.offsetY=6;this.offsetX=1;this.textAlign="center";AmCharts.isModern||(this.offsetY*=1.5);AmCharts.applyTheme(this,a,this.cname)},draw:function(){var a=this.pointToX,b=this.pointToY;this.deltaSignX=this.deltaSignY=1;var c=this.chart;AmCharts.VML&&(this.fadeOutDuration=0);this.xAnim&&c.stopAnim(this.xAnim);this.yAnim&&c.stopAnim(this.yAnim);if(!isNaN(a)){var d=this.follow,e=c.container,f=this.set;AmCharts.remove(f);this.removeDiv();f=e.set();f.node.style.pointerEvents=
		"none";this.set=f;c.balloonsSet.push(f);if(this.show){var g=this.l,h=this.t,k=this.r,l=this.b,m=this.balloonColor,n=this.fillColor,p=this.borderColor,q=n;void 0!=m&&(this.adjustBorderColor?q=p=m:n=m);var r=this.horizontalPadding,s=this.verticalPadding,w=this.pointerWidth,v=this.pointerOrientation,t=this.cornerRadius,u=c.fontFamily,x=this.fontSize;void 0==x&&(x=c.fontSize);var m=document.createElement("div"),E=m.style;E.pointerEvents="none";E.position="absolute";var A=this.minWidth,z="";isNaN(A)||
	(z="min-width:"+(A-2*r)+"px; ");m.innerHTML='<div style="text-align:'+this.textAlign+"; "+z+"max-width:"+this.maxWidth+"px; font-size:"+x+"px; color:"+this.color+"; font-family:"+u+'">'+this.text+"</div>";c.chartDiv.appendChild(m);this.textDiv=m;x=m.offsetWidth;u=m.offsetHeight;m.clientHeight&&(x=m.clientWidth,u=m.clientHeight);u+=2*s;z=x+2*r;!isNaN(A)&&z<A&&(z=A);window.opera&&(u+=2);var H=!1,x=this.offsetY;c.handDrawn&&(x+=c.handDrawScatter+2);"H"!=v?(A=a-z/2,b<h+u+10&&"down"!=v?(H=!0,d&&(b+=x),
		x=b+w,this.deltaSignY=-1):(d&&(b-=x),x=b-u-w,this.deltaSignY=1)):(2*w>u&&(w=u/2),x=b-u/2,a<g+(k-g)/2?(A=a+w,this.deltaSignX=-1):(A=a-z-w,this.deltaSignX=1));x+u>=l&&(x=l-u);x<h&&(x=h);A<g&&(A=g);A+z>k&&(A=k-z);var h=x+s,l=A+r,s=this.shadowAlpha,F=this.shadowColor,r=this.borderThickness,G=this.bulletSize,V;0<t||0===w?(0<s&&(a=AmCharts.rect(e,z,u,n,0,r+1,F,s,this.cornerRadius),AmCharts.isModern?a.translate(1,1):a.translate(4,4),f.push(a)),n=AmCharts.rect(e,z,u,n,this.fillAlpha,r,p,this.borderAlpha,
		this.cornerRadius),this.showBullet&&(V=AmCharts.circle(e,G,q,this.fillAlpha),f.push(V))):(q=[],t=[],"H"!=v?(g=a-A,g>z-w&&(g=z-w),g<w&&(g=w),q=[0,g-w,a-A,g+w,z,z,0,0],t=H?[0,0,b-x,0,0,u,u,0]:[u,u,b-x,u,u,0,0,u]):(q=b-x,q>u-w&&(q=u-w),q<w&&(q=w),t=[0,q-w,b-x,q+w,u,u,0,0],q=a<g+(k-g)/2?[0,0,A<a?0:a-A,0,0,z,z,0]:[z,z,A+z>a?z:a-A,z,z,0,0,z]),0<s&&(a=AmCharts.polygon(e,q,t,n,0,r,F,s),a.translate(1,1),f.push(a)),n=AmCharts.polygon(e,q,t,n,this.fillAlpha,r,p,this.borderAlpha));this.bg=n;f.push(n);n.toFront();
		e=1*this.deltaSignX;E.left=l+"px";E.top=h+"px";f.translate(A-e,x);n=n.getBBox();this.bottom=x+u+1;this.yPos=n.y+x;V&&V.translate(this.pointToX-A+e,b-x);b=this.animationDuration;0<this.animationDuration&&!d&&!isNaN(this.prevX)&&(f.translate(this.prevX,this.prevY),f.animate({translate:A-e+","+x},b,"easeOutSine"),m&&(E.left=this.prevTX+"px",E.top=this.prevTY+"px",this.xAnim=c.animate({node:m},"left",this.prevTX,l,b,"easeOutSine","px"),this.yAnim=c.animate({node:m},"top",this.prevTY,h,b,"easeOutSine",
			"px")));this.prevX=A-e;this.prevY=x;this.prevTX=l;this.prevTY=h}}},followMouse:function(){if(this.follow&&this.show){var a=this.chart.mouseX-this.offsetX*this.deltaSignX,b=this.chart.mouseY;this.pointToX=a;this.pointToY=b;if(a!=this.previousX||b!=this.previousY)if(this.previousX=a,this.previousY=b,0===this.cornerRadius)this.draw();else{var c=this.set;if(c){var d=c.getBBox(),a=a-d.width/2,e=b-d.height-10;a<this.l&&(a=this.l);a>this.r-d.width&&(a=this.r-d.width);e<this.t&&(e=b+10);c.translate(a,e);
		b=this.textDiv.style;b.left=a+this.horizontalPadding+"px";b.top=e+this.verticalPadding+"px"}}}},changeColor:function(a){this.balloonColor=a},setBounds:function(a,b,c,d){this.l=a;this.t=b;this.r=c;this.b=d;this.destroyTO&&clearTimeout(this.destroyTO)},showBalloon:function(a){this.text=a;this.show=!0;this.destroyTO&&clearTimeout(this.destroyTO);a=this.chart;this.fadeAnim1&&a.stopAnim(this.fadeAnim1);this.fadeAnim2&&a.stopAnim(this.fadeAnim2);this.draw()},hide:function(){var a=this,b=a.fadeOutDuration,
		c=a.chart;if(0<b){a.destroyTO=setTimeout(function(){a.destroy.call(a)},1E3*b);a.follow=!1;a.show=!1;var d=a.set;d&&(d.setAttr("opacity",a.fillAlpha),a.fadeAnim1=d.animate({opacity:0},b,"easeInSine"));a.textDiv&&(a.fadeAnim2=c.animate({node:a.textDiv},"opacity",1,0,b,"easeInSine",""))}else a.show=!1,a.follow=!1,a.destroy()},setPosition:function(a,b,c){this.pointToX=a;this.pointToY=b;c&&(a==this.previousX&&b==this.previousY||this.draw());this.previousX=a;this.previousY=b},followCursor:function(a){var b=
		this;(b.follow=a)?(b.pShowBullet=b.showBullet,b.showBullet=!1):void 0!==b.pShowBullet&&(b.showBullet=b.pShowBullet);clearInterval(b.interval);var c=b.chart.mouseX,d=b.chart.mouseY;!isNaN(c)&&a&&(b.pointToX=c-b.offsetX*b.deltaSignX,b.pointToY=d,b.followMouse(),b.interval=setInterval(function(){b.followMouse.call(b)},40))},removeDiv:function(){if(this.textDiv){var a=this.textDiv.parentNode;a&&a.removeChild(this.textDiv)}},destroy:function(){clearInterval(this.interval);AmCharts.remove(this.set);this.removeDiv();
		this.set=null}});AmCharts.AmCoordinateChart=AmCharts.Class({inherits:AmCharts.AmChart,construct:function(a){AmCharts.AmCoordinateChart.base.construct.call(this,a);this.theme=a;this.createEvents("rollOverGraphItem","rollOutGraphItem","clickGraphItem","doubleClickGraphItem","rightClickGraphItem","clickGraph","rollOverGraph","rollOutGraph");this.startAlpha=1;this.startDuration=0;this.startEffect="elastic";this.sequencedAnimation=!0;this.colors="#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
		this.balloonDateFormat="MMM DD, YYYY";this.valueAxes=[];this.graphs=[];this.guides=[];this.gridAboveGraphs=!1;AmCharts.applyTheme(this,a,"AmCoordinateChart")},initChart:function(){AmCharts.AmCoordinateChart.base.initChart.call(this);var a=this.categoryAxis;a&&(this.categoryAxis=AmCharts.processObject(a,AmCharts.CategoryAxis,this.theme));this.processValueAxes();this.createValueAxes();this.processGraphs();this.processGuides();AmCharts.VML&&(this.startAlpha=1);this.setLegendData(this.graphs);this.gridAboveGraphs&&
	this.gridSet.toFront()},createValueAxes:function(){if(0===this.valueAxes.length){var a=new AmCharts.ValueAxis;this.addValueAxis(a)}},parseData:function(){this.processValueAxes();this.processGraphs()},parseSerialData:function(){var a=this.graphs,b,c={},d=this.seriesIdField;d||(d=this.categoryField);this.chartData=[];var e=this.dataProvider;if(e){var f=!1,g,h=this.categoryAxis,k,l;h&&(f=h.parseDates,k=h.forceShowField,l=h.labelColorField,g=h.categoryFunction);var m,n,p={},q;f&&(b=AmCharts.extractPeriod(h.minPeriod),
		m=b.period,n=b.count,q=AmCharts.getPeriodDuration(m,n));var r={};this.lookupTable=r;var s,w=this.dataDateFormat,v={};for(s=0;s<e.length;s++){var t={},u=e[s];b=u[this.categoryField];t.dataContext=u;t.category=g?g(b,u,h):String(b);k&&(t.forceShow=u[k]);l&&(t.labelColor=u[l]);r[u[d]]=t;if(f&&(b=h.categoryFunction?h.categoryFunction(b,u,h):b instanceof Date?AmCharts.newDate(b,h.minPeriod):w?AmCharts.stringToDate(b,w):new Date(b),b=AmCharts.resetDateToMin(b,m,n,h.firstDayOfWeek),t.category=b,t.time=b.getTime(),
			isNaN(t.time)))continue;var x=this.valueAxes;t.axes={};t.x={};var E;for(E=0;E<x.length;E++){var A=x[E].id;t.axes[A]={};t.axes[A].graphs={};var z;for(z=0;z<a.length;z++){b=a[z];var H=b.id,F=b.periodValue;if(b.valueAxis.id==A){t.axes[A].graphs[H]={};var G={};G.index=s;var V=u;b.dataProvider&&(V=c);G.values=this.processValues(V,b,F);!b.connect&&v&&v[H]&&t.time-p[H]>1.1*q&&(v[H].gap=!0);this.processFields(b,G,V);G.category=t.category;G.serialDataItem=t;G.graph=b;t.axes[A].graphs[H]=G;p[H]=t.time;v[H]=
		G}}}this.chartData[s]=t}}for(c=0;c<a.length;c++)b=a[c],b.dataProvider&&this.parseGraphData(b)},processValues:function(a,b,c){var d={},e,f=!1;"candlestick"!=b.type&&"ohlc"!=b.type||""===c||(f=!0);e=Number(a[b.valueField+c]);isNaN(e)||(d.value=e);e=Number(a[b.errorField+c]);isNaN(e)||(d.error=e);f&&(c="Open");e=Number(a[b.openField+c]);isNaN(e)||(d.open=e);f&&(c="Close");e=Number(a[b.closeField+c]);isNaN(e)||(d.close=e);f&&(c="Low");e=Number(a[b.lowField+c]);isNaN(e)||(d.low=e);f&&(c="High");e=Number(a[b.highField+
	c]);isNaN(e)||(d.high=e);return d},parseGraphData:function(a){var b=a.dataProvider,c=a.seriesIdField;c||(c=this.seriesIdField);c||(c=this.categoryField);var d;for(d=0;d<b.length;d++){var e=b[d],f=this.lookupTable[String(e[c])],g=a.valueAxis.id;f&&(g=f.axes[g].graphs[a.id],g.serialDataItem=f,g.values=this.processValues(e,a,a.periodValue),this.processFields(a,g,e))}},addValueAxis:function(a){a.chart=this;this.valueAxes.push(a);this.validateData()},removeValueAxesAndGraphs:function(){var a=this.valueAxes,
		b;for(b=a.length-1;-1<b;b--)this.removeValueAxis(a[b])},removeValueAxis:function(a){var b=this.graphs,c;for(c=b.length-1;0<=c;c--){var d=b[c];d&&d.valueAxis==a&&this.removeGraph(d)}b=this.valueAxes;for(c=b.length-1;0<=c;c--)b[c]==a&&b.splice(c,1);this.validateData()},addGraph:function(a){this.graphs.push(a);this.chooseGraphColor(a,this.graphs.length-1);this.validateData()},removeGraph:function(a){var b=this.graphs,c;for(c=b.length-1;0<=c;c--)b[c]==a&&(b.splice(c,1),a.destroy());this.validateData()},
		processValueAxes:function(){var a=this.valueAxes,b;for(b=0;b<a.length;b++){var c=a[b],c=AmCharts.processObject(c,AmCharts.ValueAxis,this.theme);a[b]=c;c.chart=this;c.id||(c.id="valueAxisAuto"+b+"_"+(new Date).getTime());void 0===c.usePrefixes&&(c.usePrefixes=this.usePrefixes)}},processGuides:function(){var a=this.guides,b=this.categoryAxis;if(a)for(var c=0;c<a.length;c++){var d=a[c];(void 0!==d.category||void 0!==d.date)&&b&&b.addGuide(d);var e=d.valueAxis;e?(AmCharts.isString(e)&&(e=this.getValueAxisById(e)),
			e?e.addGuide(d):this.valueAxes[0].addGuide(d)):isNaN(d.value)||this.valueAxes[0].addGuide(d)}},processGraphs:function(){var a=this.graphs,b;for(b=0;b<a.length;b++){var c=a[b],c=AmCharts.processObject(c,AmCharts.AmGraph,this.theme);a[b]=c;this.chooseGraphColor(c,b);c.chart=this;AmCharts.isString(c.valueAxis)&&(c.valueAxis=this.getValueAxisById(c.valueAxis));c.valueAxis||(c.valueAxis=this.valueAxes[0]);c.id||(c.id="graphAuto"+b+"_"+(new Date).getTime())}},formatString:function(a,b,c){var d=b.graph,
			e=d.valueAxis;e.duration&&b.values.value&&(e=AmCharts.formatDuration(b.values.value,e.duration,"",e.durationUnits,e.maxInterval,e.numberFormatter),a=a.split("[[value]]").join(e));a=AmCharts.massReplace(a,{"[[title]]":d.title,"[[description]]":b.description});a=c?AmCharts.fixNewLines(a):AmCharts.fixBrakes(a);return a=AmCharts.cleanFromEmpty(a)},getBalloonColor:function(a,b,c){var d=a.lineColor,e=a.balloonColor;c&&(e=d);c=a.fillColorsR;"object"==typeof c?d=c[0]:void 0!==c&&(d=c);b.isNegative&&(c=a.negativeLineColor,
			a=a.negativeFillColors,"object"==typeof a?c=a[0]:void 0!==a&&(c=a),void 0!==c&&(d=c));void 0!==b.color&&(d=b.color);void 0===e&&(e=d);return e},getGraphById:function(a){return AmCharts.getObjById(this.graphs,a)},getValueAxisById:function(a){return AmCharts.getObjById(this.valueAxes,a)},processFields:function(a,b,c){if(a.itemColors){var d=a.itemColors,e=b.index;b.color=e<d.length?d[e]:AmCharts.randomColor()}d="lineColor color alpha fillColors description bullet customBullet bulletSize bulletConfig url labelColor dashLength pattern".split(" ");
			for(e=0;e<d.length;e++){var f=d[e],g=a[f+"Field"];g&&(g=c[g],AmCharts.isDefined(g)&&(b[f]=g))}b.dataContext=c},chooseGraphColor:function(a,b){if(a.lineColor)a.lineColorR=a.lineColor;else{var c;c=this.colors.length>b?this.colors[b]:AmCharts.randomColor();a.lineColorR=c}a.fillColorsR=a.fillColors?a.fillColors:a.lineColorR;a.bulletBorderColorR=a.bulletBorderColor?a.bulletBorderColor:a.useLineColorForBulletBorder?a.lineColorR:a.bulletColor;a.bulletColorR=a.bulletColor?a.bulletColor:a.lineColorR;if(c=
				this.patterns)a.pattern=c[b]},handleLegendEvent:function(a){var b=a.type;a=a.dataItem;if(!this.legend.data&&a){var c=a.hidden,d=a.showBalloon;switch(b){case "clickMarker":this.textClickEnabled&&(d?this.hideGraphsBalloon(a):this.showGraphsBalloon(a));break;case "clickLabel":d?this.hideGraphsBalloon(a):this.showGraphsBalloon(a);break;case "rollOverItem":c||this.highlightGraph(a);break;case "rollOutItem":c||this.unhighlightGraph();break;case "hideItem":this.hideGraph(a);break;case "showItem":this.showGraph(a)}}},
		highlightGraph:function(a){var b=this.graphs,c,d=.2;this.legend&&(d=this.legend.rollOverGraphAlpha);if(1!=d)for(c=0;c<b.length;c++){var e=b[c];e!=a&&e.changeOpacity(d)}},unhighlightGraph:function(){var a;this.legend&&(a=this.legend.rollOverGraphAlpha);if(1!=a){a=this.graphs;var b;for(b=0;b<a.length;b++)a[b].changeOpacity(1)}},showGraph:function(a){a.switchable&&(a.hidden=!1,this.dataChanged=!0,"xy"!=this.type&&(this.marginsUpdated=!1),this.chartCreated&&this.initChart())},hideGraph:function(a){a.switchable&&
		(this.dataChanged=!0,"xy"!=this.type&&(this.marginsUpdated=!1),a.hidden=!0,this.chartCreated&&this.initChart())},hideGraphsBalloon:function(a){a.showBalloon=!1;this.updateLegend()},showGraphsBalloon:function(a){a.showBalloon=!0;this.updateLegend()},updateLegend:function(){this.legend&&this.legend.invalidateSize()},resetAnimation:function(){var a=this.graphs;if(a){var b;for(b=0;b<a.length;b++)a[b].animationPlayed=!1}},animateAgain:function(){this.resetAnimation();this.validateNow()}});AmCharts.AmSlicedChart=AmCharts.Class({inherits:AmCharts.AmChart,construct:function(a){this.createEvents("rollOverSlice","rollOutSlice","clickSlice","pullOutSlice","pullInSlice","rightClickSlice");AmCharts.AmSlicedChart.base.construct.call(this,a);this.colors="#FF0F00 #FF6600 #FF9E01 #FCD202 #F8FF01 #B0DE09 #04D215 #0D8ECF #0D52D1 #2A0CD0 #8A0CCF #CD0D74 #754DEB #DDDDDD #999999 #333333 #000000 #57032A #CA9726 #990000 #4B0C25".split(" ");this.alpha=1;this.groupPercent=0;this.groupedTitle="Other";this.groupedPulled=
		!1;this.groupedAlpha=1;this.marginLeft=0;this.marginBottom=this.marginTop=10;this.marginRight=0;this.hoverAlpha=1;this.outlineColor="#FFFFFF";this.outlineAlpha=0;this.outlineThickness=1;this.startAlpha=0;this.startDuration=1;this.startEffect="bounce";this.sequencedAnimation=!0;this.pullOutDuration=1;this.pullOutEffect="bounce";this.pullOnHover=this.pullOutOnlyOne=!1;this.labelsEnabled=!0;this.labelTickColor="#000000";this.labelTickAlpha=.2;this.hideLabelsPercent=0;this.urlTarget="_self";this.autoMarginOffset=
		10;this.gradientRatio=[];this.maxLabelWidth=200;AmCharts.applyTheme(this,a,"AmSlicedChart")},initChart:function(){AmCharts.AmSlicedChart.base.initChart.call(this);this.dataChanged&&(this.parseData(),this.dispatchDataUpdated=!0,this.dataChanged=!1,this.setLegendData(this.chartData));this.drawChart()},handleLegendEvent:function(a){var b=a.type,c=a.dataItem,d=this.legend;if(!d.data&&c){var e=c.hidden;a=a.event;switch(b){case "clickMarker":e||d.switchable||this.clickSlice(c,a);break;case "clickLabel":e||
	this.clickSlice(c,a,!1);break;case "rollOverItem":e||this.rollOverSlice(c,!1,a);break;case "rollOutItem":e||this.rollOutSlice(c,a);break;case "hideItem":this.hideSlice(c,a);break;case "showItem":this.showSlice(c,a)}}},invalidateVisibility:function(){this.recalculatePercents();this.initChart();var a=this.legend;a&&a.invalidateSize()},addEventListeners:function(a,b){var c=this;a.mouseover(function(a){c.rollOverSlice(b,!0,a)}).mouseout(function(a){c.rollOutSlice(b,a)}).touchend(function(a){c.rollOverSlice(b,
		a);c.panEventsEnabled&&c.clickSlice(b,a)}).touchstart(function(a){c.rollOverSlice(b,a)}).click(function(a){c.clickSlice(b,a)}).contextmenu(function(a){c.handleRightClick(b,a)})},formatString:function(a,b,c){a=AmCharts.formatValue(a,b,["value"],this.nf,"",this.usePrefixes,this.prefixesOfSmallNumbers,this.prefixesOfBigNumbers);a=AmCharts.formatValue(a,b,["percents"],this.pf);a=AmCharts.massReplace(a,{"[[title]]":b.title,"[[description]]":b.description});-1!=a.indexOf("[[")&&(a=AmCharts.formatDataContextValue(a,
		b.dataContext));a=c?AmCharts.fixNewLines(a):AmCharts.fixBrakes(a);return a=AmCharts.cleanFromEmpty(a)},startSlices:function(){var a;for(a=0;a<this.chartData.length;a++)0<this.startDuration&&this.sequencedAnimation?this.setStartTO(a):this.startSlice(this.chartData[a])},setStartTO:function(a){var b=this;a=setTimeout(function(){b.startSequenced.call(b)},b.startDuration/b.chartData.length*500*a);b.timeOuts.push(a)},pullSlices:function(a){var b=this.chartData,c;for(c=0;c<b.length;c++){var d=b[c];d.pulled&&
	this.pullSlice(d,1,a)}},startSequenced:function(){var a=this.chartData,b;for(b=0;b<a.length;b++)if(!a[b].started){this.startSlice(this.chartData[b]);break}},startSlice:function(a){a.started=!0;var b=a.wedge,c=this.startDuration;b&&0<c&&(0<a.alpha&&b.show(),b.translate(a.startX,a.startY),b.animate({opacity:1,translate:"0,0"},c,this.startEffect))},showLabels:function(){var a=this.chartData,b;for(b=0;b<a.length;b++){var c=a[b];if(0<c.alpha){var d=c.label;d&&d.show();(c=c.tick)&&c.show()}}},showSlice:function(a){isNaN(a)?
		a.hidden=!1:this.chartData[a].hidden=!1;this.invalidateVisibility()},hideSlice:function(a){isNaN(a)?a.hidden=!0:this.chartData[a].hidden=!0;this.hideBalloon();this.invalidateVisibility()},rollOverSlice:function(a,b,c){isNaN(a)||(a=this.chartData[a]);clearTimeout(this.hoverInt);if(!a.hidden){this.pullOnHover&&this.pullSlice(a,1);1>this.hoverAlpha&&a.wedge&&a.wedge.attr({opacity:this.hoverAlpha});var d=a.balloonX,e=a.balloonY;a.pulled&&(d+=a.pullX,e+=a.pullY);var f=this.formatString(this.balloonText,
		a,!0),g=this.balloonFunction;g&&(f=g(a,f));g=AmCharts.adjustLuminosity(a.color,-.15);this.showBalloon(f,g,b,d,e);a={type:"rollOverSlice",dataItem:a,chart:this,event:c};this.fire(a.type,a)}},rollOutSlice:function(a,b){isNaN(a)||(a=this.chartData[a]);a.wedge&&a.wedge.attr({opacity:1});this.hideBalloon();var c={type:"rollOutSlice",dataItem:a,chart:this,event:b};this.fire(c.type,c)},clickSlice:function(a,b,c){isNaN(a)||(a=this.chartData[a]);a.pulled?this.pullSlice(a,0):this.pullSlice(a,1);AmCharts.getURL(a.url,
		this.urlTarget);c||(a={type:"clickSlice",dataItem:a,chart:this,event:b},this.fire(a.type,a))},handleRightClick:function(a,b){isNaN(a)||(a=this.chartData[a]);var c={type:"rightClickSlice",dataItem:a,chart:this,event:b};this.fire(c.type,c)},drawTicks:function(){var a=this.chartData,b;for(b=0;b<a.length;b++){var c=a[b];if(c.label){var d=c.ty,d=AmCharts.line(this.container,[c.tx0,c.tx,c.tx2],[c.ty0,d,d],this.labelTickColor,this.labelTickAlpha);c.tick=d;c.wedge.push(d)}}},initialStart:function(){var a=
		this,b=a.startDuration,c=setTimeout(function(){a.showLabels.call(a)},1E3*b);a.timeOuts.push(c);a.chartCreated?a.pullSlices(!0):(a.startSlices(),0<b?(b=setTimeout(function(){a.pullSlices.call(a)},1200*b),a.timeOuts.push(b)):a.pullSlices(!0))},pullSlice:function(a,b,c){var d=this.pullOutDuration;!0===c&&(d=0);(c=a.wedge)&&(0<d?c.animate({translate:b*a.pullX+","+b*a.pullY},d,this.pullOutEffect):c.translate(b*a.pullX,b*a.pullY));1==b?(a.pulled=!0,this.pullOutOnlyOne&&this.pullInAll(a.index),a={type:"pullOutSlice",
		dataItem:a,chart:this}):(a.pulled=!1,a={type:"pullInSlice",dataItem:a,chart:this});this.fire(a.type,a)},pullInAll:function(a){var b=this.chartData,c;for(c=0;c<this.chartData.length;c++)c!=a&&b[c].pulled&&this.pullSlice(b[c],0)},pullOutAll:function(a){a=this.chartData;var b;for(b=0;b<a.length;b++)a[b].pulled||this.pullSlice(a[b],1)},parseData:function(){var a=[];this.chartData=a;var b=this.dataProvider;isNaN(this.pieAlpha)||(this.alpha=this.pieAlpha);if(void 0!==b){var c=b.length,d=0,e,f,g;for(e=0;e<
	c;e++){f={};var h=b[e];f.dataContext=h;f.value=Number(h[this.valueField]);(g=h[this.titleField])||(g="");f.title=g;f.pulled=AmCharts.toBoolean(h[this.pulledField],!1);(g=h[this.descriptionField])||(g="");f.description=g;f.labelRadius=Number(h[this.labelRadiusField]);f.switchable=!0;f.url=h[this.urlField];g=h[this.patternField];!g&&this.patterns&&(g=this.patterns[e]);f.pattern=g;f.visibleInLegend=AmCharts.toBoolean(h[this.visibleInLegendField],!0);g=h[this.alphaField];f.alpha=void 0!==g?Number(g):
		this.alpha;g=h[this.colorField];void 0!==g&&(f.color=AmCharts.toColor(g));f.labelColor=AmCharts.toColor(h[this.labelColorField]);d+=f.value;f.hidden=!1;a[e]=f}for(e=b=0;e<c;e++)f=a[e],f.percents=f.value/d*100,f.percents<this.groupPercent&&b++;1<b&&(this.groupValue=0,this.removeSmallSlices(),a.push({title:this.groupedTitle,value:this.groupValue,percents:this.groupValue/d*100,pulled:this.groupedPulled,color:this.groupedColor,url:this.groupedUrl,description:this.groupedDescription,alpha:this.groupedAlpha,
		pattern:this.groupedPattern,dataContext:{}}));c=this.baseColor;c||(c=this.pieBaseColor);d=this.brightnessStep;d||(d=this.pieBrightnessStep);for(e=0;e<a.length;e++)c?g=AmCharts.adjustLuminosity(c,e*d/100):(g=this.colors[e],void 0===g&&(g=AmCharts.randomColor())),void 0===a[e].color&&(a[e].color=g);this.recalculatePercents()}},recalculatePercents:function(){var a=this.chartData,b=0,c,d;for(c=0;c<a.length;c++)d=a[c],!d.hidden&&0<d.value&&(b+=d.value);for(c=0;c<a.length;c++)d=this.chartData[c],d.percents=
		!d.hidden&&0<d.value?100*d.value/b:0},removeSmallSlices:function(){var a=this.chartData,b;for(b=a.length-1;0<=b;b--)a[b].percents<this.groupPercent&&(this.groupValue+=a[b].value,a.splice(b,1))},animateAgain:function(){var a=this;a.startSlices();for(var b=0;b<a.chartData.length;b++){var c=a.chartData[b];c.started=!1;var d=c.wedge;d&&d.translate(c.startX,c.startY)}b=a.startDuration;0<b?(b=setTimeout(function(){a.pullSlices.call(a)},1200*b),a.timeOuts.push(b)):a.pullSlices()},measureMaxLabel:function(){var a=
		this.chartData,b=0,c;for(c=0;c<a.length;c++){var d=a[c],e=this.formatString(this.labelText,d),f=this.labelFunction;f&&(e=f(d,e));d=AmCharts.text(this.container,e,this.color,this.fontFamily,this.fontSize);e=d.getBBox().width;e>b&&(b=e);d.remove()}return b}});AmCharts.AmRectangularChart=AmCharts.Class({inherits:AmCharts.AmCoordinateChart,construct:function(a){AmCharts.AmRectangularChart.base.construct.call(this,a);this.theme=a;this.createEvents("zoomed");this.marginRight=this.marginBottom=this.marginTop=this.marginLeft=20;this.verticalPosition=this.horizontalPosition=this.depth3D=this.angle=0;this.heightMultiplier=this.widthMultiplier=1;this.plotAreaFillColors="#FFFFFF";this.plotAreaFillAlphas=0;this.plotAreaBorderColor="#000000";this.plotAreaBorderAlpha=
		0;this.zoomOutButtonImageSize=17;this.zoomOutButtonImage="lens.png";this.zoomOutText="Show all";this.zoomOutButtonColor="#e5e5e5";this.zoomOutButtonAlpha=0;this.zoomOutButtonRollOverAlpha=1;this.zoomOutButtonPadding=8;this.trendLines=[];this.autoMargins=!0;this.marginsUpdated=!1;this.autoMarginOffset=10;AmCharts.applyTheme(this,a,"AmRectangularChart")},initChart:function(){AmCharts.AmRectangularChart.base.initChart.call(this);this.updateDxy();var a=!0;!this.marginsUpdated&&this.autoMargins&&(this.resetMargins(),
		a=!1);this.processScrollbars();this.updateMargins();this.updatePlotArea();this.updateScrollbars();this.updateTrendLines();this.updateChartCursor();this.updateValueAxes();a&&(this.scrollbarOnly||this.updateGraphs())},drawChart:function(){AmCharts.AmRectangularChart.base.drawChart.call(this);this.drawPlotArea();if(AmCharts.ifArray(this.chartData)){var a=this.chartCursor;a&&a.draw();a=this.zoomOutText;""!==a&&a&&this.drawZoomOutButton()}},resetMargins:function(){var a={},b;if("serial"==this.type){var c=
		this.valueAxes;for(b=0;b<c.length;b++){var d=c[b];d.ignoreAxisWidth||(d.setOrientation(this.rotate),d.fixAxisPosition(),a[d.position]=!0)}(b=this.categoryAxis)&&!b.ignoreAxisWidth&&(b.setOrientation(!this.rotate),b.fixAxisPosition(),b.fixAxisPosition(),a[b.position]=!0)}else{d=this.xAxes;c=this.yAxes;for(b=0;b<d.length;b++){var e=d[b];e.ignoreAxisWidth||(e.setOrientation(!0),e.fixAxisPosition(),a[e.position]=!0)}for(b=0;b<c.length;b++)d=c[b],d.ignoreAxisWidth||(d.setOrientation(!1),d.fixAxisPosition(),
		a[d.position]=!0)}a.left&&(this.marginLeft=0);a.right&&(this.marginRight=0);a.top&&(this.marginTop=0);a.bottom&&(this.marginBottom=0);this.fixMargins=a},measureMargins:function(){var a=this.valueAxes,b,c=this.autoMarginOffset,d=this.fixMargins,e=this.realWidth,f=this.realHeight,g=c,h=c,k=e;b=f;var l;for(l=0;l<a.length;l++)b=this.getAxisBounds(a[l],g,k,h,b),g=Math.round(b.l),k=Math.round(b.r),h=Math.round(b.t),b=Math.round(b.b);if(a=this.categoryAxis)b=this.getAxisBounds(a,g,k,h,b),g=Math.round(b.l),
		k=Math.round(b.r),h=Math.round(b.t),b=Math.round(b.b);d.left&&g<c&&(this.marginLeft=Math.round(-g+c));d.right&&k>=e-c&&(this.marginRight=Math.round(k-e+c));d.top&&h<c+this.titleHeight&&(this.marginTop=Math.round(this.marginTop-h+c+this.titleHeight));d.bottom&&b>f-c&&(this.marginBottom=Math.round(this.marginBottom+b-f+c));this.initChart()},getAxisBounds:function(a,b,c,d,e){if(!a.ignoreAxisWidth){var f=a.labelsSet,g=a.tickLength;a.inside&&(g=0);if(f)switch(f=a.getBBox(),a.position){case "top":a=f.y;
		d>a&&(d=a);break;case "bottom":a=f.y+f.height;e<a&&(e=a);break;case "right":a=f.x+f.width+g+3;c<a&&(c=a);break;case "left":a=f.x-g,b>a&&(b=a)}}return{l:b,t:d,r:c,b:e}},drawZoomOutButton:function(){var a=this,b=a.container.set();a.zoomButtonSet.push(b);var c=a.color,d=a.fontSize,e=a.zoomOutButtonImageSize,f=a.zoomOutButtonImage,g=AmCharts.lang.zoomOutText||a.zoomOutText,h=a.zoomOutButtonColor,k=a.zoomOutButtonAlpha,l=a.zoomOutButtonFontSize,m=a.zoomOutButtonPadding;isNaN(l)||(d=l);(l=a.zoomOutButtonFontColor)&&
	(c=l);var l=a.zoomOutButton,n;l&&(l.fontSize&&(d=l.fontSize),l.color&&(c=l.color),l.backgroundColor&&(h=l.backgroundColor),isNaN(l.backgroundAlpha)||(a.zoomOutButtonRollOverAlpha=l.backgroundAlpha));var p=l=0;void 0!==a.pathToImages&&f&&(n=a.container.image(a.pathToImages+f,0,0,e,e),b.push(n),n=n.getBBox(),l=n.width+5);void 0!==g&&(c=AmCharts.text(a.container,g,c,a.fontFamily,d,"start"),d=c.getBBox(),p=n?n.height/2-3:d.height/2,c.translate(l,p),b.push(c));n=b.getBBox();c=1;AmCharts.isModern||(c=0);
		h=AmCharts.rect(a.container,n.width+2*m+5,n.height+2*m-2,h,1,1,h,c);h.setAttr("opacity",k);h.translate(-m,-m);b.push(h);h.toBack();a.zbBG=h;n=h.getBBox();b.translate(a.marginLeftReal+a.plotAreaWidth-n.width+m,a.marginTopReal+m);b.hide();b.mouseover(function(){a.rollOverZB()}).mouseout(function(){a.rollOutZB()}).click(function(){a.clickZB()}).touchstart(function(){a.rollOverZB()}).touchend(function(){a.rollOutZB();a.clickZB()});for(k=0;k<b.length;k++)b[k].attr({cursor:"pointer"});a.zbSet=b},rollOverZB:function(){this.zbBG.setAttr("opacity",
		this.zoomOutButtonRollOverAlpha)},rollOutZB:function(){this.zbBG.setAttr("opacity",this.zoomOutButtonAlpha)},clickZB:function(){this.zoomOut()},zoomOut:function(){this.updateScrollbar=!0;this.zoom()},drawPlotArea:function(){var a=this.dx,b=this.dy,c=this.marginLeftReal,d=this.marginTopReal,e=this.plotAreaWidth-1,f=this.plotAreaHeight-1,g=this.plotAreaFillColors,h=this.plotAreaFillAlphas,k=this.plotAreaBorderColor,l=this.plotAreaBorderAlpha;this.trendLinesSet.clipRect(c,d,e,f);"object"==typeof h&&
	(h=h[0]);g=AmCharts.polygon(this.container,[0,e,e,0,0],[0,0,f,f,0],g,h,1,k,l,this.plotAreaGradientAngle);g.translate(c+a,d+b);this.set.push(g);0!==a&&0!==b&&(g=this.plotAreaFillColors,"object"==typeof g&&(g=g[0]),g=AmCharts.adjustLuminosity(g,-.15),e=AmCharts.polygon(this.container,[0,a,e+a,e,0],[0,b,b,0,0],g,h,1,k,l),e.translate(c,d+f),this.set.push(e),a=AmCharts.polygon(this.container,[0,0,a,a,0],[0,f,f+b,b,0],g,h,1,k,l),a.translate(c,d),this.set.push(a));(c=this.bbset)&&this.scrollbarOnly&&c.remove()},
		updatePlotArea:function(){var a=this.updateWidth(),b=this.updateHeight(),c=this.container;this.realWidth=a;this.realWidth=b;c&&this.container.setSize(a,b);a=a-this.marginLeftReal-this.marginRightReal-this.dx;b=b-this.marginTopReal-this.marginBottomReal;1>a&&(a=1);1>b&&(b=1);this.plotAreaWidth=Math.round(a);this.plotAreaHeight=Math.round(b)},updateDxy:function(){this.dx=Math.round(this.depth3D*Math.cos(this.angle*Math.PI/180));this.dy=Math.round(-this.depth3D*Math.sin(this.angle*Math.PI/180));this.d3x=
			Math.round(this.columnSpacing3D*Math.cos(this.angle*Math.PI/180));this.d3y=Math.round(-this.columnSpacing3D*Math.sin(this.angle*Math.PI/180))},updateMargins:function(){var a=this.getTitleHeight();this.titleHeight=a;this.marginTopReal=this.marginTop-this.dy+a;this.marginBottomReal=this.marginBottom;this.marginLeftReal=this.marginLeft;this.marginRightReal=this.marginRight},updateValueAxes:function(){var a=this.valueAxes,b=this.marginLeftReal,c=this.marginTopReal,d=this.plotAreaHeight,e=this.plotAreaWidth,
			f;for(f=0;f<a.length;f++){var g=a[f];g.axisRenderer=AmCharts.RecAxis;g.guideFillRenderer=AmCharts.RecFill;g.axisItemRenderer=AmCharts.RecItem;g.dx=this.dx;g.dy=this.dy;g.viW=e-1;g.viH=d-1;g.marginsChanged=!0;g.viX=b;g.viY=c;this.updateObjectSize(g)}},updateObjectSize:function(a){a.width=(this.plotAreaWidth-1)*this.widthMultiplier;a.height=(this.plotAreaHeight-1)*this.heightMultiplier;a.x=this.marginLeftReal+this.horizontalPosition;a.y=this.marginTopReal+this.verticalPosition},updateGraphs:function(){var a=
			this.graphs,b;for(b=0;b<a.length;b++){var c=a[b];c.x=this.marginLeftReal+this.horizontalPosition;c.y=this.marginTopReal+this.verticalPosition;c.width=this.plotAreaWidth*this.widthMultiplier;c.height=this.plotAreaHeight*this.heightMultiplier;c.index=b;c.dx=this.dx;c.dy=this.dy;c.rotate=this.rotate}},updateChartCursor:function(){var a=this.chartCursor;a&&(a=AmCharts.processObject(a,AmCharts.ChartCursor,this.theme),this.addChartCursor(a),a.x=this.marginLeftReal,a.y=this.marginTopReal,a.width=this.plotAreaWidth-
			1,a.height=this.plotAreaHeight-1,a.chart=this)},processScrollbars:function(){var a=this.chartScrollbar;a&&(a=AmCharts.processObject(a,AmCharts.ChartScrollbar,this.theme),this.addChartScrollbar(a))},updateScrollbars:function(){},addChartCursor:function(a){AmCharts.callMethod("destroy",[this.chartCursor]);a&&(this.listenTo(a,"changed",this.handleCursorChange),this.listenTo(a,"zoomed",this.handleCursorZoom));this.chartCursor=a},removeChartCursor:function(){AmCharts.callMethod("destroy",[this.chartCursor]);
			this.chartCursor=null},zoomTrendLines:function(){var a=this.trendLines,b;for(b=0;b<a.length;b++){var c=a[b];c.valueAxis.recalculateToPercents?c.set&&c.set.hide():(c.x=this.marginLeftReal+this.horizontalPosition,c.y=this.marginTopReal+this.verticalPosition,c.draw())}},addTrendLine:function(a){this.trendLines.push(a)},removeTrendLine:function(a){var b=this.trendLines,c;for(c=b.length-1;0<=c;c--)b[c]==a&&b.splice(c,1)},adjustMargins:function(a,b){var c=a.scrollbarHeight+a.offset;"top"==a.position?b?
			this.marginLeftReal+=c:this.marginTopReal+=c:b?this.marginRightReal+=c:this.marginBottomReal+=c},getScrollbarPosition:function(a,b,c){a.position=b?"bottom"==c||"left"==c?"bottom":"top":"top"==c||"right"==c?"bottom":"top"},updateChartScrollbar:function(a,b){if(a){a.rotate=b;var c=this.marginTopReal,d=this.marginLeftReal,e=a.scrollbarHeight,f=this.dx,g=this.dy,h=a.offset;"top"==a.position?b?(a.y=c,a.x=d-e-h):(a.y=c-e+g-1-h,a.x=d+f):b?(a.y=c+g,a.x=d+this.plotAreaWidth+f+h):(a.y=c+this.plotAreaHeight+
			h,a.x=this.marginLeftReal)}},showZB:function(a){var b=this.zbSet;b&&(a?b.show():b.hide(),this.rollOutZB())},handleReleaseOutside:function(a){AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this,a);(a=this.chartCursor)&&a.handleReleaseOutside()},handleMouseDown:function(a){AmCharts.AmRectangularChart.base.handleMouseDown.call(this,a);var b=this.chartCursor;b&&b.handleMouseDown(a)},handleCursorChange:function(a){}});AmCharts.TrendLine=AmCharts.Class({construct:function(a){this.cname="TrendLine";this.createEvents("click");this.isProtected=!1;this.dashLength=0;this.lineColor="#00CC00";this.lineThickness=this.lineAlpha=1;AmCharts.applyTheme(this,a,this.cname)},draw:function(){var a=this;a.destroy();var b=a.chart,c=b.container,d,e,f,g,h=a.categoryAxis,k=a.initialDate,l=a.initialCategory,m=a.finalDate,n=a.finalCategory,p=a.valueAxis,q=a.valueAxisX,r=a.initialXValue,s=a.finalXValue,w=a.initialValue,v=a.finalValue,
		t=p.recalculateToPercents,u=b.dataDateFormat;h&&(k&&(k instanceof Date||(k=u?AmCharts.stringToDate(k,u):new Date(k)),a.initialDate=k,d=h.dateToCoordinate(k)),l&&(d=h.categoryToCoordinate(l)),m&&(m instanceof Date||(m=u?AmCharts.stringToDate(m,u):new Date(m)),a.finalDate=m,e=h.dateToCoordinate(m)),n&&(e=h.categoryToCoordinate(n)));q&&!t&&(isNaN(r)||(d=q.getCoordinate(r)),isNaN(s)||(e=q.getCoordinate(s)));p&&!t&&(isNaN(w)||(f=p.getCoordinate(w)),isNaN(v)||(g=p.getCoordinate(v)));isNaN(d)||isNaN(e)||
	isNaN(f)||isNaN(f)||(b.rotate?(h=[f,g],e=[d,e]):(h=[d,e],e=[f,g]),f=a.lineColor,d=AmCharts.line(c,h,e,f,a.lineAlpha,a.lineThickness,a.dashLength),g=h,k=e,n=h[1]-h[0],p=e[1]-e[0],0===n&&(n=.01),0===p&&(p=.01),l=n/Math.abs(n),m=p/Math.abs(p),p=n*p/Math.abs(n*p)*Math.sqrt(Math.pow(n,2)+Math.pow(p,2)),n=Math.asin(n/p),p=90*Math.PI/180-n,n=Math.abs(5*Math.cos(p)),p=Math.abs(5*Math.sin(p)),g.push(h[1]-l*p,h[0]-l*p),k.push(e[1]+m*n,e[0]+m*n),h=AmCharts.polygon(c,g,k,f,.005,0),c=c.set([h,d]),c.translate(b.marginLeftReal,
		b.marginTopReal),b.trendLinesSet.push(c),a.line=d,a.set=c,h.mouseup(function(){a.handleLineClick()}).mouseover(function(){a.handleLineOver()}).mouseout(function(){a.handleLineOut()}),h.touchend&&h.touchend(function(){a.handleLineClick()}))},handleLineClick:function(){var a={type:"click",trendLine:this,chart:this.chart};this.fire(a.type,a)},handleLineOver:function(){var a=this.rollOverColor;void 0!==a&&this.line.attr({stroke:a})},handleLineOut:function(){this.line.attr({stroke:this.lineColor})},destroy:function(){AmCharts.remove(this.set)}});AmCharts.circle=function(a,b,c,d,e,f,g,h,k){if(void 0==e||0===e)e=.01;void 0===f&&(f="#000000");void 0===g&&(g=0);d={fill:c,stroke:f,"fill-opacity":d,"stroke-width":e,"stroke-opacity":g};a=isNaN(k)?a.circle(0,0,b).attr(d):a.ellipse(0,0,b,k).attr(d);h&&a.gradient("radialGradient",[c,AmCharts.adjustLuminosity(c,-.6)]);return a};
	AmCharts.text=function(a,b,c,d,e,f,g,h){f||(f="middle");"right"==f&&(f="end");isNaN(h)&&(h=1);void 0!==b&&(b=String(b),AmCharts.isIE&&!AmCharts.isModern&&(b=b.replace("&amp;","&"),b=b.replace("&","&amp;")));c={fill:c,"font-family":d,"font-size":e,opacity:h};!0===g&&(c["font-weight"]="bold");c["text-anchor"]=f;return a.text(b,c)};
	AmCharts.polygon=function(a,b,c,d,e,f,g,h,k,l,m){isNaN(f)&&(f=.01);isNaN(h)&&(h=e);var n=d,p=!1;"object"==typeof n&&1<n.length&&(p=!0,n=n[0]);void 0===g&&(g=n);e={fill:n,stroke:g,"fill-opacity":e,"stroke-width":f,"stroke-opacity":h};void 0!==m&&0<m&&(e["stroke-dasharray"]=m);m=AmCharts.dx;f=AmCharts.dy;a.handDrawn&&(c=AmCharts.makeHD(b,c,a.handDrawScatter),b=c[0],c=c[1]);g=Math.round;l&&(g=AmCharts.doNothing);l="M"+(g(b[0])+m)+","+(g(c[0])+f);for(h=1;h<b.length;h++)l+=" L"+(g(b[h])+m)+","+(g(c[h])+
		f);a=a.path(l+" Z").attr(e);p&&a.gradient("linearGradient",d,k);return a};
	AmCharts.rect=function(a,b,c,d,e,f,g,h,k,l,m){isNaN(f)&&(f=0);void 0===k&&(k=0);void 0===l&&(l=270);isNaN(e)&&(e=0);var n=d,p=!1;"object"==typeof n&&(n=n[0],p=!0);void 0===g&&(g=n);void 0===h&&(h=e);b=Math.round(b);c=Math.round(c);var q=0,r=0;0>b&&(b=Math.abs(b),q=-b);0>c&&(c=Math.abs(c),r=-c);q+=AmCharts.dx;r+=AmCharts.dy;e={fill:n,stroke:g,"fill-opacity":e,"stroke-opacity":h};void 0!==m&&0<m&&(e["stroke-dasharray"]=m);a=a.rect(q,r,b,c,k,f).attr(e);p&&a.gradient("linearGradient",d,l);return a};
	AmCharts.bullet=function(a,b,c,d,e,f,g,h,k,l,m){var n;"circle"==b&&(b="round");switch(b){case "round":n=AmCharts.circle(a,c/2,d,e,f,g,h);break;case "square":n=AmCharts.polygon(a,[-c/2,c/2,c/2,-c/2],[c/2,c/2,-c/2,-c/2],d,e,f,g,h,l-180);break;case "rectangle":n=AmCharts.polygon(a,[-c,c,c,-c],[c/2,c/2,-c/2,-c/2],d,e,f,g,h,l-180);break;case "diamond":n=AmCharts.polygon(a,[-c/2,0,c/2,0],[0,-c/2,0,c/2],d,e,f,g,h);break;case "triangleUp":n=AmCharts.triangle(a,c,0,d,e,f,g,h);break;case "triangleDown":n=AmCharts.triangle(a,
		c,180,d,e,f,g,h);break;case "triangleLeft":n=AmCharts.triangle(a,c,270,d,e,f,g,h);break;case "triangleRight":n=AmCharts.triangle(a,c,90,d,e,f,g,h);break;case "bubble":n=AmCharts.circle(a,c/2,d,e,f,g,h,!0);break;case "line":n=AmCharts.line(a,[-c/2,c/2],[0,0],d,e,f,g,h);break;case "yError":n=a.set();n.push(AmCharts.line(a,[0,0],[-c/2,c/2],d,e,f));n.push(AmCharts.line(a,[-k,k],[-c/2,-c/2],d,e,f));n.push(AmCharts.line(a,[-k,k],[c/2,c/2],d,e,f));break;case "xError":n=a.set(),n.push(AmCharts.line(a,[-c/
	2,c/2],[0,0],d,e,f)),n.push(AmCharts.line(a,[-c/2,-c/2],[-k,k],d,e,f)),n.push(AmCharts.line(a,[c/2,c/2],[-k,k],d,e,f))}n&&n.pattern(m);return n};
	AmCharts.triangle=function(a,b,c,d,e,f,g,h){if(void 0===f||0===f)f=1;void 0===g&&(g="#000");void 0===h&&(h=0);d={fill:d,stroke:g,"fill-opacity":e,"stroke-width":f,"stroke-opacity":h};b/=2;var k;0===c&&(k=" M"+-b+","+b+" L0,"+-b+" L"+b+","+b+" Z");180==c&&(k=" M"+-b+","+-b+" L0,"+b+" L"+b+","+-b+" Z");90==c&&(k=" M"+-b+","+-b+" L"+b+",0 L"+-b+","+b+" Z");270==c&&(k=" M"+-b+",0 L"+b+","+b+" L"+b+","+-b+" Z");return a.path(k).attr(d)};
	AmCharts.line=function(a,b,c,d,e,f,g,h,k,l,m){if(a.handDrawn&&!m)return AmCharts.handDrawnLine(a,b,c,d,e,f,g,h,k,l,m);f={fill:"none","stroke-width":f};void 0!==g&&0<g&&(f["stroke-dasharray"]=g);isNaN(e)||(f["stroke-opacity"]=e);d&&(f.stroke=d);d=Math.round;l&&(d=AmCharts.doNothing);l=AmCharts.dx;e=AmCharts.dy;g="M"+(d(b[0])+l)+","+(d(c[0])+e);for(h=1;h<b.length;h++)g+=" L"+(d(b[h])+l)+","+(d(c[h])+e);if(AmCharts.VML)return a.path(g,void 0,!0).attr(f);k&&(g+=" M0,0 L0,0");return a.path(g).attr(f)};
	AmCharts.makeHD=function(a,b,c){for(var d=[],e=[],f=1;f<a.length;f++)for(var g=Number(a[f-1]),h=Number(b[f-1]),k=Number(a[f]),l=Number(b[f]),m=Math.sqrt(Math.pow(k-g,2)+Math.pow(l-h,2)),m=Math.round(m/50)+1,k=(k-g)/m,l=(l-h)/m,n=0;n<=m;n++){var p=g+n*k+Math.random()*c,q=h+n*l+Math.random()*c;d.push(p);e.push(q)}return[d,e]};
	AmCharts.handDrawnLine=function(a,b,c,d,e,f,g,h,k,l,m){var n=a.set();for(m=1;m<b.length;m++)for(var p=[b[m-1],b[m]],q=[c[m-1],c[m]],q=AmCharts.makeHD(p,q,a.handDrawScatter),p=q[0],q=q[1],r=1;r<p.length;r++)n.push(AmCharts.line(a,[p[r-1],p[r]],[q[r-1],q[r]],d,e,f+Math.random()*a.handDrawThickness-a.handDrawThickness/2,g,h,k,l,!0));return n};AmCharts.doNothing=function(a){return a};
	AmCharts.wedge=function(a,b,c,d,e,f,g,h,k,l,m,n){var p=Math.round;f=p(f);g=p(g);h=p(h);var q=p(g/f*h),r=AmCharts.VML,s=359.5+f/100;359.94<s&&(s=359.94);e>=s&&(e=s);var w=1/180*Math.PI,s=b+Math.sin(d*w)*h,v=c-Math.cos(d*w)*q,t=b+Math.sin(d*w)*f,u=c-Math.cos(d*w)*g,x=b+Math.sin((d+e)*w)*f,E=c-Math.cos((d+e)*w)*g,A=b+Math.sin((d+e)*w)*h,w=c-Math.cos((d+e)*w)*q,z={fill:AmCharts.adjustLuminosity(l.fill,-.2),"stroke-opacity":0,"fill-opacity":l["fill-opacity"]},H=0;180<Math.abs(e)&&(H=1);d=a.set();var F;
		r&&(s=p(10*s),t=p(10*t),x=p(10*x),A=p(10*A),v=p(10*v),u=p(10*u),E=p(10*E),w=p(10*w),b=p(10*b),k=p(10*k),c=p(10*c),f*=10,g*=10,h*=10,q*=10,1>Math.abs(e)&&1>=Math.abs(x-t)&&1>=Math.abs(E-u)&&(F=!0));e="";var G;n&&(z["fill-opacity"]=0,z["stroke-opacity"]=l["stroke-opacity"]/2,z.stroke=l.stroke);0<k&&(G=" M"+s+","+(v+k)+" L"+t+","+(u+k),r?(F||(G+=" A"+(b-f)+","+(k+c-g)+","+(b+f)+","+(k+c+g)+","+t+","+(u+k)+","+x+","+(E+k)),G+=" L"+A+","+(w+k),0<h&&(F||(G+=" B"+(b-h)+","+(k+c-q)+","+(b+h)+","+(k+c+q)+
			","+A+","+(k+w)+","+s+","+(k+v)))):(G+=" A"+f+","+g+",0,"+H+",1,"+x+","+(E+k)+" L"+A+","+(w+k),0<h&&(G+=" A"+h+","+q+",0,"+H+",0,"+s+","+(v+k))),G=a.path(G+" Z",void 0,void 0,"1000,1000").attr(z),d.push(G),G=a.path(" M"+s+","+v+" L"+s+","+(v+k)+" L"+t+","+(u+k)+" L"+t+","+u+" L"+s+","+v+" Z",void 0,void 0,"1000,1000").attr(z),k=a.path(" M"+x+","+E+" L"+x+","+(E+k)+" L"+A+","+(w+k)+" L"+A+","+w+" L"+x+","+E+" Z",void 0,void 0,"1000,1000").attr(z),d.push(G),d.push(k));r?(F||(e=" A"+p(b-f)+","+p(c-g)+
			","+p(b+f)+","+p(c+g)+","+p(t)+","+p(u)+","+p(x)+","+p(E)),f=" M"+p(s)+","+p(v)+" L"+p(t)+","+p(u)+e+" L"+p(A)+","+p(w)):f=" M"+s+","+v+" L"+t+","+u+(" A"+f+","+g+",0,"+H+",1,"+x+","+E)+" L"+A+","+w;0<h&&(r?F||(f+=" B"+(b-h)+","+(c-q)+","+(b+h)+","+(c+q)+","+A+","+w+","+s+","+v):f+=" A"+h+","+q+",0,"+H+",0,"+s+","+v);a.handDrawn&&(b=AmCharts.line(a,[s,t],[v,u],l.stroke,l.thickness*Math.random()*a.handDrawThickness,l["stroke-opacity"]),d.push(b));a=a.path(f+" Z",void 0,void 0,"1000,1000").attr(l);
		if(m){b=[];for(c=0;c<m.length;c++)b.push(AmCharts.adjustLuminosity(l.fill,m[c]));0<b.length&&a.gradient("linearGradient",b)}a.pattern(n);d.push(a);return d};AmCharts.adjustLuminosity=function(a,b){a=String(a).replace(/[^0-9a-f]/gi,"");6>a.length&&(a=String(a[0])+String(a[0])+String(a[1])+String(a[1])+String(a[2])+String(a[2]));b=b||0;var c="#",d,e;for(e=0;3>e;e++)d=parseInt(a.substr(2*e,2),16),d=Math.round(Math.min(Math.max(0,d+d*b),255)).toString(16),c+=("00"+d).substr(d.length);return c};AmCharts.Bezier=AmCharts.Class({construct:function(a,b,c,d,e,f,g,h,k,l){"object"==typeof g&&(g=g[0]);"object"==typeof h&&(h=h[0]);f={fill:g,"fill-opacity":h,"stroke-width":f};void 0!==k&&0<k&&(f["stroke-dasharray"]=k);isNaN(e)||(f["stroke-opacity"]=e);d&&(f.stroke=d);d="M"+Math.round(b[0])+","+Math.round(c[0]);e=[];for(k=0;k<b.length;k++)e.push({x:Number(b[k]),y:Number(c[k])});1<e.length&&(b=this.interpolate(e),d+=this.drawBeziers(b));l?d+=l:AmCharts.VML||(d+="M0,0 L0,0");this.path=a.path(d).attr(f)},
		interpolate:function(a){var b=[];b.push({x:a[0].x,y:a[0].y});var c=a[1].x-a[0].x,d=a[1].y-a[0].y,e=AmCharts.bezierX,f=AmCharts.bezierY;b.push({x:a[0].x+c/e,y:a[0].y+d/f});var g;for(g=1;g<a.length-1;g++){var h=a[g-1],k=a[g],d=a[g+1];isNaN(d.x)&&(d=k);isNaN(k.x)&&(k=h);isNaN(h.x)&&(h=k);c=d.x-k.x;d=d.y-h.y;h=k.x-h.x;h>c&&(h=c);b.push({x:k.x-h/e,y:k.y-d/f});b.push({x:k.x,y:k.y});b.push({x:k.x+h/e,y:k.y+d/f})}d=a[a.length-1].y-a[a.length-2].y;c=a[a.length-1].x-a[a.length-2].x;b.push({x:a[a.length-1].x-
		c/e,y:a[a.length-1].y-d/f});b.push({x:a[a.length-1].x,y:a[a.length-1].y});return b},drawBeziers:function(a){var b="",c;for(c=0;c<(a.length-1)/3;c++)b+=this.drawBezierMidpoint(a[3*c],a[3*c+1],a[3*c+2],a[3*c+3]);return b},drawBezierMidpoint:function(a,b,c,d){var e=Math.round,f=this.getPointOnSegment(a,b,.75),g=this.getPointOnSegment(d,c,.75),h=(d.x-a.x)/16,k=(d.y-a.y)/16,l=this.getPointOnSegment(a,b,.375);a=this.getPointOnSegment(f,g,.375);a.x-=h;a.y-=k;b=this.getPointOnSegment(g,f,.375);b.x+=h;b.y+=
			k;c=this.getPointOnSegment(d,c,.375);h=this.getMiddle(l,a);f=this.getMiddle(f,g);g=this.getMiddle(b,c);l=" Q"+e(l.x)+","+e(l.y)+","+e(h.x)+","+e(h.y);l+=" Q"+e(a.x)+","+e(a.y)+","+e(f.x)+","+e(f.y);l+=" Q"+e(b.x)+","+e(b.y)+","+e(g.x)+","+e(g.y);return l+=" Q"+e(c.x)+","+e(c.y)+","+e(d.x)+","+e(d.y)},getMiddle:function(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}},getPointOnSegment:function(a,b,c){return{x:a.x+(b.x-a.x)*c,y:a.y+(b.y-a.y)*c}}});AmCharts.AmDraw=AmCharts.Class({construct:function(a,b,c,d){AmCharts.SVG_NS="http://www.w3.org/2000/svg";AmCharts.SVG_XLINK="http://www.w3.org/1999/xlink";AmCharts.hasSVG=!!document.createElementNS&&!!document.createElementNS(AmCharts.SVG_NS,"svg").createSVGRect;1>b&&(b=10);1>c&&(c=10);this.div=a;this.width=b;this.height=c;this.rBin=document.createElement("div");if(AmCharts.hasSVG){AmCharts.SVG=!0;var e=this.createSvgElement("svg");e.style.position="absolute";e.style.width=b+"px";e.style.height=c+
		"px";b=this.createSvgElement("desc");b.appendChild(document.createTextNode("JavaScript chart by amCharts "+d.version));e.appendChild(b);AmCharts.rtl&&(e.setAttribute("direction","rtl"),e.style.left="auto",e.style.right="0px");e.setAttribute("version","1.1");a.appendChild(e);this.container=e;this.R=new AmCharts.SVGRenderer(this)}else AmCharts.isIE&&AmCharts.VMLRenderer&&(AmCharts.VML=!0,AmCharts.vmlStyleSheet||(document.namespaces.add("amvml","urn:schemas-microsoft-com:vml"),31>document.styleSheets.length?
		(e=document.createStyleSheet(),e.addRule(".amvml","behavior:url(#default#VML); display:inline-block; antialias:true"),AmCharts.vmlStyleSheet=e):document.styleSheets[0].addRule(".amvml","behavior:url(#default#VML); display:inline-block; antialias:true")),this.container=a,this.R=new AmCharts.VMLRenderer(this,d),this.R.disableSelection(a))},createSvgElement:function(a){return document.createElementNS(AmCharts.SVG_NS,a)},circle:function(a,b,c,d){var e=new AmCharts.AmDObject("circle",this);e.attr({r:c,
		cx:a,cy:b});this.addToContainer(e.node,d);return e},ellipse:function(a,b,c,d,e){var f=new AmCharts.AmDObject("ellipse",this);f.attr({rx:c,ry:d,cx:a,cy:b});this.addToContainer(f.node,e);return f},setSize:function(a,b){0<a&&0<b&&(this.container.style.width=a+"px",this.container.style.height=b+"px")},rect:function(a,b,c,d,e,f,g){var h=new AmCharts.AmDObject("rect",this);AmCharts.VML&&(e=Math.round(100*e/Math.min(c,d)),c+=2*f,d+=2*f,h.bw=f,h.node.style.marginLeft=-f,h.node.style.marginTop=-f);1>c&&(c=
		1);1>d&&(d=1);h.attr({x:a,y:b,width:c,height:d,rx:e,ry:e,"stroke-width":f});this.addToContainer(h.node,g);return h},image:function(a,b,c,d,e,f){var g=new AmCharts.AmDObject("image",this);g.attr({x:b,y:c,width:d,height:e});this.R.path(g,a);this.addToContainer(g.node,f);return g},addToContainer:function(a,b){b||(b=this.container);b.appendChild(a)},text:function(a,b,c){return this.R.text(a,b,c)},path:function(a,b,c,d){var e=new AmCharts.AmDObject("path",this);d||(d="100,100");e.attr({cs:d});c?e.attr({dd:a}):
		e.attr({d:a});this.addToContainer(e.node,b);return e},set:function(a){return this.R.set(a)},remove:function(a){if(a){var b=this.rBin;b.appendChild(a);b.innerHTML=""}},renderFix:function(){var a=this.container,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}a=1-c.e%1;c=1-c.f%1;.5<a&&(a-=1);.5<c&&(c-=1);a&&(b.left=a+"px");c&&(b.top=c+"px")},update:function(){this.R.update()}});AmCharts.AmDObject=AmCharts.Class({construct:function(a,b){this.D=b;this.R=b.R;this.node=this.R.create(this,a);this.y=this.x=0;this.scale=1},attr:function(a){this.R.attr(this,a);return this},getAttr:function(a){return this.node.getAttribute(a)},setAttr:function(a,b){this.R.setAttr(this,a,b);return this},clipRect:function(a,b,c,d){this.R.clipRect(this,a,b,c,d)},translate:function(a,b,c,d){d||(a=Math.round(a),b=Math.round(b));this.R.move(this,a,b,c);this.x=a;this.y=b;this.scale=c;this.angle&&this.rotate(this.angle)},
		rotate:function(a,b){this.R.rotate(this,a,b);this.angle=a},animate:function(a,b,c){for(var d in a)if(a.hasOwnProperty(d)){var e=d,f=a[d];c=AmCharts.getEffect(c);this.R.animate(this,e,f,b,c)}},push:function(a){if(a){var b=this.node;b.appendChild(a.node);var c=a.clipPath;c&&b.appendChild(c);(a=a.grad)&&b.appendChild(a)}},text:function(a){this.R.setText(this,a)},remove:function(){this.R.remove(this)},clear:function(){var a=this.node;if(a.hasChildNodes())for(;1<=a.childNodes.length;)a.removeChild(a.firstChild)},
		hide:function(){this.setAttr("visibility","hidden")},show:function(){this.setAttr("visibility","visible")},getBBox:function(){return this.R.getBBox(this)},toFront:function(){var a=this.node;if(a){this.prevNextNode=a.nextSibling;var b=a.parentNode;b&&b.appendChild(a)}},toPrevious:function(){var a=this.node;a&&this.prevNextNode&&(a=a.parentNode)&&a.insertBefore(this.prevNextNode,null)},toBack:function(){var a=this.node;if(a){this.prevNextNode=a.nextSibling;var b=a.parentNode;if(b){var c=b.firstChild;
			c&&b.insertBefore(a,c)}}},mouseover:function(a){this.R.addListener(this,"mouseover",a);return this},mouseout:function(a){this.R.addListener(this,"mouseout",a);return this},click:function(a){this.R.addListener(this,"click",a);return this},dblclick:function(a){this.R.addListener(this,"dblclick",a);return this},mousedown:function(a){this.R.addListener(this,"mousedown",a);return this},mouseup:function(a){this.R.addListener(this,"mouseup",a);return this},touchstart:function(a){this.R.addListener(this,
			"touchstart",a);return this},touchend:function(a){this.R.addListener(this,"touchend",a);return this},contextmenu:function(a){this.node.addEventListener?this.node.addEventListener("contextmenu",a,!0):this.R.addListener(this,"contextmenu",a);return this},stop:function(a){(a=this.animationX)&&AmCharts.removeFromArray(this.R.animations,a);(a=this.animationY)&&AmCharts.removeFromArray(this.R.animations,a)},length:function(){return this.node.childNodes.length},gradient:function(a,b,c){this.R.gradient(this,
			a,b,c)},pattern:function(a,b){a&&this.R.pattern(this,a,b)}});AmCharts.VMLRenderer=AmCharts.Class({construct:function(a,b){this.chart=b;this.D=a;this.cNames={circle:"oval",ellipse:"oval",rect:"roundrect",path:"shape"};this.styleMap={x:"left",y:"top",width:"width",height:"height","font-family":"fontFamily","font-size":"fontSize",visibility:"visibility"}},create:function(a,b){var c;if("group"==b)c=document.createElement("div"),a.type="div";else if("text"==b)c=document.createElement("div"),a.type="text";else if("image"==b)c=document.createElement("img"),a.type=
		"image";else{a.type="shape";a.shapeType=this.cNames[b];c=document.createElement("amvml:"+this.cNames[b]);var d=document.createElement("amvml:stroke");c.appendChild(d);a.stroke=d;var e=document.createElement("amvml:fill");c.appendChild(e);a.fill=e;e.className="amvml";d.className="amvml";c.className="amvml"}c.style.position="absolute";c.style.top=0;c.style.left=0;return c},path:function(a,b){a.node.setAttribute("src",b)},setAttr:function(a,b,c){if(void 0!==c){var d;8===document.documentMode&&(d=!0);
		var e=a.node,f=a.type,g=e.style;"r"==b&&(g.width=2*c,g.height=2*c);"oval"==a.shapeType&&("rx"==b&&(g.width=2*c),"ry"==b&&(g.height=2*c));"roundrect"!=a.shapeType||"width"!=b&&"height"!=b||(c-=1);"cursor"==b&&(g.cursor=c);"cx"==b&&(g.left=c-AmCharts.removePx(g.width)/2);"cy"==b&&(g.top=c-AmCharts.removePx(g.height)/2);var h=this.styleMap[b];void 0!==h&&(g[h]=c);"text"==f&&("text-anchor"==b&&(a.anchor=c,h=e.clientWidth,"end"==c&&(g.marginLeft=-h+"px"),"middle"==c&&(g.marginLeft=-(h/2)+"px",g.textAlign=
			"center"),"start"==c&&(g.marginLeft="0px")),"fill"==b&&(g.color=c),"font-weight"==b&&(g.fontWeight=c));if(g=a.children)for(h=0;h<g.length;h++)g[h].setAttr(b,c);if("shape"==f){"cs"==b&&(e.style.width="100px",e.style.height="100px",e.setAttribute("coordsize",c));"d"==b&&e.setAttribute("path",this.svgPathToVml(c));"dd"==b&&e.setAttribute("path",c);f=a.stroke;a=a.fill;"stroke"==b&&(d?f.color=c:f.setAttribute("color",c));"stroke-width"==b&&(d?f.weight=c:f.setAttribute("weight",c));"stroke-opacity"==b&&
		(d?f.opacity=c:f.setAttribute("opacity",c));"stroke-dasharray"==b&&(g="solid",0<c&&3>c&&(g="dot"),3<=c&&6>=c&&(g="dash"),6<c&&(g="longdash"),d?f.dashstyle=g:f.setAttribute("dashstyle",g));if("fill-opacity"==b||"opacity"==b)0===c?d?a.on=!1:a.setAttribute("on",!1):d?a.opacity=c:a.setAttribute("opacity",c);"fill"==b&&(d?a.color=c:a.setAttribute("color",c));"rx"==b&&(d?e.arcSize=c+"%":e.setAttribute("arcsize",c+"%"))}}},attr:function(a,b){for(var c in b)b.hasOwnProperty(c)&&this.setAttr(a,c,b[c])},text:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     b,c){var d=new AmCharts.AmDObject("text",this.D),e=d.node;e.style.whiteSpace="pre";e.innerHTML=a;this.D.addToContainer(e,c);this.attr(d,b);return d},getBBox:function(a){return this.getBox(a.node)},getBox:function(a){var b=a.offsetLeft,c=a.offsetTop,d=a.offsetWidth,e=a.offsetHeight,f;if(a.hasChildNodes()){var g,h,k;for(k=0;k<a.childNodes.length;k++){f=this.getBox(a.childNodes[k]);var l=f.x;isNaN(l)||(isNaN(g)?g=l:l<g&&(g=l));var m=f.y;isNaN(m)||(isNaN(h)?h=m:m<h&&(h=m));l=f.width+l;isNaN(l)||(d=Math.max(d,
		l));f=f.height+m;isNaN(f)||(e=Math.max(e,f))}0>g&&(b+=g);0>h&&(c+=h)}return{x:b,y:c,width:d,height:e}},setText:function(a,b){var c=a.node;c&&(c.innerHTML=b);this.setAttr(a,"text-anchor",a.anchor)},addListener:function(a,b,c){a.node["on"+b]=c},move:function(a,b,c){var d=a.node,e=d.style;"text"==a.type&&(c-=AmCharts.removePx(e.fontSize)/2-1);"oval"==a.shapeType&&(b-=AmCharts.removePx(e.width)/2,c-=AmCharts.removePx(e.height)/2);a=a.bw;isNaN(a)||(b-=a,c-=a);isNaN(b)||isNaN(c)||(d.style.left=b+"px",d.style.top=
		c+"px")},svgPathToVml:function(a){var b=a.split(" ");a="";var c,d=Math.round,e;for(e=0;e<b.length;e++){var f=b[e],g=f.substring(0,1),f=f.substring(1),h=f.split(","),k=d(h[0])+","+d(h[1]);"M"==g&&(a+=" m "+k);"L"==g&&(a+=" l "+k);"Z"==g&&(a+=" x e");if("Q"==g){var l=c.length,m=c[l-1],n=h[0],p=h[1],k=h[2],q=h[3];c=d(c[l-2]/3+2/3*n);m=d(m/3+2/3*p);n=d(2/3*n+k/3);p=d(2/3*p+q/3);a+=" c "+c+","+m+","+n+","+p+","+k+","+q}"A"==g&&(a+=" wa "+f);"B"==g&&(a+=" at "+f);c=h}return a},animate:function(a,b,c,d,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 e){var f=a.node,g=this.chart;if("translate"==b){b=c.split(",");c=b[1];var h=f.offsetTop;g.animate(a,"left",f.offsetLeft,b[0],d,e,"px");g.animate(a,"top",h,c,d,e,"px")}},clipRect:function(a,b,c,d,e){a=a.node;0===b&&0===c?(a.style.width=d+"px",a.style.height=e+"px",a.style.overflow="hidden"):a.style.clip="rect("+c+"px "+(b+d)+"px "+(c+e)+"px "+b+"px)"},rotate:function(a,b,c){if(0!==Number(b)){var d=a.node;a=d.style;c||(c=this.getBGColor(d.parentNode));a.backgroundColor=c;a.paddingLeft=1;c=b*Math.PI/
		180;var e=Math.cos(c),f=Math.sin(c),g=AmCharts.removePx(a.left),h=AmCharts.removePx(a.top),k=d.offsetWidth,d=d.offsetHeight;b/=Math.abs(b);a.left=g+k/2-k/2*Math.cos(c)-b*d/2*Math.sin(c)+3;a.top=h-b*k/2*Math.sin(c)+b*d/2*Math.sin(c);a.cssText=a.cssText+"; filter:progid:DXImageTransform.Microsoft.Matrix(M11='"+e+"', M12='"+-f+"', M21='"+f+"', M22='"+e+"', sizingmethod='auto expand');"}},getBGColor:function(a){var b="#FFFFFF";if(a.style){var c=a.style.backgroundColor;""!==c?b=c:a.parentNode&&(b=this.getBGColor(a.parentNode))}return b},
		set:function(a){var b=new AmCharts.AmDObject("group",this.D);this.D.container.appendChild(b.node);if(a){var c;for(c=0;c<a.length;c++)b.push(a[c])}return b},gradient:function(a,b,c,d){var e="";"radialGradient"==b&&(b="gradientradial",c.reverse());"linearGradient"==b&&(b="gradient");var f;for(f=0;f<c.length;f++){var g=Math.round(100*f/(c.length-1)),e=e+(g+"% "+c[f]);f<c.length-1&&(e+=",")}a=a.fill;90==d?d=0:270==d?d=180:180==d?d=90:0===d&&(d=270);8===document.documentMode?(a.type=b,a.angle=d):(a.setAttribute("type",
			b),a.setAttribute("angle",d));e&&(a.colors.value=e)},remove:function(a){a.clipPath&&this.D.remove(a.clipPath);this.D.remove(a.node)},disableSelection:function(a){void 0!==typeof a.onselectstart&&(a.onselectstart=function(){return!1});a.style.cursor="default"},pattern:function(a,b){var c=a.node,d=a.fill,e="none";b.color&&(e=b.color);c.fillColor=e;8===document.documentMode?(d.type="tile",d.src=b.url):(d.setAttribute("type","tile"),d.setAttribute("src",b.url))},update:function(){}});AmCharts.SVGRenderer=AmCharts.Class({construct:function(a){this.D=a;this.animations=[]},create:function(a,b){return document.createElementNS(AmCharts.SVG_NS,b)},attr:function(a,b){for(var c in b)b.hasOwnProperty(c)&&this.setAttr(a,c,b[c])},setAttr:function(a,b,c){void 0!==c&&a.node.setAttribute(b,c)},animate:function(a,b,c,d,e){var f=a.node;a["an_"+b]&&AmCharts.removeFromArray(this.animations,a["an_"+b]);"translate"==b?(f=(f=f.getAttribute("transform"))?String(f).substring(10,f.length-1):"0,0",f=
		f.split(", ").join(" "),f=f.split(" ").join(","),0===f&&(f="0,0")):f=Number(f.getAttribute(b));c={obj:a,frame:0,attribute:b,from:f,to:c,time:d,effect:e};this.animations.push(c);a["an_"+b]=c},update:function(){var a,b=this.animations;for(a=b.length-1;0<=a;a--){var c=b[a],d=1E3*c.time/AmCharts.updateRate,e=c.frame+1,f=c.obj,g=c.attribute,h,k,l;e<=d?(c.frame++,"translate"==g?(h=c.from.split(","),g=Number(h[0]),h=Number(h[1]),isNaN(h)&&(h=0),k=c.to.split(","),l=Number(k[0]),k=Number(k[1]),l=0===l-g?l:
		Math.round(AmCharts[c.effect](0,e,g,l-g,d)),c=0===k-h?k:Math.round(AmCharts[c.effect](0,e,h,k-h,d)),g="transform",c="translate("+l+","+c+")"):(k=Number(c.from),h=Number(c.to),l=h-k,c=AmCharts[c.effect](0,e,k,l,d),isNaN(c)&&(c=h),0===l&&this.animations.splice(a,1)),this.setAttr(f,g,c)):("translate"==g?(k=c.to.split(","),l=Number(k[0]),k=Number(k[1]),f.translate(l,k)):(h=Number(c.to),this.setAttr(f,g,h)),this.animations.splice(a,1))}},getBBox:function(a){if(a=a.node)try{return a.getBBox()}catch(b){}return{width:0,
		height:0,x:0,y:0}},path:function(a,b){a.node.setAttributeNS(AmCharts.SVG_XLINK,"xlink:href",b)},clipRect:function(a,b,c,d,e){var f=a.node,g=a.clipPath;g&&this.D.remove(g);var h=f.parentNode;h&&(f=document.createElementNS(AmCharts.SVG_NS,"clipPath"),g=AmCharts.getUniqueId(),f.setAttribute("id",g),this.D.rect(b,c,d,e,0,0,f),h.appendChild(f),b="#",AmCharts.baseHref&&!AmCharts.isIE&&(b=window.location.href+b),this.setAttr(a,"clip-path","url("+b+g+")"),this.clipPathC++,a.clipPath=f)},text:function(a,b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      c){var d=new AmCharts.AmDObject("text",this.D);a=String(a).split("\n");var e=b["font-size"],f;for(f=0;f<a.length;f++){var g=this.create(null,"tspan");g.appendChild(document.createTextNode(a[f]));g.setAttribute("y",(e+2)*f+Math.round(e/2));g.setAttribute("x",0);d.node.appendChild(g)}d.node.setAttribute("y",Math.round(e/2));this.attr(d,b);this.D.addToContainer(d.node,c);return d},setText:function(a,b){var c=a.node;c&&(c.removeChild(c.firstChild),c.appendChild(document.createTextNode(b)))},move:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                b,c,d){b="translate("+b+","+c+")";d&&(b=b+" scale("+d+")");this.setAttr(a,"transform",b)},rotate:function(a,b){var c=a.node.getAttribute("transform"),d="rotate("+b+")";c&&(d=c+" "+d);this.setAttr(a,"transform",d)},set:function(a){var b=new AmCharts.AmDObject("g",this.D);this.D.container.appendChild(b.node);if(a){var c;for(c=0;c<a.length;c++)b.push(a[c])}return b},addListener:function(a,b,c){a.node["on"+b]=c},gradient:function(a,b,c,d){var e=a.node,f=a.grad;f&&this.D.remove(f);b=document.createElementNS(AmCharts.SVG_NS,
		b);f=AmCharts.getUniqueId();b.setAttribute("id",f);if(!isNaN(d)){var g=0,h=0,k=0,l=0;90==d?k=100:270==d?l=100:180==d?g=100:0===d&&(h=100);b.setAttribute("x1",g+"%");b.setAttribute("x2",h+"%");b.setAttribute("y1",k+"%");b.setAttribute("y2",l+"%")}for(d=0;d<c.length;d++)g=document.createElementNS(AmCharts.SVG_NS,"stop"),h=100*d/(c.length-1),0===d&&(h=0),g.setAttribute("offset",h+"%"),g.setAttribute("stop-color",c[d]),b.appendChild(g);e.parentNode.appendChild(b);c="#";AmCharts.baseHref&&!AmCharts.isIE&&
	(c=window.location.href+c);e.setAttribute("fill","url("+c+f+")");a.grad=b},pattern:function(a,b,c){var d=a.node;isNaN(c)&&(c=1);var e=a.patternNode;e&&this.D.remove(e);var e=document.createElementNS(AmCharts.SVG_NS,"pattern"),f=AmCharts.getUniqueId(),g=b;b.url&&(g=b.url);var h=Number(b.width);isNaN(h)&&(h=4);var k=Number(b.height);isNaN(k)&&(k=4);h/=c;k/=c;c=b.x;isNaN(c)&&(c=0);var l=-Math.random()*Number(b.randomX);isNaN(l)||(c=l);l=b.y;isNaN(l)&&(l=0);var m=-Math.random()*Number(b.randomY);isNaN(m)||
	(l=m);e.setAttribute("id",f);e.setAttribute("width",h);e.setAttribute("height",k);e.setAttribute("patternUnits","userSpaceOnUse");e.setAttribute("xlink:href",g);b.color&&(m=document.createElementNS(AmCharts.SVG_NS,"rect"),m.setAttributeNS(null,"height",h),m.setAttributeNS(null,"width",k),m.setAttributeNS(null,"fill",b.color),e.appendChild(m));this.D.image(g,0,0,h,k,e).translate(c,l);g="#";AmCharts.baseHref&&!AmCharts.isIE&&(g=window.location.href+g);d.setAttribute("fill","url("+g+f+")");a.patternNode=
		e;d.parentNode.appendChild(e)},remove:function(a){a.clipPath&&this.D.remove(a.clipPath);a.grad&&this.D.remove(a.grad);a.patternNode&&this.D.remove(a.patternNode);this.D.remove(a.node)}});AmCharts.AmDSet=AmCharts.Class({construct:function(a){this.create("g")},attr:function(a){this.R.attr(this.node,a)},move:function(a,b){this.R.move(this.node,a,b)}});AmCharts.AmLegend=AmCharts.Class({construct:function(a){this.cname="AmLegend";this.createEvents("rollOverMarker","rollOverItem","rollOutMarker","rollOutItem","showItem","hideItem","clickMarker","rollOverItem","rollOutItem","clickLabel");this.position="bottom";this.borderColor=this.color="#000000";this.borderAlpha=0;this.markerLabelGap=5;this.verticalGap=10;this.align="left";this.horizontalGap=0;this.spacing=10;this.markerDisabledColor="#AAB3B3";this.markerType="square";this.markerSize=16;this.markerBorderThickness=
		this.markerBorderAlpha=1;this.marginBottom=this.marginTop=0;this.marginLeft=this.marginRight=20;this.autoMargins=!0;this.valueWidth=50;this.switchable=!0;this.switchType="x";this.switchColor="#FFFFFF";this.rollOverColor="#CC0000";this.reversedOrder=!1;this.labelText="[[title]]";this.valueText="[[value]]";this.useMarkerColorForLabels=!1;this.rollOverGraphAlpha=1;this.textClickEnabled=!1;this.equalWidths=!0;this.dateFormat="DD-MM-YYYY";this.backgroundColor="#FFFFFF";this.backgroundAlpha=0;this.useGraphSettings=
		!1;this.showEntries=!0;AmCharts.applyTheme(this,a,this.cname)},setData:function(a){this.legendData=a;this.invalidateSize()},invalidateSize:function(){this.destroy();this.entries=[];this.valueLabels=[];(AmCharts.ifArray(this.legendData)||AmCharts.ifArray(this.data))&&this.drawLegend()},drawLegend:function(){var a=this.chart,b=this.position,c=this.width,d=a.divRealWidth,e=a.divRealHeight,f=this.div,g=this.legendData;this.data&&(g=this.data);isNaN(this.fontSize)&&(this.fontSize=a.fontSize);if("right"==
		b||"left"==b)this.maxColumns=1,this.autoMargins&&(this.marginLeft=this.marginRight=10);else if(this.autoMargins){this.marginRight=a.marginRight;this.marginLeft=a.marginLeft;var h=a.autoMarginOffset;"bottom"==b?(this.marginBottom=h,this.marginTop=0):(this.marginTop=h,this.marginBottom=0)}var k;void 0!==c?k=AmCharts.toCoordinate(c,d):"right"!=b&&"left"!=b&&(k=a.realWidth);"outside"==b?(k=f.offsetWidth,e=f.offsetHeight,f.clientHeight&&(k=f.clientWidth,e=f.clientHeight)):(isNaN(k)||(f.style.width=k+"px"),
		f.className="amChartsLegend");this.divWidth=k;(b=this.container)?(b.container.innerHTML="",f.appendChild(b.container),b.setSize(k,e)):b=new AmCharts.AmDraw(f,k,e,a);this.container=b;this.lx=0;this.ly=8;e=this.markerSize;e>this.fontSize&&(this.ly=e/2-1);0<e&&(this.lx+=e+this.markerLabelGap);this.titleWidth=0;if(e=this.title)a=AmCharts.text(this.container,e,this.color,a.fontFamily,this.fontSize,"start",!0),a.translate(this.marginLeft,this.marginTop+this.verticalGap+this.ly+1),a=a.getBBox(),this.titleWidth=
		a.width+15,this.titleHeight=a.height+6;this.index=this.maxLabelWidth=0;if(this.showEntries){for(a=0;a<g.length;a++)this.createEntry(g[a]);for(a=this.index=0;a<g.length;a++)this.createValue(g[a])}this.arrangeEntries();this.updateValues()},arrangeEntries:function(){var a=this.position,b=this.marginLeft+this.titleWidth,c=this.marginRight,d=this.marginTop,e=this.marginBottom,f=this.horizontalGap,g=this.div,h=this.divWidth,k=this.maxColumns,l=this.verticalGap,m=this.spacing,n=h-c-b,p=0,q=0,r=this.container;
		this.set&&this.set.remove();var s=r.set();this.set=s;r=r.set();s.push(r);var w=this.entries,v,t;for(t=0;t<w.length;t++){v=w[t].getBBox();var u=v.width;u>p&&(p=u);v=v.height;v>q&&(q=v)}var u=q=0,x=f,E=0,A=0;for(t=0;t<w.length;t++){var z=w[t];this.reversedOrder&&(z=w[w.length-t-1]);v=z.getBBox();var H;this.equalWidths?H=f+u*(p+m+this.markerLabelGap):(H=x,x=x+v.width+f+m);v.height>A&&(A=v.height);H+v.width>n&&0<t&&0!==u&&(q++,u=0,H=f,x=H+v.width+f+m,E=E+A+l,A=0);z.translate(H,E);u++;!isNaN(k)&&u>=k&&
		(u=0,q++,E=E+A+l,A=0);r.push(z)}v=r.getBBox();k=v.height+2*l-1;"left"==a||"right"==a?(h=v.width+2*f,g.style.width=h+b+c+"px"):h=h-b-c-1;c=AmCharts.polygon(this.container,[0,h,h,0],[0,0,k,k],this.backgroundColor,this.backgroundAlpha,1,this.borderColor,this.borderAlpha);s.push(c);s.translate(b,d);c.toBack();b=f;if("top"==a||"bottom"==a||"absolute"==a||"outside"==a)"center"==this.align?b=f+(h-v.width)/2:"right"==this.align&&(b=f+h-v.width);r.translate(b,l+1);this.titleHeight>k&&(k=this.titleHeight);
		a=k+d+e+1;0>a&&(a=0);g.style.height=Math.round(a)+"px"},createEntry:function(a){if(!1!==a.visibleInLegend){var b=this.chart,c=a.markerType;c||(c=this.markerType);var d=a.color,e=a.alpha;a.legendKeyColor&&(d=a.legendKeyColor());a.legendKeyAlpha&&(e=a.legendKeyAlpha());var f;!0===a.hidden&&(f=d=this.markerDisabledColor);var g=a.pattern,h=a.customMarker;h||(h=this.customMarker);var k=this.container,l=this.markerSize,m=0,n=0,p=l/2;if(this.useGraphSettings)if(m=a.type,this.switchType=void 0,"line"==m||
		"step"==m||"smoothedLine"==m||"ohlc"==m)g=k.set(),a.hidden||(d=a.lineColorR,f=a.bulletBorderColorR),n=AmCharts.line(k,[0,2*l],[l/2,l/2],d,a.lineAlpha,a.lineThickness,a.dashLength),g.push(n),a.bullet&&(a.hidden||(d=a.bulletColorR),n=AmCharts.bullet(k,a.bullet,a.bulletSize,d,a.bulletAlpha,a.bulletBorderThickness,f,a.bulletBorderAlpha))&&(n.translate(l+1,l/2),g.push(n)),p=0,m=l,n=l/3;else{var q;a.getGradRotation&&(q=a.getGradRotation());m=a.fillColorsR;!0===a.hidden&&(m=d);if(g=this.createMarker("rectangle",
			m,a.fillAlphas,a.lineThickness,d,a.lineAlpha,q,g))p=l,g.translate(p,l/2);m=l}else h?(b.path&&(h=b.path+h),g=k.image(h,0,0,l,l)):(g=this.createMarker(c,d,e,void 0,void 0,void 0,void 0,g))&&g.translate(l/2,l/2);this.addListeners(g,a);k=k.set([g]);this.switchable&&a.switchable&&k.setAttr("cursor","pointer");(f=this.switchType)&&"none"!=f&&("x"==f?(q=this.createX(),q.translate(l/2,l/2)):q=this.createV(),q.dItem=a,!0!==a.hidden?"x"==f?q.hide():q.show():"x"!=f&&q.hide(),this.switchable||q.hide(),this.addListeners(q,
		a),a.legendSwitch=q,k.push(q));f=this.color;a.showBalloon&&this.textClickEnabled&&void 0!==this.selectedColor&&(f=this.selectedColor);this.useMarkerColorForLabels&&(f=d);!0===a.hidden&&(f=this.markerDisabledColor);d=AmCharts.massReplace(this.labelText,{"[[title]]":a.title});q=this.fontSize;g&&l<=q&&g.translate(p,l/2+this.ly-q/2+(q+2-l)/2-n);var r;d&&(d=AmCharts.fixBrakes(d),a.legendTextReal=d,r=this.labelWidth,r=isNaN(r)?AmCharts.text(this.container,d,f,b.fontFamily,q,"start"):AmCharts.wrappedText(this.container,
		d,f,b.fontFamily,q,"start",!1,r,0),r.translate(this.lx+m,this.ly),k.push(r),b=r.getBBox().width,this.maxLabelWidth<b&&(this.maxLabelWidth=b));this.entries[this.index]=k;a.legendEntry=this.entries[this.index];a.legendLabel=r;this.index++}},addListeners:function(a,b){var c=this;a&&a.mouseover(function(a){c.rollOverMarker(b,a)}).mouseout(function(a){c.rollOutMarker(b,a)}).click(function(a){c.clickMarker(b,a)})},rollOverMarker:function(a,b){this.switchable&&this.dispatch("rollOverMarker",a,b);this.dispatch("rollOverItem",
		a,b)},rollOutMarker:function(a,b){this.switchable&&this.dispatch("rollOutMarker",a,b);this.dispatch("rollOutItem",a,b)},clickMarker:function(a,b){this.switchable&&(!0===a.hidden?this.dispatch("showItem",a,b):this.dispatch("hideItem",a,b));this.dispatch("clickMarker",a,b)},rollOverLabel:function(a,b){a.hidden||(this.textClickEnabled&&a.legendLabel&&a.legendLabel.attr({fill:this.rollOverColor}),this.dispatch("rollOverItem",a,b))},rollOutLabel:function(a,b){if(!a.hidden){if(this.textClickEnabled&&a.legendLabel){var c=
		this.color;void 0!==this.selectedColor&&a.showBalloon&&(c=this.selectedColor);this.useMarkerColorForLabels&&(c=a.lineColor,void 0===c&&(c=a.color));a.legendLabel.attr({fill:c})}this.dispatch("rollOutItem",a,b)}},clickLabel:function(a,b){this.textClickEnabled?a.hidden||this.dispatch("clickLabel",a,b):this.switchable&&(!0===a.hidden?this.dispatch("showItem",a,b):this.dispatch("hideItem",a,b))},dispatch:function(a,b,c){this.fire(a,{type:a,dataItem:b,target:this,event:c,chart:this.chart})},createValue:function(a){var b=
		this,c=b.fontSize;if(!1!==a.visibleInLegend){var d=b.maxLabelWidth;b.equalWidths||(b.valueAlign="left");"left"==b.valueAlign&&(d=a.legendEntry.getBBox().width);var e=d;if(b.valueText&&0<b.valueWidth){var f=b.color;b.useMarkerColorForValues&&(f=a.color,a.legendKeyColor&&(f=a.legendKeyColor()));!0===a.hidden&&(f=b.markerDisabledColor);var g=b.valueText,d=d+b.lx+b.markerLabelGap+b.valueWidth,h="end";"left"==b.valueAlign&&(d-=b.valueWidth,h="start");f=AmCharts.text(b.container,g,f,b.chart.fontFamily,
		c,h);f.translate(d,b.ly);b.entries[b.index].push(f);e+=b.valueWidth+2*b.markerLabelGap;f.dItem=a;b.valueLabels.push(f)}b.index++;f=b.markerSize;f<c+7&&(f=c+7,AmCharts.VML&&(f+=3));c=b.container.rect(b.markerSize,0,e,f,0,0).attr({stroke:"none",fill:"#ffffff","fill-opacity":.005});c.dItem=a;b.entries[b.index-1].push(c);c.mouseover(function(c){b.rollOverLabel(a,c)}).mouseout(function(c){b.rollOutLabel(a,c)}).click(function(c){b.clickLabel(a,c)})}},createV:function(){var a=this.markerSize;return AmCharts.polygon(this.container,
		[a/5,a/2,a-a/5,a/2],[a/3,a-a/5,a/5,a/1.7],this.switchColor)},createX:function(){var a=(this.markerSize-4)/2,b={stroke:this.switchColor,"stroke-width":3},c=this.container,d=AmCharts.line(c,[-a,a],[-a,a]).attr(b),a=AmCharts.line(c,[-a,a],[a,-a]).attr(b);return this.container.set([d,a])},createMarker:function(a,b,c,d,e,f,g,h){var k=this.markerSize,l=this.container;e||(e=this.markerBorderColor);e||(e=b);isNaN(d)&&(d=this.markerBorderThickness);isNaN(f)&&(f=this.markerBorderAlpha);return AmCharts.bullet(l,
		a,k,b,c,d,e,f,k,g,h)},validateNow:function(){this.invalidateSize()},updateValues:function(){var a=this.valueLabels,b=this.chart,c,d=this.data;for(c=0;c<a.length;c++){var e=a[c],f=e.dItem,g=" ";if(d)f.value?e.text(f.value):e.text("");else{if(void 0!==f.type){var h=f.currentDataItem,k=this.periodValueText;f.legendPeriodValueText&&(k=f.legendPeriodValueText);h?(g=this.valueText,f.legendValueText&&(g=f.legendValueText),g=b.formatString(g,h)):k&&(g=b.formatPeriodString(k,f))}else g=b.formatString(this.valueText,
		f);if(k=this.valueFunction)h&&(f=h),g=k(f,g);e.text(g)}}},renderFix:function(){if(!AmCharts.VML){var a=this.container;a&&a.renderFix()}},destroy:function(){this.div.innerHTML="";AmCharts.remove(this.set)}});AmCharts.formatMilliseconds=function(a,b){if(-1!=a.indexOf("fff")){var c=b.getMilliseconds(),d=String(c);10>c&&(d="00"+c);10<=c&&100>c&&(d="0"+c);a=a.replace(/fff/g,d)}return a};AmCharts.extractPeriod=function(a){var b=AmCharts.stripNumbers(a),c=1;b!=a&&(c=Number(a.slice(0,a.indexOf(b))));return{period:b,count:c}};
	AmCharts.newDate=function(a,b){return date="fff"==b?AmCharts.useUTC?new Date(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds(),a.getUTCMilliseconds()):new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()):new Date(a)};
	AmCharts.resetDateToMin=function(a,b,c,d){void 0===d&&(d=1);var e,f,g,h,k,l,m;AmCharts.useUTC?(e=a.getUTCFullYear(),f=a.getUTCMonth(),g=a.getUTCDate(),h=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),m=a.getUTCMilliseconds(),a=a.getUTCDay()):(e=a.getFullYear(),f=a.getMonth(),g=a.getDate(),h=a.getHours(),k=a.getMinutes(),l=a.getSeconds(),m=a.getMilliseconds(),a=a.getDay());switch(b){case "YYYY":e=Math.floor(e/c)*c;f=0;g=1;m=l=k=h=0;break;case "MM":f=Math.floor(f/c)*c;g=1;m=l=k=h=0;break;case "WW":0===
	a&&0<d&&(a=7);g=g-a+d;m=l=k=h=0;break;case "DD":m=l=k=h=0;break;case "hh":h=Math.floor(h/c)*c;m=l=k=0;break;case "mm":k=Math.floor(k/c)*c;m=l=0;break;case "ss":l=Math.floor(l/c)*c;m=0;break;case "fff":m=Math.floor(m/c)*c}AmCharts.useUTC?(a=new Date,a.setUTCFullYear(e,f,g),a.setUTCHours(h,k,l,m)):a=new Date(e,f,g,h,k,l,m);return a};
	AmCharts.getPeriodDuration=function(a,b){void 0===b&&(b=1);var c;switch(a){case "YYYY":c=316224E5;break;case "MM":c=26784E5;break;case "WW":c=6048E5;break;case "DD":c=864E5;break;case "hh":c=36E5;break;case "mm":c=6E4;break;case "ss":c=1E3;break;case "fff":c=1}return c*b};AmCharts.intervals={s:{nextInterval:"ss",contains:1E3},ss:{nextInterval:"mm",contains:60,count:0},mm:{nextInterval:"hh",contains:60,count:1},hh:{nextInterval:"DD",contains:24,count:2},DD:{nextInterval:"",contains:Infinity,count:3}};
	AmCharts.getMaxInterval=function(a,b){var c=AmCharts.intervals;return a>=c[b].contains?(a=Math.round(a/c[b].contains),b=c[b].nextInterval,AmCharts.getMaxInterval(a,b)):"ss"==b?c[b].nextInterval:b};AmCharts.dayNames="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");AmCharts.shortDayNames="Sun Mon Tue Wed Thu Fri Sat".split(" ");AmCharts.monthNames="January February March April May June July August September October November December".split(" ");AmCharts.shortMonthNames="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
	AmCharts.getWeekNumber=function(a){a=new Date(a);a.setHours(0,0,0);a.setDate(a.getDate()+4-(a.getDay()||7));var b=new Date(a.getFullYear(),0,1);return Math.ceil(((a-b)/864E5+1)/7)};
	AmCharts.stringToDate=function(a,b){var c={},d=[{pattern:"YYYY",period:"year"},{pattern:"YY",period:"year"},{pattern:"MM",period:"month"},{pattern:"M",period:"month"},{pattern:"DD",period:"date"},{pattern:"D",period:"date"},{pattern:"JJ",period:"hours"},{pattern:"J",period:"hours"},{pattern:"HH",period:"hours"},{pattern:"H",period:"hours"},{pattern:"KK",period:"hours"},{pattern:"K",period:"hours"},{pattern:"LL",period:"hours"},{pattern:"L",period:"hours"},{pattern:"NN",period:"minutes"},{pattern:"N",
		period:"minutes"},{pattern:"SS",period:"seconds"},{pattern:"S",period:"seconds"},{pattern:"QQQ",period:"milliseconds"},{pattern:"QQ",period:"milliseconds"},{pattern:"Q",period:"milliseconds"}],e=!0,f=b.indexOf("AA");-1!=f&&(a.substr(f,2),"pm"==a.toLowerCase&&(e=!1));var f=b,g,h,k;for(k=0;k<d.length;k++)h=d[k].period,c[h]=0,"date"==h&&(c[h]=1);for(k=0;k<d.length;k++)if(g=d[k].pattern,h=d[k].period,-1!=b.indexOf(g)){var l=AmCharts.getFromDateString(g,a,f);b=b.replace(g,"");if("KK"==g||"K"==g||"LL"==
		g||"L"==g)e||(l+=12);c[h]=l}AmCharts.useUTC?(d=new Date,d.setUTCFullYear(c.year,c.month,c.date),d.setUTCHours(c.hours,c.minutes,c.seconds,c.milliseconds)):d=new Date(c.year,c.month,c.date,c.hours,c.minutes,c.seconds,c.milliseconds);return d};AmCharts.getFromDateString=function(a,b,c){if(void 0!==b)return c=c.indexOf(a),b=b.substr(c,a.length),"0"==b.charAt(0)&&(b=b.substr(1,b.length-1)),b=Number(b),isNaN(b)&&(b=0),-1!=a.indexOf("M")&&b--,b};
	AmCharts.formatDate=function(a,b,c){c||(c=AmCharts);var d,e,f,g,h,k,l,m=AmCharts.getWeekNumber(a);AmCharts.useUTC?(d=a.getUTCFullYear(),e=a.getUTCMonth(),f=a.getUTCDate(),g=a.getUTCDay(),h=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),a=a.getUTCMilliseconds()):(d=a.getFullYear(),e=a.getMonth(),f=a.getDate(),g=a.getDay(),h=a.getHours(),k=a.getMinutes(),l=a.getSeconds(),a=a.getMilliseconds());var n=String(d).substr(2,2),p=e+1;9>e&&(p="0"+p);var q="0"+g;b=b.replace(/W/g,m);m=h;24==m&&(m=0);
		var r=m;10>r&&(r="0"+r);b=b.replace(/JJ/g,r);b=b.replace(/J/g,m);r=h;0===r&&(r=24,-1!=b.indexOf("H")&&f--);m=f;10>f&&(m="0"+f);var s=r;10>s&&(s="0"+s);b=b.replace(/HH/g,s);b=b.replace(/H/g,r);r=h;11<r&&(r-=12);s=r;10>s&&(s="0"+s);b=b.replace(/KK/g,s);b=b.replace(/K/g,r);r=h;0===r&&(r=12);12<r&&(r-=12);s=r;10>s&&(s="0"+s);b=b.replace(/LL/g,s);b=b.replace(/L/g,r);r=k;10>r&&(r="0"+r);b=b.replace(/NN/g,r);b=b.replace(/N/g,k);k=l;10>k&&(k="0"+k);b=b.replace(/SS/g,k);b=b.replace(/S/g,l);l=a;10>l&&(l="00"+
			l);100>l&&(l="0"+l);k=a;10>k&&(k="00"+k);b=b.replace(/QQQ/g,l);b=b.replace(/QQ/g,k);b=b.replace(/Q/g,a);b=12>h?b.replace(/A/g,"am"):b.replace(/A/g,"pm");b=b.replace(/YYYY/g,"@IIII@");b=b.replace(/YY/g,"@II@");b=b.replace(/MMMM/g,"@XXXX@");b=b.replace(/MMM/g,"@XXX@");b=b.replace(/MM/g,"@XX@");b=b.replace(/M/g,"@X@");b=b.replace(/DD/g,"@RR@");b=b.replace(/D/g,"@R@");b=b.replace(/EEEE/g,"@PPPP@");b=b.replace(/EEE/g,"@PPP@");b=b.replace(/EE/g,"@PP@");b=b.replace(/E/g,"@P@");b=b.replace(/@IIII@/g,d);b=
			b.replace(/@II@/g,n);b=b.replace(/@XXXX@/g,c.monthNames[e]);b=b.replace(/@XXX@/g,c.shortMonthNames[e]);b=b.replace(/@XX@/g,p);b=b.replace(/@X@/g,e+1);b=b.replace(/@RR@/g,m);b=b.replace(/@R@/g,f);b=b.replace(/@PPPP@/g,c.dayNames[g]);b=b.replace(/@PPP@/g,c.shortDayNames[g]);b=b.replace(/@PP@/g,q);return b=b.replace(/@P@/g,g)};
	AmCharts.changeDate=function(a,b,c,d,e){var f=-1;void 0===d&&(d=!0);void 0===e&&(e=!1);!0===d&&(f=1);switch(b){case "YYYY":a.setFullYear(a.getFullYear()+c*f);d||e||a.setDate(a.getDate()+1);break;case "MM":b=a.getMonth();a.setMonth(a.getMonth()+c*f);a.getMonth()>b+c*f&&a.setDate(a.getDate()-1);d||e||a.setDate(a.getDate()+1);break;case "DD":a.setDate(a.getDate()+c*f);break;case "WW":a.setDate(a.getDate()+c*f*7);break;case "hh":a.setHours(a.getHours()+c*f);break;case "mm":a.setMinutes(a.getMinutes()+
		c*f);break;case "ss":a.setSeconds(a.getSeconds()+c*f);break;case "fff":a.setMilliseconds(a.getMilliseconds()+c*f)}return a};module.exports = AmCharts;


/***/ },

/***/ 465:
/***/ function(module, exports, __webpack_require__) {

	var AmCharts=__webpack_require__(464);AmCharts.GaugeAxis=AmCharts.Class({construct:function(a){this.cname="GaugeAxis";this.radius="95%";this.startAngle=-120;this.endAngle=120;this.startValue=0;this.endValue=200;this.gridCount=5;this.tickLength=10;this.minorTickLength=5;this.tickColor="#555555";this.labelFrequency=this.tickThickness=this.tickAlpha=1;this.inside=!0;this.labelOffset=10;this.showLastLabel=this.showFirstLabel=!0;this.axisThickness=1;this.axisColor="#000000";this.axisAlpha=1;this.gridInside=!0;this.topTextYOffset=0;this.topTextBold=
		!0;this.bottomTextYOffset=0;this.bottomTextBold=!0;this.centerY=this.centerX="0%";this.bandOutlineAlpha=this.bandOutlineThickness=0;this.bandOutlineColor="#000000";this.bandAlpha=1;AmCharts.applyTheme(this,a,"GaugeAxis")},value2angle:function(a){return(a-this.startValue)/(this.endValue-this.startValue)*(this.endAngle-this.startAngle)+this.startAngle},setTopText:function(a){if(void 0!==a){this.topText=a;var b=this.chart;if(this.axisCreated){this.topTF&&this.topTF.remove();var c=this.topTextFontSize;
		c||(c=b.fontSize);var d=this.topTextColor;d||(d=b.color);a=AmCharts.text(b.container,a,d,b.fontFamily,c,void 0,this.topTextBold);a.translate(this.centerXReal,this.centerYReal-this.radiusReal/2+this.topTextYOffset);this.chart.graphsSet.push(a);this.topTF=a}}},setBottomText:function(a){if(void 0!==a){this.bottomText=a;var b=this.chart;if(this.axisCreated){this.bottomTF&&this.bottomTF.remove();var c=this.bottomTextFontSize;c||(c=b.fontSize);var d=this.bottomTextColor;d||(d=b.color);a=AmCharts.text(b.container,
		a,d,b.fontFamily,c,void 0,this.bottomTextBold);a.translate(this.centerXReal,this.centerYReal+this.radiusReal/2+this.bottomTextYOffset);this.bottomTF=a;this.chart.graphsSet.push(a)}}},draw:function(){var a=this.chart,b=a.graphsSet,c=this.startValue,d=this.endValue,f=this.valueInterval;isNaN(f)&&(f=(d-c)/this.gridCount);var h=this.minorTickInterval;isNaN(h)&&(h=f/5);var p=this.startAngle,k=this.endAngle,e=this.tickLength,l=(d-c)/f+1,g=(k-p)/(l-1);this.singleValueAngle=d=g/f;var m=a.container,q=this.tickColor,
		u=this.tickAlpha,C=this.tickThickness,D=f/h,G=g/D,h=this.minorTickLength,I=this.labelFrequency,s=this.radiusReal;this.inside||(s-=15);var y=a.centerX+AmCharts.toCoordinate(this.centerX,a.realWidth),z=a.centerY+AmCharts.toCoordinate(this.centerY,a.realHeight);this.centerXReal=y;this.centerYReal=z;var J={fill:this.axisColor,"fill-opacity":this.axisAlpha,"stroke-width":0,"stroke-opacity":0},n,A;this.gridInside?A=n=s:(n=s-e,A=n+h);var r=this.axisThickness/2,k=AmCharts.wedge(m,y,z,p,k-p,n+r,n+r,n-r,0,
		J);b.push(k);k=AmCharts.doNothing;AmCharts.isModern||(k=Math.round);J=AmCharts.getDecimals(f);for(n=0;n<l;n++){var v=c+n*f,r=p+n*g,w=k(y+s*Math.sin(r/180*Math.PI)),B=k(z-s*Math.cos(r/180*Math.PI)),x=k(y+(s-e)*Math.sin(r/180*Math.PI)),t=k(z-(s-e)*Math.cos(r/180*Math.PI)),w=AmCharts.line(m,[w,x],[B,t],q,u,C,0,!1,!1,!0);b.push(w);w=-1;x=this.labelOffset;this.inside||(x=-x-e,w=1);var B=Math.sin(r/180*Math.PI),t=Math.cos(r/180*Math.PI),B=y+(s-e-x)*B,x=z-(s-e-x)*t,E=this.fontSize;isNaN(E)&&(E=a.fontSize);
		var t=Math.sin((r-90)/180*Math.PI),K=Math.cos((r-90)/180*Math.PI);if(0<I&&n/I==Math.round(n/I)&&(this.showLastLabel||n!=l-1)&&(this.showFirstLabel||0!==n)){var F;F=this.usePrefixes?AmCharts.addPrefix(v,a.prefixesOfBigNumbers,a.prefixesOfSmallNumbers,a.nf,!0):AmCharts.formatNumber(v,a.nf,J);var H=this.unit;H&&(F="left"==this.unitPosition?H+F:F+H);(H=this.labelFunction)&&(F=H(v));v=AmCharts.text(m,F,a.color,a.fontFamily,E);E=v.getBBox();v.translate(B+w*E.width/2*K,x+w*E.height/2*t);b.push(v)}if(n<l-
			1)for(v=1;v<D;v++)t=r+G*v,w=k(y+A*Math.sin(t/180*Math.PI)),B=k(z-A*Math.cos(t/180*Math.PI)),x=k(y+(A-h)*Math.sin(t/180*Math.PI)),t=k(z-(A-h)*Math.cos(t/180*Math.PI)),w=AmCharts.line(m,[w,x],[B,t],q,u,C,0,!1,!1,!0),b.push(w)}if(b=this.bands)for(c=0;c<b.length;c++)if(f=b[c])q=f.startValue,u=f.endValue,e=AmCharts.toCoordinate(f.radius,s),isNaN(e)&&(e=A),l=AmCharts.toCoordinate(f.innerRadius,s),isNaN(l)&&(l=e-h),g=p+d*(q-this.startValue),u=d*(u-q),C=f.outlineColor,void 0==C&&(C=this.bandOutlineColor),
		D=f.outlineThickness,isNaN(D)&&(D=this.bandOutlineThickness),G=f.outlineAlpha,isNaN(G)&&(G=this.bandOutlineAlpha),q=f.alpha,isNaN(q)&&(q=this.bandAlpha),e=AmCharts.wedge(m,y,z,g,u,e,e,l,0,{fill:f.color,stroke:C,"stroke-width":D,"stroke-opacity":G}),e.setAttr("opacity",q),a.gridSet.push(e),this.addEventListeners(e,f);this.axisCreated=!0;this.setTopText(this.topText);this.setBottomText(this.bottomText);a=a.graphsSet.getBBox();this.width=a.width;this.height=a.height},addEventListeners:function(a,b){var c=
		this.chart;a.mouseover(function(a){c.showBalloon(b.balloonText,b.color,!0)}).mouseout(function(a){c.hideBalloon()})}});AmCharts.GaugeArrow=AmCharts.Class({construct:function(a){this.cname="GaugeArrow";this.color="#000000";this.nailAlpha=this.alpha=1;this.startWidth=this.nailRadius=8;this.endWidth=0;this.borderAlpha=1;this.radius="90%";this.nailBorderAlpha=this.innerRadius=0;this.nailBorderThickness=1;this.frame=0;AmCharts.applyTheme(this,a,"GaugeArrow")},setValue:function(a){var b=this.chart;b?b.setValue?b.setValue(this,a):this.previousValue=this.value=a:this.previousValue=this.value=a}});
	AmCharts.GaugeBand=AmCharts.Class({construct:function(){this.cname="GaugeBand"}});AmCharts.AmAngularGauge=AmCharts.Class({inherits:AmCharts.AmChart,construct:function(a){this.cname="AmAngularGauge";AmCharts.AmAngularGauge.base.construct.call(this,a);this.theme=a;this.type="gauge";this.minRadius=this.marginRight=this.marginBottom=this.marginTop=this.marginLeft=10;this.faceColor="#FAFAFA";this.faceAlpha=0;this.faceBorderWidth=1;this.faceBorderColor="#555555";this.faceBorderAlpha=0;this.arrows=[];this.axes=[];this.startDuration=1;this.startEffect="easeOutSine";this.adjustSize=!0;
		this.extraHeight=this.extraWidth=0;AmCharts.applyTheme(this,a,this.cname)},addAxis:function(a){this.axes.push(a)},formatString:function(a,b){return a=AmCharts.formatValue(a,b,["value"],this.nf,"",this.usePrefixes,this.prefixesOfSmallNumbers,this.prefixesOfBigNumbers)},initChart:function(){AmCharts.AmAngularGauge.base.initChart.call(this);var a;0===this.axes.length&&(a=new AmCharts.GaugeAxis(this.theme),this.addAxis(a));var b;for(b=0;b<this.axes.length;b++)a=this.axes[b],a=AmCharts.processObject(a,
		AmCharts.GaugeAxis,this.theme),a.chart=this,this.axes[b]=a;var c=this.arrows;for(b=0;b<c.length;b++){a=c[b];a=AmCharts.processObject(a,AmCharts.GaugeArrow,this.theme);a.chart=this;c[b]=a;var d=a.axis;AmCharts.isString(d)&&(a.axis=AmCharts.getObjById(this.axes,d));a.axis||(a.axis=this.axes[0]);isNaN(a.value)&&a.setValue(a.axis.startValue);isNaN(a.previousValue)&&(a.previousValue=a.axis.startValue)}this.setLegendData(c);this.drawChart();this.totalFrames=1E3*this.startDuration/AmCharts.updateRate},drawChart:function(){AmCharts.AmAngularGauge.base.drawChart.call(this);
		var a=this.container,b=this.updateWidth();this.realWidth=b;var c=this.updateHeight();this.realHeight=c;var d=AmCharts.toCoordinate,f=d(this.marginLeft,b),h=d(this.marginRight,b),p=d(this.marginTop,c)+this.getTitleHeight(),k=d(this.marginBottom,c),e=d(this.radius,b,c),d=b-f-h,l=c-p-k+this.extraHeight;e||(e=Math.min(d,l)/2);e<this.minRadius&&(e=this.minRadius);this.radiusReal=e;this.centerX=(b-f-h)/2+f;this.centerY=(c-p-k)/2+p+this.extraHeight/2;isNaN(this.gaugeX)||(this.centerX=this.gaugeX);isNaN(this.gaugeY)||
		(this.centerY=this.gaugeY);var b=this.faceAlpha,c=this.faceBorderAlpha,g;if(0<b||0<c)g=AmCharts.circle(a,e,this.faceColor,b,this.faceBorderWidth,this.faceBorderColor,c,!1),g.translate(this.centerX,this.centerY),g.toBack(),(a=this.facePattern)&&g.pattern(a);for(b=e=a=0;b<this.axes.length;b++)c=this.axes[b],f=c.radius,c.radiusReal=AmCharts.toCoordinate(f,this.radiusReal),c.draw(),h=1,-1!==String(f).indexOf("%")&&(h=1+(100-Number(f.substr(0,f.length-1)))/100),c.width*h>a&&(a=c.width*h),c.height*h>e&&
		(e=c.height*h);(b=this.legend)&&b.invalidateSize();if(this.adjustSize&&!this.chartCreated){g&&(g=g.getBBox(),g.width>a&&(a=g.width),g.height>e&&(e=g.height));g=0;if(l>e||d>a)g=Math.min(l-e,d-a);0<g&&(this.extraHeight=l-e,this.chartCreated=!0,this.validateNow())}this.dispDUpd();this.chartCreated=!0},validateSize:function(){this.extraHeight=this.extraWidth=0;this.chartCreated=!1;AmCharts.AmAngularGauge.base.validateSize.call(this)},addArrow:function(a){this.arrows.push(a)},removeArrow:function(a){AmCharts.removeFromArray(this.arrows,
		a);this.validateNow()},removeAxis:function(a){AmCharts.removeFromArray(this.axes,a);this.validateNow()},drawArrow:function(a,b){a.set&&a.set.remove();var c=this.container;a.set=c.set();if(!a.hidden){var d=a.axis,f=d.radiusReal,h=d.centerXReal,p=d.centerYReal,k=a.startWidth,e=a.endWidth,l=AmCharts.toCoordinate(a.innerRadius,d.radiusReal),g=AmCharts.toCoordinate(a.radius,d.radiusReal);d.inside||(g-=15);var m=a.nailColor;m||(m=a.color);var q=a.nailColor;q||(q=a.color);m=AmCharts.circle(c,a.nailRadius,
		m,a.nailAlpha,a.nailBorderThickness,m,a.nailBorderAlpha);a.set.push(m);m.translate(h,p);isNaN(g)&&(g=f-d.tickLength);var d=Math.sin(b/180*Math.PI),f=Math.cos(b/180*Math.PI),m=Math.sin((b+90)/180*Math.PI),u=Math.cos((b+90)/180*Math.PI),c=AmCharts.polygon(c,[h-k/2*m+l*d,h+g*d-e/2*m,h+g*d+e/2*m,h+k/2*m+l*d],[p+k/2*u-l*f,p-g*f+e/2*u,p-g*f-e/2*u,p-k/2*u-l*f],a.color,a.alpha,1,q,a.borderAlpha,void 0,!0);a.set.push(c);this.graphsSet.push(a.set)}},setValue:function(a,b){a.axis&&a.axis.value2angle&&(a.axis.value2angle(b),
		a.frame=0,a.previousValue=a.value);a.value=b;var c=this.legend;c&&c.updateValues()},handleLegendEvent:function(a){var b=a.type;a=a.dataItem;if(!this.legend.data&&a)switch(b){case "hideItem":this.hideArrow(a);break;case "showItem":this.showArrow(a)}},hideArrow:function(a){a.set.hide();a.hidden=!0},showArrow:function(a){a.set.show();a.hidden=!1},updateAnimations:function(){AmCharts.AmAngularGauge.base.updateAnimations.call(this);for(var a=this.arrows.length,b,c=0;c<a;c++){b=this.arrows[c];var d;b.frame>=
	this.totalFrames?d=b.value:(b.frame++,b.clockWiseOnly&&b.value<b.previousValue&&(d=b.axis,b.previousValue-=d.endValue-d.startValue),d=AmCharts.getEffect(this.startEffect),d=AmCharts[d](0,b.frame,b.previousValue,b.value-b.previousValue,this.totalFrames),isNaN(d)&&(d=b.value));d=b.axis.value2angle(d);this.drawArrow(b,d)}}});


/***/ },

/***/ 466:
/***/ function(module, exports, __webpack_require__) {

	var AmCharts=__webpack_require__(464);AmCharts.AmPieChart=AmCharts.Class({inherits:AmCharts.AmSlicedChart,construct:function(e){this.type="pie";AmCharts.AmPieChart.base.construct.call(this,e);this.cname="AmPieChart";this.pieBrightnessStep=30;this.minRadius=10;this.depth3D=0;this.startAngle=90;this.angle=this.innerRadius=0;this.startRadius="500%";this.pullOutRadius="20%";this.labelRadius=20;this.labelText="[[title]]: [[percents]]%";this.balloonText="[[title]]: [[percents]]% ([[value]])\n[[description]]";this.previousScale=1;AmCharts.applyTheme(this,
		e,this.cname)},drawChart:function(){AmCharts.AmPieChart.base.drawChart.call(this);var e=this.chartData;if(AmCharts.ifArray(e)){if(0<this.realWidth&&0<this.realHeight){AmCharts.VML&&(this.startAlpha=1);var f=this.startDuration,c=this.container,b=this.updateWidth();this.realWidth=b;var h=this.updateHeight();this.realHeight=h;var d=AmCharts.toCoordinate,k=d(this.marginLeft,b),a=d(this.marginRight,b),t=d(this.marginTop,h)+this.getTitleHeight(),m=d(this.marginBottom,h),w,x,g,v=AmCharts.toNumber(this.labelRadius),
		q=this.measureMaxLabel();q>this.maxLabelWidth&&(q=this.maxLabelWidth);this.labelText&&this.labelsEnabled||(v=q=0);w=void 0===this.pieX?(b-k-a)/2+k:d(this.pieX,this.realWidth);x=void 0===this.pieY?(h-t-m)/2+t:d(this.pieY,h);g=d(this.radius,b,h);g||(b=0<=v?b-k-a-2*q:b-k-a,h=h-t-m,g=Math.min(b,h),h<b&&(g/=1-this.angle/90,g>b&&(g=b)),h=AmCharts.toCoordinate(this.pullOutRadius,g),g=(0<=v?g-1.8*(v+h):g-1.8*h)/2);g<this.minRadius&&(g=this.minRadius);h=d(this.pullOutRadius,g);t=AmCharts.toCoordinate(this.startRadius,
		g);d=d(this.innerRadius,g);d>=g&&(d=g-1);m=AmCharts.fitToBounds(this.startAngle,0,360);0<this.depth3D&&(m=270<=m?270:90);m-=90;b=g-g*this.angle/90;for(k=0;k<e.length;k++)if(a=e[k],!0!==a.hidden&&0<a.percents){var n=360*a.percents/100,q=Math.sin((m+n/2)/180*Math.PI),y=-Math.cos((m+n/2)/180*Math.PI)*(b/g),p=this.outlineColor;p||(p=a.color);var z=this.alpha;isNaN(a.alpha)||(z=a.alpha);p={fill:a.color,stroke:p,"stroke-width":this.outlineThickness,"stroke-opacity":this.outlineAlpha,"fill-opacity":z};a.url&&
	(p.cursor="pointer");p=AmCharts.wedge(c,w,x,m,n,g,b,d,this.depth3D,p,this.gradientRatio,a.pattern);this.addEventListeners(p,a);a.startAngle=m;e[k].wedge=p;0<f&&(this.chartCreated||p.setAttr("opacity",this.startAlpha));a.ix=q;a.iy=y;a.wedge=p;a.index=k;if(this.labelsEnabled&&this.labelText&&a.percents>=this.hideLabelsPercent){var l=m+n/2;360<l&&(l-=360);var r=v;isNaN(a.labelRadius)||(r=a.labelRadius);var n=w+q*(g+r),z=x+y*(g+r),A,u=0;if(0<=r){var B;90>=l&&0<=l?(B=0,A="start",u=8):90<=l&&180>l?(B=1,
		A="start",u=8):180<=l&&270>l?(B=2,A="end",u=-8):270<=l&&360>l&&(B=3,A="end",u=-8);a.labelQuarter=B}else A="middle";var l=this.formatString(this.labelText,a),s=this.labelFunction;s&&(l=s(a,l));s=a.labelColor;s||(s=this.color);l=AmCharts.wrappedText(c,l,s,this.fontFamily,this.fontSize,A,!1,this.maxLabelWidth);l.translate(n+1.5*u,z);l.node.style.pointerEvents="none";a.tx=n+1.5*u;a.ty=z;0<=r?(r=l.getBBox(),s=AmCharts.rect(c,r.width+5,r.height+5,"#FFFFFF",.005),s.translate(n+1.5*u+r.x,z+r.y),a.hitRect=
		s,p.push(l),p.push(s)):this.freeLabelsSet.push(l);a.label=l;a.tx=n;a.tx2=n+u;a.tx0=w+q*g;a.ty0=x+y*g}n=d+(g-d)/2;a.pulled&&(n+=this.pullOutRadiusReal);a.balloonX=q*n+w;a.balloonY=y*n+x;a.startX=Math.round(q*t);a.startY=Math.round(y*t);a.pullX=Math.round(q*h);a.pullY=Math.round(y*h);this.graphsSet.push(p);(0===a.alpha||0<f&&!this.chartCreated)&&p.hide();m+=360*a.percents/100}0<v&&!this.labelRadiusField&&this.arrangeLabels();this.pieXReal=w;this.pieYReal=x;this.radiusReal=g;this.innerRadiusReal=d;0<
	v&&this.drawTicks();this.initialStart();this.setDepths()}(e=this.legend)&&e.invalidateSize()}else this.cleanChart();this.dispDUpd();this.chartCreated=!0},setDepths:function(){var e=this.chartData,f;for(f=0;f<e.length;f++){var c=e[f],b=c.wedge,c=c.startAngle;0<=c&&180>c?b.toFront():180<=c&&b.toBack()}},arrangeLabels:function(){var e=this.chartData,f=e.length,c,b;for(b=f-1;0<=b;b--)c=e[b],0!==c.labelQuarter||c.hidden||this.checkOverlapping(b,c,0,!0,0);for(b=0;b<f;b++)c=e[b],1!=c.labelQuarter||c.hidden||
	this.checkOverlapping(b,c,1,!1,0);for(b=f-1;0<=b;b--)c=e[b],2!=c.labelQuarter||c.hidden||this.checkOverlapping(b,c,2,!0,0);for(b=0;b<f;b++)c=e[b],3!=c.labelQuarter||c.hidden||this.checkOverlapping(b,c,3,!1,0)},checkOverlapping:function(e,f,c,b,h){var d,k,a=this.chartData,t=a.length,m=f.label;if(m){if(!0===b)for(k=e+1;k<t;k++)a[k].labelQuarter==c&&(d=this.checkOverlappingReal(f,a[k],c))&&(k=t);else for(k=e-1;0<=k;k--)a[k].labelQuarter==c&&(d=this.checkOverlappingReal(f,a[k],c))&&(k=0);!0===d&&100>
	h&&(d=f.ty+3*f.iy,f.ty=d,m.translate(f.tx2,d),f.hitRect&&(m=m.getBBox(),f.hitRect.translate(f.tx2+m.x,d+m.y)),this.checkOverlapping(e,f,c,b,h+1))}},checkOverlappingReal:function(e,f,c){var b=!1,h=e.label,d=f.label;e.labelQuarter!=c||e.hidden||f.hidden||!d||(h=h.getBBox(),c={},c.width=h.width,c.height=h.height,c.y=e.ty,c.x=e.tx,e=d.getBBox(),d={},d.width=e.width,d.height=e.height,d.y=f.ty,d.x=f.tx,AmCharts.hitTest(c,d)&&(b=!0));return b}});


/***/ },

/***/ 467:
/***/ function(module, exports, __webpack_require__) {

	var AmCharts=__webpack_require__(464);AmCharts.AmSerialChart=AmCharts.Class({inherits:AmCharts.AmRectangularChart,construct:function(a){this.type="serial";AmCharts.AmSerialChart.base.construct.call(this,a);this.cname="AmSerialChart";this.theme=a;this.createEvents("changed");this.columnSpacing=5;this.columnSpacing3D=0;this.columnWidth=.8;this.updateScrollbar=!0;var b=new AmCharts.CategoryAxis(a);b.chart=this;this.categoryAxis=b;this.zoomOutOnDataUpdate=!0;this.mouseWheelZoomEnabled=this.mouseWheelScrollEnabled=this.rotate=this.skipZoom=
		!1;this.minSelectedTime=0;AmCharts.applyTheme(this,a,this.cname)},initChart:function(){AmCharts.AmSerialChart.base.initChart.call(this);this.updateCategoryAxis(this.categoryAxis,this.rotate,"categoryAxis");this.dataChanged&&(this.updateData(),this.dataChanged=!1,this.dispatchDataUpdated=!0);var a=this.chartCursor;a&&(a.updateData(),a.fullWidth&&(a.fullRectSet=this.cursorLineSet));var a=this.countColumns(),b=this.graphs,c;for(c=0;c<b.length;c++)b[c].columnCount=a;this.updateScrollbar=!0;this.drawChart();
		this.autoMargins&&!this.marginsUpdated&&(this.marginsUpdated=!0,this.measureMargins());(this.mouseWheelScrollEnabled||this.mouseWheelZoomEnabled)&&this.addMouseWheel()},handleWheelReal:function(a,b){if(!this.wheelBusy){var c=this.categoryAxis,d=c.parseDates,e=c.minDuration(),f=c=1;this.mouseWheelZoomEnabled?b||(c=-1):b&&(c=-1);var l=this.chartData.length,h=this.lastTime,g=this.firstTime;0>a?d?(l=this.endTime-this.startTime,d=this.startTime+c*e,e=this.endTime+f*e,0<f&&0<c&&e>=h&&(e=h,d=h-l),this.zoomToDates(new Date(d),
		new Date(e))):(0<f&&0<c&&this.end>=l-1&&(c=f=0),d=this.start+c,e=this.end+f,this.zoomToIndexes(d,e)):d?(l=this.endTime-this.startTime,d=this.startTime-c*e,e=this.endTime-f*e,0<f&&0<c&&d<=g&&(d=g,e=g+l),this.zoomToDates(new Date(d),new Date(e))):(0<f&&0<c&&1>this.start&&(c=f=0),d=this.start-c,e=this.end-f,this.zoomToIndexes(d,e))}},validateData:function(a){this.marginsUpdated=!1;this.zoomOutOnDataUpdate&&!a&&(this.endTime=this.end=this.startTime=this.start=NaN);AmCharts.AmSerialChart.base.validateData.call(this)},
		drawChart:function(){AmCharts.AmSerialChart.base.drawChart.call(this);var a=this.chartData;if(AmCharts.ifArray(a)){var b=this.chartScrollbar;b&&b.draw();if(0<this.realWidth&&0<this.realHeight){var a=a.length-1,c,b=this.categoryAxis;if(b.parseDates&&!b.equalSpacing){if(b=this.startTime,c=this.endTime,isNaN(b)||isNaN(c))b=this.firstTime,c=this.lastTime}else if(b=this.start,c=this.end,isNaN(b)||isNaN(c))b=0,c=a;this.endTime=this.startTime=this.end=this.start=void 0;this.zoom(b,c)}}else this.cleanChart();
			this.dispDUpd();this.chartCreated=!0},cleanChart:function(){AmCharts.callMethod("destroy",[this.valueAxes,this.graphs,this.categoryAxis,this.chartScrollbar,this.chartCursor])},updateCategoryAxis:function(a,b,c){a.chart=this;a.id=c;a.rotate=b;a.axisRenderer=AmCharts.RecAxis;a.guideFillRenderer=AmCharts.RecFill;a.axisItemRenderer=AmCharts.RecItem;a.setOrientation(!this.rotate);a.x=this.marginLeftReal;a.y=this.marginTopReal;a.dx=this.dx;a.dy=this.dy;a.width=this.plotAreaWidth-1;a.height=this.plotAreaHeight-
			1;a.viW=this.plotAreaWidth-1;a.viH=this.plotAreaHeight-1;a.viX=this.marginLeftReal;a.viY=this.marginTopReal;a.marginsChanged=!0},updateValueAxes:function(){AmCharts.AmSerialChart.base.updateValueAxes.call(this);var a=this.valueAxes,b;for(b=0;b<a.length;b++){var c=a[b],d=this.rotate;c.rotate=d;c.setOrientation(d);d=this.categoryAxis;if(!d.startOnAxis||d.parseDates)c.expandMinMax=!0}},updateData:function(){this.parseData();var a=this.graphs,b,c=this.chartData;for(b=0;b<a.length;b++)a[b].data=c;0<c.length&&
		(this.firstTime=this.getStartTime(c[0].time),this.lastTime=this.getEndTime(c[c.length-1].time))},getStartTime:function(a){var b=this.categoryAxis;return AmCharts.resetDateToMin(new Date(a),b.minPeriod,1,b.firstDayOfWeek).getTime()},getEndTime:function(a){var b=AmCharts.extractPeriod(this.categoryAxis.minPeriod);return AmCharts.changeDate(new Date(a),b.period,b.count,!0).getTime()-1},updateMargins:function(){AmCharts.AmSerialChart.base.updateMargins.call(this);var a=this.chartScrollbar;a&&(this.getScrollbarPosition(a,
			this.rotate,this.categoryAxis.position),this.adjustMargins(a,this.rotate))},updateScrollbars:function(){AmCharts.AmSerialChart.base.updateScrollbars.call(this);this.updateChartScrollbar(this.chartScrollbar,this.rotate)},zoom:function(a,b){var c=this.categoryAxis;c.parseDates&&!c.equalSpacing?this.timeZoom(a,b):this.indexZoom(a,b);this.updateLegendValues()},timeZoom:function(a,b){var c=this.maxSelectedTime;isNaN(c)||(b!=this.endTime&&b-a>c&&(a=b-c,this.updateScrollbar=!0),a!=this.startTime&&b-a>c&&
		(b=a+c,this.updateScrollbar=!0));var d=this.minSelectedTime;if(0<d&&b-a<d){var e=Math.round(a+(b-a)/2),d=Math.round(d/2);a=e-d;b=e+d}var f=this.chartData,e=this.categoryAxis;if(AmCharts.ifArray(f)&&(a!=this.startTime||b!=this.endTime)){var l=e.minDuration(),d=this.firstTime,h=this.lastTime;a||(a=d,isNaN(c)||(a=h-c));b||(b=h);a>h&&(a=h);b<d&&(b=d);a<d&&(a=d);b>h&&(b=h);b<a&&(b=a+l);b-a<l/5&&(b<h?b=a+l/5:a=b-l/5);this.startTime=a;this.endTime=b;c=f.length-1;l=this.getClosestIndex(f,"time",a,!0,0,c);
			f=this.getClosestIndex(f,"time",b,!1,l,c);e.timeZoom(a,b);e.zoom(l,f);this.start=AmCharts.fitToBounds(l,0,c);this.end=AmCharts.fitToBounds(f,0,c);this.zoomAxesAndGraphs();this.zoomScrollbar();a!=d||b!=h?this.showZB(!0):this.showZB(!1);this.updateColumnsDepth();this.dispatchTimeZoomEvent()}},indexZoom:function(a,b){var c=this.maxSelectedSeries;isNaN(c)||(b!=this.end&&b-a>c&&(a=b-c,this.updateScrollbar=!0),a!=this.start&&b-a>c&&(b=a+c,this.updateScrollbar=!0));if(a!=this.start||b!=this.end){var d=this.chartData.length-
			1;isNaN(a)&&(a=0,isNaN(c)||(a=d-c));isNaN(b)&&(b=d);b<a&&(b=a);b>d&&(b=d);a>d&&(a=d-1);0>a&&(a=0);this.start=a;this.end=b;this.categoryAxis.zoom(a,b);this.zoomAxesAndGraphs();this.zoomScrollbar();0!==a||b!=this.chartData.length-1?this.showZB(!0):this.showZB(!1);this.updateColumnsDepth();this.dispatchIndexZoomEvent()}},updateGraphs:function(){AmCharts.AmSerialChart.base.updateGraphs.call(this);var a=this.graphs,b;for(b=0;b<a.length;b++){var c=a[b];c.columnWidthReal=this.columnWidth;c.categoryAxis=
			this.categoryAxis;AmCharts.isString(c.fillToGraph)&&(c.fillToGraph=this.getGraphById(c.fillToGraph))}},updateColumnsDepth:function(){var a,b=this.graphs,c;AmCharts.remove(this.columnsSet);this.columnsArray=[];for(a=0;a<b.length;a++){c=b[a];var d=c.columnsArray;if(d){var e;for(e=0;e<d.length;e++)this.columnsArray.push(d[e])}}this.columnsArray.sort(this.compareDepth);if(0<this.columnsArray.length){b=this.container.set();this.columnSet.push(b);for(a=0;a<this.columnsArray.length;a++)b.push(this.columnsArray[a].column.set);
			c&&b.translate(c.x,c.y);this.columnsSet=b}},compareDepth:function(a,b){return a.depth>b.depth?1:-1},zoomScrollbar:function(){var a=this.chartScrollbar,b=this.categoryAxis;a&&this.updateScrollbar&&(b.parseDates&&!b.equalSpacing?a.timeZoom(this.startTime,this.endTime):a.zoom(this.start,this.end),this.updateScrollbar=!0)},updateTrendLines:function(){var a=this.trendLines,b;for(b=0;b<a.length;b++){var c=a[b],c=AmCharts.processObject(c,AmCharts.TrendLine,this.theme);a[b]=c;c.chart=this;AmCharts.isString(c.valueAxis)&&
		(c.valueAxis=this.getValueAxisById(c.valueAxis));c.valueAxis||(c.valueAxis=this.valueAxes[0]);c.categoryAxis=this.categoryAxis}},zoomAxesAndGraphs:function(){if(!this.scrollbarOnly){var a=this.valueAxes,b;for(b=0;b<a.length;b++)a[b].zoom(this.start,this.end);a=this.graphs;for(b=0;b<a.length;b++)a[b].zoom(this.start,this.end);this.zoomTrendLines();(b=this.chartCursor)&&b.zoom(this.start,this.end,this.startTime,this.endTime)}},countColumns:function(){var a=0,b=this.valueAxes.length,c=this.graphs.length,
			d,e,f=!1,l,h;for(h=0;h<b;h++){e=this.valueAxes[h];var g=e.stackType;if("100%"==g||"regular"==g)for(f=!1,l=0;l<c;l++)d=this.graphs[l],d.tcc=1,d.valueAxis==e&&"column"==d.type&&(!f&&d.stackable&&(a++,f=!0),(!d.stackable&&d.clustered||d.newStack)&&a++,d.columnIndex=a-1,d.clustered||(d.columnIndex=0));if("none"==g||"3d"==g){f=!1;for(l=0;l<c;l++)d=this.graphs[l],d.valueAxis==e&&"column"==d.type&&(d.clustered?(d.tcc=1,d.newStack&&(a=0),d.hidden||(d.columnIndex=a,a++)):d.hidden||(f=!0,d.tcc=1,d.columnIndex=
			0));f&&0==a&&(a=1)}if("3d"==g){e=1;for(h=0;h<c;h++)d=this.graphs[h],d.newStack&&e++,d.depthCount=e,d.tcc=a;a=e}}return a},parseData:function(){AmCharts.AmSerialChart.base.parseData.call(this);this.parseSerialData()},getCategoryIndexByValue:function(a){var b=this.chartData,c,d;for(d=0;d<b.length;d++)b[d].category==a&&(c=d);return c},handleCursorChange:function(a){this.updateLegendValues(a.index)},handleCursorZoom:function(a){this.updateScrollbar=!0;this.zoom(a.start,a.end)},handleScrollbarZoom:function(a){this.updateScrollbar=
			!1;this.zoom(a.start,a.end)},dispatchTimeZoomEvent:function(){if(this.prevStartTime!=this.startTime||this.prevEndTime!=this.endTime){var a={type:"zoomed"};a.startDate=new Date(this.startTime);a.endDate=new Date(this.endTime);a.startIndex=this.start;a.endIndex=this.end;this.startIndex=this.start;this.endIndex=this.end;this.startDate=a.startDate;this.endDate=a.endDate;this.prevStartTime=this.startTime;this.prevEndTime=this.endTime;var b=this.categoryAxis,c=AmCharts.extractPeriod(b.minPeriod).period,
			b=b.dateFormatsObject[c];a.startValue=AmCharts.formatDate(a.startDate,b,this);a.endValue=AmCharts.formatDate(a.endDate,b,this);a.chart=this;a.target=this;this.fire(a.type,a)}},dispatchIndexZoomEvent:function(){if(this.prevStartIndex!=this.start||this.prevEndIndex!=this.end){this.startIndex=this.start;this.endIndex=this.end;var a=this.chartData;if(AmCharts.ifArray(a)&&!isNaN(this.start)&&!isNaN(this.end)){var b={chart:this,target:this,type:"zoomed"};b.startIndex=this.start;b.endIndex=this.end;b.startValue=
			a[this.start].category;b.endValue=a[this.end].category;this.categoryAxis.parseDates&&(this.startTime=a[this.start].time,this.endTime=a[this.end].time,b.startDate=new Date(this.startTime),b.endDate=new Date(this.endTime));this.prevStartIndex=this.start;this.prevEndIndex=this.end;this.fire(b.type,b)}}},updateLegendValues:function(a){var b=this.graphs,c;for(c=0;c<b.length;c++){var d=b[c];isNaN(a)?d.currentDataItem=void 0:d.currentDataItem=this.chartData[a].axes[d.valueAxis.id].graphs[d.id]}this.legend&&
		this.legend.updateValues()},getClosestIndex:function(a,b,c,d,e,f){0>e&&(e=0);f>a.length-1&&(f=a.length-1);var l=e+Math.round((f-e)/2),h=a[l][b];if(1>=f-e){if(d)return e;d=a[f][b];return Math.abs(a[e][b]-c)<Math.abs(d-c)?e:f}return c==h?l:c<h?this.getClosestIndex(a,b,c,d,e,l):this.getClosestIndex(a,b,c,d,l,f)},zoomToIndexes:function(a,b){this.updateScrollbar=!0;var c=this.chartData;if(c){var d=c.length;0<d&&(0>a&&(a=0),b>d-1&&(b=d-1),d=this.categoryAxis,d.parseDates&&!d.equalSpacing?this.zoom(c[a].time,
			this.getEndTime(c[b].time)):this.zoom(a,b))}},zoomToDates:function(a,b){this.updateScrollbar=!0;var c=this.chartData;if(this.categoryAxis.equalSpacing){var d=this.getClosestIndex(c,"time",a.getTime(),!0,0,c.length);b=AmCharts.resetDateToMin(b,this.categoryAxis.minPeriod,1);c=this.getClosestIndex(c,"time",b.getTime(),!1,0,c.length);this.zoom(d,c)}else this.zoom(a.getTime(),b.getTime())},zoomToCategoryValues:function(a,b){this.updateScrollbar=!0;this.zoom(this.getCategoryIndexByValue(a),this.getCategoryIndexByValue(b))},
		formatPeriodString:function(a,b){if(b){var c=["value","open","low","high","close"],d="value open low high close average sum count".split(" "),e=b.valueAxis,f=this.chartData,l=b.numberFormatter;l||(l=this.nf);for(var h=0;h<c.length;h++){for(var g=c[h],k=0,m=0,p,v,r,s,n,w=0,q=0,x,t,z,y,B,D=this.start;D<=this.end;D++){var u=f[D];if(u&&(u=u.axes[e.id].graphs[b.id])){if(u.values){var A=u.values[g];if(!isNaN(A)){isNaN(p)&&(p=A);v=A;if(isNaN(r)||r>A)r=A;if(isNaN(s)||s<A)s=A;n=AmCharts.getDecimals(k);var H=
			AmCharts.getDecimals(A),k=k+A,k=AmCharts.roundTo(k,Math.max(n,H));m++;n=k/m}}if(u.percents&&(u=u.percents[g],!isNaN(u))){isNaN(x)&&(x=u);t=u;if(isNaN(z)||z>u)z=u;if(isNaN(y)||y<u)y=u;B=AmCharts.getDecimals(w);A=AmCharts.getDecimals(u);w+=u;w=AmCharts.roundTo(w,Math.max(B,A));q++;B=w/q}}}w={open:x,close:t,high:y,low:z,average:B,sum:w,count:q};a=AmCharts.formatValue(a,{open:p,close:v,high:s,low:r,average:n,sum:k,count:m},d,l,g+"\\.",this.usePrefixes,this.prefixesOfSmallNumbers,this.prefixesOfBigNumbers);
			a=AmCharts.formatValue(a,w,d,this.pf,"percents\\."+g+"\\.")}}return a=AmCharts.cleanFromEmpty(a)},formatString:function(a,b,c){var d=b.graph;if(-1!=a.indexOf("[[category]]")){var e=b.serialDataItem.category;if(this.categoryAxis.parseDates){var f=this.balloonDateFormat,l=this.chartCursor;l&&(f=l.categoryBalloonDateFormat);-1!=a.indexOf("[[category]]")&&(f=AmCharts.formatDate(e,f,this),-1!=f.indexOf("fff")&&(f=AmCharts.formatMilliseconds(f,e)),e=f)}a=a.replace(/\[\[category\]\]/g,String(e))}d=d.numberFormatter;
			d||(d=this.nf);e=b.graph.valueAxis;(f=e.duration)&&!isNaN(b.values.value)&&(e=AmCharts.formatDuration(b.values.value,f,"",e.durationUnits,e.maxInterval,d),a=a.replace(RegExp("\\[\\[value\\]\\]","g"),e));e="value open low high close total".split(" ");f=this.pf;a=AmCharts.formatValue(a,b.percents,e,f,"percents\\.");a=AmCharts.formatValue(a,b.values,e,d,"",this.usePrefixes,this.prefixesOfSmallNumbers,this.prefixesOfBigNumbers);a=AmCharts.formatValue(a,b.values,["percents"],f);-1!=a.indexOf("[[")&&(a=
				AmCharts.formatDataContextValue(a,b.dataContext));return a=AmCharts.AmSerialChart.base.formatString.call(this,a,b,c)},addChartScrollbar:function(a){AmCharts.callMethod("destroy",[this.chartScrollbar]);a&&(a.chart=this,this.listenTo(a,"zoomed",this.handleScrollbarZoom));this.rotate?void 0===a.width&&(a.width=a.scrollbarHeight):void 0===a.height&&(a.height=a.scrollbarHeight);this.chartScrollbar=a},removeChartScrollbar:function(){AmCharts.callMethod("destroy",[this.chartScrollbar]);this.chartScrollbar=
			null},handleReleaseOutside:function(a){AmCharts.AmSerialChart.base.handleReleaseOutside.call(this,a);AmCharts.callMethod("handleReleaseOutside",[this.chartScrollbar])}});AmCharts.Cuboid=AmCharts.Class({construct:function(a,b,c,d,e,f,l,h,g,k,m,p,v,r,s,n){this.set=a.set();this.container=a;this.h=Math.round(c);this.w=Math.round(b);this.dx=d;this.dy=e;this.colors=f;this.alpha=l;this.bwidth=h;this.bcolor=g;this.balpha=k;this.dashLength=r;this.topRadius=n;this.pattern=s;(this.rotate=v)?0>b&&0===m&&(m=180):0>c&&270==m&&(m=90);this.gradientRotation=m;0===d&&0===e&&(this.cornerRadius=p);this.draw()},draw:function(){var a=this.set;a.clear();var b=this.container,c=this.w,d=
		this.h,e=this.dx,f=this.dy,l=this.colors,h=this.alpha,g=this.bwidth,k=this.bcolor,m=this.balpha,p=this.gradientRotation,v=this.cornerRadius,r=this.dashLength,s=this.pattern,n=this.topRadius,w=l,q=l;"object"==typeof l&&(w=l[0],q=l[l.length-1]);var x,t,z,y,B,D,u,A,H,M=h;s&&(h=0);var C,E,F,G,I=this.rotate;if(0<Math.abs(e)||0<Math.abs(f))if(isNaN(n))u=q,q=AmCharts.adjustLuminosity(w,-.2),q=AmCharts.adjustLuminosity(w,-.2),x=AmCharts.polygon(b,[0,e,c+e,c,0],[0,f,f,0,0],q,h,1,k,0,p),0<m&&(H=AmCharts.line(b,
		[0,e,c+e],[0,f,f],k,m,g,r)),t=AmCharts.polygon(b,[0,0,c,c,0],[0,d,d,0,0],q,h,1,k,0,p),t.translate(e,f),0<m&&(z=AmCharts.line(b,[e,e],[f,f+d],k,m,g,r)),y=AmCharts.polygon(b,[0,0,e,e,0],[0,d,d+f,f,0],q,h,1,k,0,p),B=AmCharts.polygon(b,[c,c,c+e,c+e,c],[0,d,d+f,f,0],q,h,1,k,0,p),0<m&&(D=AmCharts.line(b,[c,c+e,c+e,c],[0,f,d+f,d],k,m,g,r)),q=AmCharts.adjustLuminosity(u,.2),u=AmCharts.polygon(b,[0,e,c+e,c,0],[d,d+f,d+f,d,d],q,h,1,k,0,p),0<m&&(A=AmCharts.line(b,[0,e,c+e],[d,d+f,d+f],k,m,g,r));else{var J,K,
		L;I?(J=d/2,q=e/2,L=d/2,K=c+e/2,E=Math.abs(d/2),C=Math.abs(e/2)):(q=c/2,J=f/2,K=c/2,L=d+f/2+1,C=Math.abs(c/2),E=Math.abs(f/2));F=C*n;G=E*n;.1<C&&.1<C&&(x=AmCharts.circle(b,C,w,h,g,k,m,!1,E),x.translate(q,J));.1<F&&.1<F&&(u=AmCharts.circle(b,F,AmCharts.adjustLuminosity(w,.5),h,g,k,m,!1,G),u.translate(K,L))}h=M;1>Math.abs(d)&&(d=0);1>Math.abs(c)&&(c=0);!isNaN(n)&&(0<Math.abs(e)||0<Math.abs(f))?(l=[w],l={fill:l,stroke:k,"stroke-width":g,"stroke-opacity":m,"fill-opacity":h},I?(h="M0,0 L"+c+","+(d/2-d/
		2*n),g=" B",0<c&&(g=" A"),AmCharts.VML?(h+=g+Math.round(c-F)+","+Math.round(d/2-G)+","+Math.round(c+F)+","+Math.round(d/2+G)+","+c+",0,"+c+","+d,h=h+(" L0,"+d)+(g+Math.round(-C)+","+Math.round(d/2-E)+","+Math.round(C)+","+Math.round(d/2+E)+",0,"+d+",0,0")):(h+="A"+F+","+G+",0,0,0,"+c+","+(d-d/2*(1-n))+"L0,"+d,h+="A"+C+","+E+",0,0,1,0,0"),C=90):(g=c/2-c/2*n,h="M0,0 L"+g+","+d,AmCharts.VML?(h="M0,0 L"+g+","+d,g=" B",0>d&&(g=" A"),h+=g+Math.round(c/2-F)+","+Math.round(d-G)+","+Math.round(c/2+F)+","+
		Math.round(d+G)+",0,"+d+","+c+","+d,h+=" L"+c+",0",h+=g+Math.round(c/2+C)+","+Math.round(E)+","+Math.round(c/2-C)+","+Math.round(-E)+","+c+",0,0,0"):(h+="A"+F+","+G+",0,0,0,"+(c-c/2*(1-n))+","+d+"L"+c+",0",h+="A"+C+","+E+",0,0,1,0,0"),C=180),b=b.path(h).attr(l),b.gradient("linearGradient",[w,AmCharts.adjustLuminosity(w,-.3),AmCharts.adjustLuminosity(w,-.3),w],C),I?b.translate(e/2,0):b.translate(0,f/2)):b=0===d?AmCharts.line(b,[0,c],[0,0],k,m,g,r):0===c?AmCharts.line(b,[0,0],[0,d],k,m,g,r):0<v?AmCharts.rect(b,
		c,d,l,h,g,k,m,v,p,r):AmCharts.polygon(b,[0,0,c,c,0],[0,d,d,0,0],l,h,g,k,m,p,!1,r);c=isNaN(n)?0>d?[x,H,t,z,y,B,D,u,A,b]:[u,A,t,z,y,B,x,H,D,b]:I?0<c?[x,b,u]:[u,b,x]:0>d?[x,b,u]:[u,b,x];for(d=0;d<c.length;d++)(e=c[d])&&a.push(e);s&&b.pattern(s)},width:function(a){this.w=Math.round(a);this.draw()},height:function(a){this.h=Math.round(a);this.draw()},animateHeight:function(a,b){var c=this;c.easing=b;c.totalFrames=Math.round(1E3*a/AmCharts.updateRate);c.rh=c.h;c.frame=0;c.height(1);setTimeout(function(){c.updateHeight.call(c)},
		AmCharts.updateRate)},updateHeight:function(){var a=this;a.frame++;var b=a.totalFrames;a.frame<=b&&(b=a.easing(0,a.frame,1,a.rh-1,b),a.height(b),setTimeout(function(){a.updateHeight.call(a)},AmCharts.updateRate))},animateWidth:function(a,b){var c=this;c.easing=b;c.totalFrames=Math.round(1E3*a/AmCharts.updateRate);c.rw=c.w;c.frame=0;c.width(1);setTimeout(function(){c.updateWidth.call(c)},AmCharts.updateRate)},updateWidth:function(){var a=this;a.frame++;var b=a.totalFrames;a.frame<=b&&(b=a.easing(0,
		a.frame,1,a.rw-1,b),a.width(b),setTimeout(function(){a.updateWidth.call(a)},AmCharts.updateRate))}});AmCharts.CategoryAxis=AmCharts.Class({inherits:AmCharts.AxisBase,construct:function(a){this.cname="CategoryAxis";AmCharts.CategoryAxis.base.construct.call(this,a);this.minPeriod="DD";this.equalSpacing=this.parseDates=!1;this.position="bottom";this.startOnAxis=!1;this.firstDayOfWeek=1;this.gridPosition="middle";this.markPeriodChange=this.boldPeriodBeginning=!0;this.safeDistance=30;this.centerLabelOnFullPeriod=!0;this.periods=[{period:"ss",count:1},{period:"ss",count:5},{period:"ss",count:10},{period:"ss",
		count:30},{period:"mm",count:1},{period:"mm",count:5},{period:"mm",count:10},{period:"mm",count:30},{period:"hh",count:1},{period:"hh",count:3},{period:"hh",count:6},{period:"hh",count:12},{period:"DD",count:1},{period:"DD",count:2},{period:"DD",count:3},{period:"DD",count:4},{period:"DD",count:5},{period:"WW",count:1},{period:"MM",count:1},{period:"MM",count:2},{period:"MM",count:3},{period:"MM",count:6},{period:"YYYY",count:1},{period:"YYYY",count:2},{period:"YYYY",count:5},{period:"YYYY",count:10},
		{period:"YYYY",count:50},{period:"YYYY",count:100}];this.dateFormats=[{period:"fff",format:"JJ:NN:SS"},{period:"ss",format:"JJ:NN:SS"},{period:"mm",format:"JJ:NN"},{period:"hh",format:"JJ:NN"},{period:"DD",format:"MMM DD"},{period:"WW",format:"MMM DD"},{period:"MM",format:"MMM"},{period:"YYYY",format:"YYYY"}];this.nextPeriod={};this.nextPeriod.fff="ss";this.nextPeriod.ss="mm";this.nextPeriod.mm="hh";this.nextPeriod.hh="DD";this.nextPeriod.DD="MM";this.nextPeriod.MM="YYYY";AmCharts.applyTheme(this,
		a,this.cname)},draw:function(){AmCharts.CategoryAxis.base.draw.call(this);this.generateDFObject();var a=this.chart.chartData;this.data=a;if(AmCharts.ifArray(a)){var b,c=this.chart,d=this.start,e=this.labelFrequency,f=0;b=this.end-d+1;var l=this.gridCountR,h=this.showFirstLabel,g=this.showLastLabel,k,m="",p=AmCharts.extractPeriod(this.minPeriod);k=AmCharts.getPeriodDuration(p.period,p.count);var v,r,s,n,w,q;v=this.rotate;var x=this.firstDayOfWeek,t=this.boldPeriodBeginning,a=AmCharts.resetDateToMin(new Date(a[a.length-
		1].time+1.05*k),this.minPeriod,1,x).getTime(),z;this.endTime>a&&(this.endTime=a);q=this.minorGridEnabled;var y,a=this.gridAlpha,B;if(this.parseDates&&!this.equalSpacing){this.timeDifference=this.endTime-this.startTime;d=this.choosePeriod(0);e=d.period;v=d.count;r=AmCharts.getPeriodDuration(e,v);r<k&&(e=p.period,v=p.count,r=k);s=e;"WW"==s&&(s="DD");this.stepWidth=this.getStepWidth(this.timeDifference);var l=Math.ceil(this.timeDifference/r)+5,D=m=AmCharts.resetDateToMin(new Date(this.startTime-r),e,
		v,x).getTime();s==e&&1==v&&this.centerLabelOnFullPeriod&&(w=r*this.stepWidth);this.cellWidth=k*this.stepWidth;b=Math.round(m/r);d=-1;b/2==Math.round(b/2)&&(d=-2,m-=r);var u=c.firstTime,A=0;q&&1<v&&(y=this.chooseMinorFrequency(v),B=AmCharts.getPeriodDuration(e,y));if(0<this.gridCountR)for(b=d;b<=l;b++){p=u+r*(b+Math.floor((D-u)/r))-A;"DD"==e&&(p+=36E5);p=AmCharts.resetDateToMin(new Date(p),e,v,x).getTime();"MM"==e&&(q=(p-m)/r,1.5<=(p-m)/r&&(p=p-(q-1)*r+AmCharts.getPeriodDuration("DD",3),p=AmCharts.resetDateToMin(new Date(p),
		e,1).getTime(),A+=r));k=(p-this.startTime)*this.stepWidth;q=!1;this.nextPeriod[s]&&(q=this.checkPeriodChange(this.nextPeriod[s],1,p,m,s));z=!1;q&&this.markPeriodChange?(q=this.dateFormatsObject[this.nextPeriod[s]],this.twoLineMode&&(q=this.dateFormatsObject[s]+"\n"+q,q=AmCharts.fixBrakes(q)),z=!0):q=this.dateFormatsObject[s];t||(z=!1);m=AmCharts.formatDate(new Date(p),q,c);if(b==d&&!h||b==l&&!g)m=" ";this.labelFunction&&(m=this.labelFunction(m,new Date(p),this,e,v,n).toString());this.boldLabels&&
	(z=!0);n=new this.axisItemRenderer(this,k,m,!1,w,0,!1,z);this.pushAxisItem(n);n=m=p;if(!isNaN(y))for(k=1;k<v;k+=y)this.gridAlpha=this.minorGridAlpha,q=p+B*k,q=AmCharts.resetDateToMin(new Date(q),e,y,x).getTime(),q=new this.axisItemRenderer(this,(q-this.startTime)*this.stepWidth),this.pushAxisItem(q);this.gridAlpha=a}}else if(!this.parseDates){if(this.cellWidth=this.getStepWidth(b),b<l&&(l=b),f+=this.start,this.stepWidth=this.getStepWidth(b),0<l)for(t=Math.floor(b/l),y=this.chooseMinorFrequency(t),
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                     k=f,k/2==Math.round(k/2)&&k--,0>k&&(k=0),l=0,this.end-k+1>=this.autoRotateCount&&(this.labelRotation=this.autoRotateAngle),b=k;b<=this.end+2;b++){n=!1;0<=b&&b<this.data.length?(s=this.data[b],m=s.category,n=s.forceShow):m="";if(q&&!isNaN(y))if(b/y==Math.round(b/y)||n)b/t==Math.round(b/t)||n||(this.gridAlpha=this.minorGridAlpha,m=void 0);else continue;else if(b/t!=Math.round(b/t)&&!n)continue;k=this.getCoordinate(b-f);n=0;"start"==this.gridPosition&&(k-=this.cellWidth/2,n=this.cellWidth/2);x=!0;tickShift=
		n;"start"==this.tickPosition&&(tickShift=0,x=!1,n=0);if(b==d&&!h||b==this.end&&!g)m=void 0;Math.round(l/e)!=l/e&&(m=void 0);l++;D=this.cellWidth;v&&(D=NaN);this.labelFunction&&s&&(m=this.labelFunction(m,s,this));m=AmCharts.fixBrakes(m);z=!1;this.boldLabels&&(z=!0);b>this.end&&"start"==this.tickPosition&&(m=" ");n=new this.axisItemRenderer(this,k,m,x,D,n,void 0,z,tickShift,!1,s.labelColor);n.serialDataItem=s;this.pushAxisItem(n);this.gridAlpha=a}}else if(this.parseDates&&this.equalSpacing){f=this.start;
		this.startTime=this.data[this.start].time;this.endTime=this.data[this.end].time;this.timeDifference=this.endTime-this.startTime;d=this.choosePeriod(0);e=d.period;v=d.count;r=AmCharts.getPeriodDuration(e,v);r<k&&(e=p.period,v=p.count,r=k);s=e;"WW"==s&&(s="DD");this.stepWidth=this.getStepWidth(b);l=Math.ceil(this.timeDifference/r)+1;m=AmCharts.resetDateToMin(new Date(this.startTime-r),e,v,x).getTime();this.cellWidth=this.getStepWidth(b);b=Math.round(m/r);d=-1;b/2==Math.round(b/2)&&(d=-2,m-=r);k=this.start;
		k/2==Math.round(k/2)&&k--;0>k&&(k=0);w=this.end+2;w>=this.data.length&&(w=this.data.length);B=!1;B=!h;this.previousPos=-1E3;20<this.labelRotation&&(this.safeDistance=5);r=k;if(this.data[k].time!=AmCharts.resetDateToMin(new Date(this.data[k].time),e,v,x).getTime())for(x=0,z=m,b=k;b<w;b++)p=this.data[b].time,this.checkPeriodChange(e,v,p,z)&&(x++,2<=x&&(r=b,b=w),z=p);q&&1<v&&(y=this.chooseMinorFrequency(v),AmCharts.getPeriodDuration(e,y));if(0<this.gridCountR)for(b=k;b<w;b++)if(p=this.data[b].time,this.checkPeriodChange(e,
				v,p,m)&&b>=r){k=this.getCoordinate(b-this.start);q=!1;this.nextPeriod[s]&&(q=this.checkPeriodChange(this.nextPeriod[s],1,p,m,s));z=!1;q&&this.markPeriodChange?(q=this.dateFormatsObject[this.nextPeriod[s]],z=!0):q=this.dateFormatsObject[s];m=AmCharts.formatDate(new Date(p),q,c);if(b==d&&!h||b==l&&!g)m=" ";B?B=!1:(t||(z=!1),k-this.previousPos>this.safeDistance*Math.cos(this.labelRotation*Math.PI/180)&&(this.labelFunction&&(m=this.labelFunction(m,new Date(p),this,e,v,n)),this.boldLabels&&(z=!0),n=new this.axisItemRenderer(this,
			k,m,void 0,void 0,void 0,void 0,z),x=n.graphics(),this.pushAxisItem(n),n=x.getBBox().width,AmCharts.isModern||(n-=k),this.previousPos=k+n));n=m=p}else isNaN(y)||(this.checkPeriodChange(e,y,p,D)&&(this.gridAlpha=this.minorGridAlpha,k=this.getCoordinate(b-this.start),q=new this.axisItemRenderer(this,k),this.pushAxisItem(q),D=p),this.gridAlpha=a)}for(b=0;b<this.data.length;b++)if(h=this.data[b])g=this.parseDates&&!this.equalSpacing?Math.round((h.time-this.startTime)*this.stepWidth+this.cellWidth/2):
		this.getCoordinate(b-f),h.x[this.id]=g;h=this.guides.length;for(b=0;b<h;b++)g=this.guides[b],t=t=t=a=d=NaN,y=g.above,g.toCategory&&(t=c.getCategoryIndexByValue(g.toCategory),isNaN(t)||(d=this.getCoordinate(t-f),g.expand&&(d+=this.cellWidth/2),n=new this.axisItemRenderer(this,d,"",!0,NaN,NaN,g),this.pushAxisItem(n,y))),g.category&&(t=c.getCategoryIndexByValue(g.category),isNaN(t)||(a=this.getCoordinate(t-f),g.expand&&(a-=this.cellWidth/2),t=(d-a)/2,n=new this.axisItemRenderer(this,a,g.label,!0,NaN,
		t,g),this.pushAxisItem(n,y))),g.toDate&&(g.toDate instanceof Date||(g.toDate=AmCharts.stringToDate(g.toDate,c.dataDateFormat)),this.equalSpacing?(t=c.getClosestIndex(this.data,"time",g.toDate.getTime(),!1,0,this.data.length-1),isNaN(t)||(d=this.getCoordinate(t-f))):d=(g.toDate.getTime()-this.startTime)*this.stepWidth,n=new this.axisItemRenderer(this,d,"",!0,NaN,NaN,g),this.pushAxisItem(n,y)),g.date&&(g.date instanceof Date||(g.date=AmCharts.stringToDate(g.date,c.dataDateFormat)),this.equalSpacing?
		(t=c.getClosestIndex(this.data,"time",g.date.getTime(),!1,0,this.data.length-1),isNaN(t)||(a=this.getCoordinate(t-f))):a=(g.date.getTime()-this.startTime)*this.stepWidth,t=(d-a)/2,n="H"==this.orientation?new this.axisItemRenderer(this,a,g.label,!1,2*t,NaN,g):new this.axisItemRenderer(this,a,g.label,!1,NaN,t,g),this.pushAxisItem(n,y)),(0<d||0<a)&&(d<this.width||a<this.width)&&(d=new this.guideFillRenderer(this,a,d,g),a=d.graphics(),this.pushAxisItem(d,y),g.graphics=a,a.index=b,g.balloonText&&this.addEventListeners(a,
		g))}this.axisCreated=!0;c=this.x;f=this.y;this.set.translate(c,f);this.labelsSet.translate(c,f);this.positionTitle();(c=this.axisLine.set)&&c.toFront();c=this.getBBox().height;2<c-this.previousHeight&&this.autoWrap&&!this.parseDates&&(this.axisCreated=this.chart.marginsUpdated=!1);this.previousHeight=c},chooseMinorFrequency:function(a){for(var b=10;0<b;b--)if(a/b==Math.round(a/b))return a/b},choosePeriod:function(a){var b=AmCharts.getPeriodDuration(this.periods[a].period,this.periods[a].count),c=
		Math.ceil(this.timeDifference/b),d=this.periods;return this.timeDifference<b&&0<a?d[a-1]:c<=this.gridCountR?d[a]:a+1<d.length?this.choosePeriod(a+1):d[a]},getStepWidth:function(a){var b;this.startOnAxis?(b=this.axisWidth/(a-1),1==a&&(b=this.axisWidth)):b=this.axisWidth/a;return b},getCoordinate:function(a){a*=this.stepWidth;this.startOnAxis||(a+=this.stepWidth/2);return Math.round(a)},timeZoom:function(a,b){this.startTime=a;this.endTime=b},minDuration:function(){var a=AmCharts.extractPeriod(this.minPeriod);
		return AmCharts.getPeriodDuration(a.period,a.count)},checkPeriodChange:function(a,b,c,d,e){c=new Date(c);var f=new Date(d),l=this.firstDayOfWeek;d=b;"DD"==a&&(b=1);c=AmCharts.resetDateToMin(c,a,b,l).getTime();b=AmCharts.resetDateToMin(f,a,b,l).getTime();return"DD"==a&&"hh"!=e&&c-b<=AmCharts.getPeriodDuration(a,d)?!1:c!=b?!0:!1},generateDFObject:function(){this.dateFormatsObject={};var a;for(a=0;a<this.dateFormats.length;a++){var b=this.dateFormats[a];this.dateFormatsObject[b.period]=b.format}},xToIndex:function(a){var b=
		this.data,c=this.chart,d=c.rotate,e=this.stepWidth;this.parseDates&&!this.equalSpacing?(a=this.startTime+Math.round(a/e)-this.minDuration()/2,c=c.getClosestIndex(b,"time",a,!1,this.start,this.end+1)):(this.startOnAxis||(a-=e/2),c=this.start+Math.round(a/e));var c=AmCharts.fitToBounds(c,0,b.length-1),f;b[c]&&(f=b[c].x[this.id]);d?f>this.height+1&&c--:f>this.width+1&&c--;0>f&&c++;return c=AmCharts.fitToBounds(c,0,b.length-1)},dateToCoordinate:function(a){return this.parseDates&&!this.equalSpacing?(a.getTime()-
	this.startTime)*this.stepWidth:this.parseDates&&this.equalSpacing?(a=this.chart.getClosestIndex(this.data,"time",a.getTime(),!1,0,this.data.length-1),this.getCoordinate(a-this.start)):NaN},categoryToCoordinate:function(a){return this.chart?(a=this.chart.getCategoryIndexByValue(a),this.getCoordinate(a-this.start)):NaN},coordinateToDate:function(a){return this.equalSpacing?(a=this.xToIndex(a),new Date(this.data[a].time)):new Date(this.startTime+a/this.stepWidth)}});


/***/ },

/***/ 468:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(467);

	var helper = __webpack_require__(469);
	var AmCharts = __webpack_require__(464);

	var GRAPH_OPTS = {
		type: 'column',
		valueField: 'value',
		lineColorField: 'activeLine',
		fillColorsField: 'activeColor',
		colorField: 'activeColor',
		alphaField: 'alpha',
		fillAlphas: 1,
		lineAlpha: 1,
		urlField: 'Url',
		patternField: 'Pattern',
		cornerRadiusTop: 2,
		bulletAlpha: 0,
		bulletBorderAlpha: 0,
		bulletOffset: -30,
		bulletSize: 20,
		bullet: 'none',
		labelColorField: 'labelColor',
		descriptionField: 'description',
		clustered: false,
		showBalloon: true,
		fontSize: 13,
		labelOffset: 0
	};

	var CHART_OPTS = {
		theme: 'onescreen',
		panEventsEnabled: false,
		units: 'kr',
		type: 'serial',
		categoryField: 'categoryLabel',
		marginRight: 20,
		startDuration: 0.5,
		hideBalloonTime: 500,
		rotate: false,
		balloon: {
			maxWidth: 150
		},
		columnWidth: 0.9,
		startEffect: 'easeOutSine',
		chartCursor: {
			cursorAlpha: 0,
			valueBalloonsEnabled: false,
			categoryBalloonEnabled: false,
			zoomable: false
		},
		
	};

	module.exports = {
		ready: function() {
			var graphs = [];
			var yAxis = [this._getAxisOpts(this.$options.axisY, this._getGuides())];
			var xAxis = this._getAxisOpts(this.$options.axisX, []);
			var data = this._getChartData(graphs);


			this._chartOpts = Object.assign({}, CHART_OPTS, {
				valueAxes: yAxis,
				categoryAxis: xAxis,
				graphs: graphs,
				dataProvider: data
			});

			helper.whenInViewport(this);
		},

		_getGuides: function() {
			if (!Array.isArray(this.$options.customGuides)) {
				return [];
			}

			return this.$options.customGuides.map(function(guide) {
				return {
					value: guide.value,
					label: guide.label,
					boldLabel: guide.boldLabel,
					above: guide.aboveGraph,
					fillColor: helper.color(guide.lineColor),
					lineColor: helper.color(guide.lineColor),
					color: helper.color(guide.fontColor),
					lineThickness: guide.thickness,
					fontSize: guide.fontSize,
					fillAlpha: guide.lineAlpha,
					lineAlpha: guide.lineAlpha
				};
			});
		},

		_getGraphOpts: function(bar, index) {
			return Object.assign({}, GRAPH_OPTS, {
				valueField: GRAPH_OPTS.valueField + index,
				fillColorsField: GRAPH_OPTS.fillColorsField + index,
				lineColorField: GRAPH_OPTS.lineColorField + index,
				colorField: GRAPH_OPTS.colorField + index,
				descriptionField: GRAPH_OPTS.descriptionField + index,
				labelColorField: GRAPH_OPTS.labelColorField + index,
				labelText: bar.label,
				cornerRadiusTop: bar.cornerRadius,
				showBalloon: bar.showTooltip,
				fontSize: bar.fontSize,
				labelOffset: bar.labelOffset
			});
		},

		_getAxisOpts: function(axisData, guides) {
			return {
				gridAlpha: axisData.gridAlpha,
				axisAlpha: axisData.axisAlpha,
				title: axisData.title,
				titleFontSize: axisData.fontSize,
				labelsEnabled: !axisData.hideLabels,
				boldLabels: axisData.boldLabels,
				titleColor: helper.color(axisData.titleColor),
				color: helper.color(axisData.labelsColor),
				guides: guides
			};
		},

		_getBarData: function(graphs, data, bar, index) {
			var graphOpts = graphs[index];
			var labelColor = helper.color(bar.labelColor);
			var barColor = bar.useGradient 
				? helper.gradient(bar.color)
				: helper.color(bar.color);

			if (!graphOpts) {
				graphOpts = this._getGraphOpts(bar, index);

				graphs.push(graphOpts);
			}
			
			if (index === 0) {
				data.categoryLabel = bar.valueAxisLabel;
			}

			data[graphOpts.fillColorsField] = barColor.gradient || barColor;
			data[graphOpts.lineColorField] = barColor.stroke || barColor;
			data[graphOpts.valueField] = bar.value;
			data[graphOpts.descriptionField] = bar.description;
			data[graphOpts.labelColorField] = labelColor;
			data.clustered = bar.clustered;

			return data;
		},

		_getChartData: function(graphs) {
			return this.$options.source.map(function(bars) {
				return bars.reduce(this._getBarData.bind(this, graphs), {});			
			}.bind(this));
		},

		draw: function() {
			var isMobileWidth = this.$el.width() < this.$options.mobileBreakpoint;

			helper.reset(this.chart);

			if (this._chartOpts.rotate !== isMobileWidth) {
				this._chartOpts.graphs.reverse();
			}

			this._chartOpts.rotate = isMobileWidth;
			this._chartOpts.fontSize = isMobileWidth ? 11 : 13;

			this._chartOpts.graphs.forEach(function(graph) {
				graph.gradientOrientation = isMobileWidth ? 'horizontal' : 'vertical';
			});

			this.chart = AmCharts.makeChart(this.$elements.chart.get(0), this._chartOpts);
		}
	};


/***/ },

/***/ 469:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(470);

	var tooltipTemplate = __webpack_require__(471);
	var AmCharts = __webpack_require__(464);

	var helper = {},
	  $ = __webpack_require__(3);

	// Default options for all charts
	helper.defaults = {
	  theme: 'onescreen',
	  panEventsEnabled: false
	};

	// Colors from the theme file
	helper.colors = AmCharts.themes.onescreen.colors;
	helper.series = AmCharts.themes.onescreen.series;
	helper.gradients = AmCharts.themes.onescreen.gradients;

	// Init a chart module
	helper.init = function(module, options) {
	  module.$options = $.extend({}, helper.defaults, options, module.$options);
	  module.$options.dataProvider = helper.data(module);

	  // Fix config flag support
	  module.$options.depth3D = module.$options.depth3d || module.$options.depth3D || 0;
	  module.$options.gradientRatio = [0, module.$options.gradient || 0.1];
	  module.$options.startDuration = module.$options.startDuration;
	  module.$options.pullOutDuration = module.$options.pullOutDuration;
	};

	// Get chart data from global or method
	helper.data = function(module) {
		var telenor = window.TN;

		if (module.$options.key && telenor) {
			return telenor.config[module.$options.key];
		}

		if (module.data) {
			if (typeof module.data === 'function') {
				return module.data();
			}
			return module.data;
		}
	};

	// Get a color value from name or index
	helper.color = function(id) {
	  return helper.colors[id] || helper.series[id] || helper.series[0];
	};

	// Get a color gradient from name or index
	helper.gradient = function(id) {
	  return helper.gradients[id] || helper.color(id);
	};

	// Reset a chart object
	helper.reset = function(chart) {
	  if (!chart) { return; }
	  chart.invalidateSize();
	  chart.clear();
	};

	helper.onResize = function(module) {
	  $(window).resize(module.$tools.helper.throttle(module.draw.bind(module), 500));
	};

	// Wait until element is in viewport
	helper.whenInViewport = function(module) {
	  var check = function() {
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();
	    var elemTop = module.$el.offset().top - 100;
	    var elemBottom = elemTop + module.$el.height() - 100;
	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) || (elemTop < docViewTop);
	  };

	  var call = function() {
	    if (check()) {
	      $(window).off('scroll', call);
	      module.draw();
	    }
	  };

	  $(window).on('scroll', call);
	  call();
	};

	module.exports = helper;

	AmCharts.isReady = true;


/***/ },

/***/ 470:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {};

	var AmCharts = __webpack_require__(464),
		colors = {
			white:            '#ffffff',
			graphiteblack:    '#474747',
			dark:             '#757575',
			grey:             '#d1d1d1',
			blue:             '#038cd6',
			darkblue:         '#004a8b',
			green:            '#43c682',
			yellow:           '#ffb900',
			red:              '#db5451',
			purple:           '#6b2377'
		},

		gradients = {
			blue:     { gradient: ['#0278b8', '#029df0'], stroke: '#02679e' },
			green:    { gradient: ['#3eb577', '#43c682'], stroke: '#369e68' },
			red:      { gradient: ['#db5451', '#ff615e'], stroke: '#b24442' },
			yellow:   { gradient: ['#ffb900', '#ffcf4c'], stroke: '#e5a800' },
			purple:   { gradient: ['#6b2377', '#9f34b2'], stroke: '#42154a' }
		},

		series = [
			colors.grey,
			colors.blue,
			colors.green,
			colors.yellow,
			colors.red,
			colors.purple,
			colors.dark
		];

	AmCharts.themes.onescreen = {
		themeName: 'onescreen',
		background: colors.grey,
		colors: colors,
		gradients: gradients,
		series: series,

		AmChart: {
			color: colors.black,
			backgroundColor: colors.white,
			fontFamily: 'Telenor',
			fontSize: 13,
			thousandsSeparator: '.',
			decimalSeparator: ',',
			startDuration: 0
		},

		AmCoordinateChart: {
			colors: series,
			gridAlpha: 0,
			color: colors.dark
		},

		AmSlicedChart: {
			colors: series,
			outlineColor: colors.white,
			outlineThickness: 0,
			outlineAlpha: 1
		},

		AmRectangularChart: {
			zoomOutButtonColor: colors.black,
			zoomOutButtonRollOverAlpha: 0.15
		},

		AxisBase: {
			color: colors.dark,
			axisAlpha: 0,
			gridAlpha: 0
		},

		ChartScrollbar: {
			backgroundColor: colors.black,
			backgroundAlpha: 0.12,
			graphFillAlpha: 0.5,
			graphLineAlpha: 0,
			selectedBackgroundColor: colors.white,
			selectedBackgroundAlpha: 0.4,
			gridAlpha: 0.15
		},

		ChartCursor: {
			cursorColor: colors.dark,
			color: colors.white,
			cursorAlpha: 0.5
		},

		AmLegend: {
			color: colors.dark,
			fontSize: 13
		},

		AmGraph: {
			fillColors: colors.grey,
			bullet: 'round',
			bulletSize: 6,
			bulletColor: colors.blue,
			balloonColor: colors.white,
			lineAlpha: 1,
			lineThickness: 1,
			fillAlphas: 0.3,
			bulletBorderAlpha: 1,
			bulletBorderColor: colors.blue,
			bulletBorderThickness: 2
		},

		AmBalloon: {
			color: colors.dark,
			fillAlpha: 1,
			borderAlpha: 1,
			borderThickness: 1,
			fillColor: colors.white,
			borderColor: colors.grey,
			fadeOutDuration: 0,
			adjustBorderColor: false,
			fixedPosition: true,
			shadowAlpha: 0,
			shadowColor: colors.dark
		},

		AmAngularGauge: {
			thousandsSeparator: '',
			fontFamily: 'Telenor, Arial, Helvetica, sans-serif'
		},

		GaugeAxis: {
			tickAlpha: 0,
			tickLength: 20,
			minorTickLength: 15,
			axisThickness: 0,
			showFirstLabel: false,
			showLastLabel: false,
			bottomTextColor: colors.black,
			bottomTextBold: false,
			bottomTextFontSize: 30,
			bottomTextYOffset: -23,
			bandOutlineColor: colors.white,
			bandOutlineThickness: 2,
			bandOutlineAlpha: 1,
			axisAlpha: 0,
			bandAlpha: 1
		},

		GaugeArrow: {
			color: colors.black,
			clockWiseOnly: true,
			alpha: 1,
			nailAlpha: 1,
			radius: 50,
			innerRadius: 0,
			nailRadius: 0,
			startWidth: 8,
			endWidth: 2,
			borderAlpha: 0,
			nailBorderAlpha: 0
		},

		TrendLine: {
			lineColor: colors.black,
			lineAlpha: 1
		},

		AreasSettings: {
			alpha: 0.8,
			color: colors.yellow,
			colorSolid: colors.dark,
			unlistedAreasAlpha: 0.4,
			unlistedAreasColor: colors.black,
			outlineColor: colors.white,
			outlineAlpha: 0.5,
			outlineThickness: 0.5,
			rollOverColor: colors.blue,
			rollOverOutlineColor: colors.white,
			selectedOutlineColor: colors.white,
			selectedColor: colors.red,
			unlistedAreasOutlineColor: colors.white,
			unlistedAreasOutlineAlpha: 0.5
		},

		LinesSettings: {
			color: colors.black,
			alpha: 0.8
		},

		ImagesSettings: {
			alpha: 0.8,
			labelColor: colors.black,
			color: colors.black,
			labelRollOverColor: colors.blue
		},

		ZoomControl: {
			zoomControlEnabled: false,
			panControlEnabled: false
		},

		SmallMap: {
			mapColor: colors.black,
			rectangleColor: colors.red,
			backgroundColor: colors.white,
			backgroundAlpha: 0.7,
			borderThickness: 1,
			borderAlpha: 0.8
		}

	};


/***/ },

/***/ 471:
/***/ function(module, exports) {

	module.exports = "<div><%= Title %></div>\r\n<% if (InvoiceNumber) { %>\r\n<div class=\"grid-row\">\r\n\t<div class=\"col-xs-3 text--left\"><%= InvoiceNumberLabel %></div>\r\n\t<div class=\"col-xs-9 text--right\"><%= InvoiceNumber %></div>\r\n</div>\r\n<% } %>\r\n<% for (var i = 0; i < Fields.length; ++i) { %>\r\n<% if (typeof Fields[i].price !== \"undefined\") { %>\r\n<div class=\"grid-row\">\r\n\t<div class=\"col-xs-6 text--left\"><%= Fields[i].name %></div>\r\n\t<div class=\"col-xs-6 text--right\"><%= Fields[i].price %></div>\r\n</div>\r\n<% } else { %>\r\n<div class=\"text--left\"><%= Fields[i].name %></div>\r\n<% } %>\r\n<% } %>\r\n\r\n<% if (PaymentLink.length !== 0) { %>\r\n<a href=\"<%= PaymentLink %>\" class=\"button button--action button--small leader--small trailer--xsmall\">\r\n\t<span class=\"button__text\"><%= ButtonLabel %></span></a>\r\n<% } %>\r\n"

/***/ },

/***/ 472:
/***/ function(module, exports, __webpack_require__) {

	var AmCharts = __webpack_require__(464),
	  helper = __webpack_require__(469);

	__webpack_require__(467);

	module.exports = {
	  ready: function() {
	    helper.init(this, {
	      units: "kr",
	      type: "serial",
	      categoryField: "x",
	      valueField: "y",
	      startAlpha: 0,
	      startDuration: .25,
	      startEffect: "easeOutSine",
	      chartCursor: {
	        cursorAlpha: 0,
	        bulletSize: 10,
	        bulletsEnabled: true,
	        valueBalloonsEnabled: true,
	        categoryBalloonEnabled: false,
	        zoomable: false
	      },
	      valueAxes: [{
	        gridAlpha: .1,
	        minimum: 0
	      }],
	      categoryAxis: {
	        gridPosition: "middle",
	        gridAlpha: .1
	      },
	      graphs:[{
	        type: "line",
	        valueField: "y",
	        urlField: "href",
	        lineThickness: 2,
	        balloonText: "[[text]]",
	        bulletColor: helper.colors.white
	      }]
	    });

	    helper.whenInViewport(this);
	  },

	  draw: function() {
	    var color = helper.color(this.$options.color);
	    var box = this.$components.chart.$el.html('');

	    this.$options.valueAxes[0].unit = ' ' + this.$options.units;
	    this.$options.graphs[0].bulletBorderColor = color;
	    this.$options.graphs[0].bulletColor = helper.color('white');
	    this.$options.graphs[0].lineColor = color;
	    this.$options.graphs[0].fillColors = [helper.gradient(this.$options.color).gradient[0], helper.color('white')];

	    this.chart = AmCharts.makeChart(box.get(0), this.$options);
	  }
	};


/***/ },

/***/ 473:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var template = __webpack_require__(474);

	/**
	name: Autocomplete
	type: ui
	desc: >
		Autocomplete

		Response example:

		```js
			{
				"success": true,
				"data": [
					{"label": "Alabama", "value": "Alabama"},
					{"label": "Alaska", "value": "Alaska"},
					{"label": "Arizona", "value": "Arizona"},
					{"label": "Arkansas", "value": "Arkansas"},
					{"label": "California", "value": "California"}
				]
			}
		```
	options:
		autocompleteSource: ID of an element used as autocomplete dropdown
		autocompleteUrl: URL to fetch data from autocomplete
		payload: If option starts with *payload* followed by another autocomplete alias, that autocomplete value is added to the request.
	events:
		valueWillSet: >
			Fires when input value is about to change. Additional param is passed, containing current value and mutate function, that allows to change the value
		valueIsSet: >
			Fires when input value is changed
	*/
	module.exports = {

		initialize: function() {
			this.$el.attr('autocomplete', 'off');

			this.templateHtml = this.$tools.template.parse(template);
			this.$container = this.$el.parent().addClass(this.options.parentClass);
			this.$container.on('keydown', this.onKeydown.bind(this));

			this.isCollapsed = true;

			if (this.$options.autocompleteSource) {
				this.$dropdown = this.$container.find('#' + this.$options.autocompleteSource);
			} else {
				this.$dropdown = this.$container.find(this.options.dropdownSelector);
			}

			if (!this.$dropdown.length) {
				this.$el.after(this.options.dropdownTemplate);
				this.$dropdown = this.$container.find(this.options.dropdownSelector);
			}

			this.$dropdownList = this.$dropdown.find(this.options.dropdownListSelector);
			this.$dropdownList.on('click', 'a', this.onItemLinkClick.bind(this));

			this.$events.on('typeWatch $this', this._search.bind(this));
		},

		processors: {},
		cachedTemplate: [],
		previousValue: {},
		options: {
			parentClass: 'autocomplete',
			openClass: 'is-open',
			dropdownSelector: '.dropdown__content',
			dropdownListSelector: '.dropdown__list',
			dropdownListItemSelector: '.dropdown__list > li',
			dropdownListItemLabelSelector: '> a',

			dropdownTemplate: '<div class="dropdown__content" role="menu">' +
			'<div class="dropdown__scroll">' +
			'<ul class="dropdown__list" aria-live="polite"></ul>' +
			'</div>' +
			'</div>'
		},

		/**
		 desc: Returns current value
		 */
		val: function() {
			return this.$el.val();
		},

		/**
		 desc: Close autocomplete dropdown
		 */
		close: function() {
			this.isCollapsed = true;
			this.$container.removeClass('is-open');
			this.currentIndex = -1;

			this.$tools.dom.find(document).off('click.autocomplete');
		},

		/**
		 desc: Open autocomplete dropdown
		 */
		open: function() {
			this.isCollapsed = false;
			this.$container.addClass('is-open');

			this.$tools.dom.find(document).on('click.autocomplete', this.onClickOutside.bind(this));
		},

		setProcessors: function(processors) {
			this.processors = processors || {};
		},

		_search: function() {
			var currentValue = this.val();

			if (currentValue.length > 0 && currentValue !== this.previousValue) {
				if (!this.$options.autocompleteUrl) {
					this._searchInStaticSource();
				} else {
					this._loadData();
				}

				this.previousValue = currentValue;
			} else {
				this.close();
			}
		},

		_payload: function() {
			var obj = {
				query: this.val()
			};
			var data = this.$options;
			var key;
			var property;

			for (property in data) {
				if (property.indexOf('payload') === 0) {
					key = property.replace('payload', '');
					obj[key] = this.$tools.dom.find('#' + data[property]).val();
				}
			}

			return obj;
		},

		_loadData: function() {
			var ajaxConfig;

			this.close();

			this.$dropdownList.html('');

			ajaxConfig = {
				url: this.$options.autocompleteUrl || '',
				type: 'GET',
				data: this._payload(),
				success: (function(response) {
					var itemsData;

					if (response && response.data && Array.isArray(response.data)) {
						itemsData = response.data;

						if (typeof this.processors.processResponseData === 'function') {
							itemsData = this.processors.processResponseData(itemsData);
						}

						this._setData(itemsData);
					}
				}).bind(this)
			};

			ajaxConfig = this.$tools.util.extend(true, ajaxConfig, this._callProcessor('getLoadDataConfig'));

			this.$tools.data.ajax(ajaxConfig);
		},

		_setData: function(itemsData) {
			this.$dropdownList.html('');

			this.cachedTemplate = [];

			this.$tools.util.each(itemsData, (function(index, item) {
				if (item) {
					if (typeof item === 'object') {
						this._addItem(item.value, item.label);
					} else {
						this._addItem(item, item);
					}
				}
			}).bind(this));

			this.$dropdownList.append(this.cachedTemplate.join(''));

			if (this._checkVisibilityState()) {
				this.$tools.data.pubsub.publish('autocomplete.items.found', this);
			} else {
				this.$tools.data.pubsub.publish('autocomplete.items.not.found', this);
			}
		},

		_addItem: function(value, label) {
			var template = this.templateHtml({value: value, label: label});

			if (this.cachedTemplate.indexOf(template) === -1 && value && label) {
				this.cachedTemplate.push(template);
			}
		},

		_checkVisibilityState: function() {
			var $items = this.$dropdown.find(this.options.dropdownListItemSelector);

			if ($items.length > 0) {
				this.open();

				return true;
			}

			this.close();

			return false;
		},

		_searchInStaticSource: function() {
		},

		_setValue: function(selectedItemIndex) {
			var $selectedItem = this.$dropdown.find(this.options.dropdownListItemSelector).eq(selectedItemIndex);
			var label = $selectedItem.find(this.options.dropdownListItemLabelSelector).text();
			var value = $selectedItem.data('autocomplete-value') || label || '';
			var inputVal;

			this.previousValue = value;

			inputVal = value;

			this.$events.trigger('valueWillSet', {
				value: inputVal,
				mutate: function(value) {
					inputVal = value;
				}
			});

			this.$el.val(inputVal);
			this.$el.trigger('keyup');
			this.$el.focus();

			if (this.$options.alias) {
				this.$tools.data.pubsub.publish('autocomplete.changed', {
					value: value,
					label: label,
					alias: this.$options.alias,
					relatedFields: this.$options.relatedFields ? this.$options.relatedFields.split(',') : null
				});
			}

			this.$events.trigger('valueIsSet', inputVal);
		},

		_callProcessor: function(processorName) {
			if (typeof this.processors[processorName] === 'function') {
				return this.processors[processorName]();
			}

			return {};
		},

		onItemLinkClick: function(event) {
			var $listItem = this.$tools.dom.find(event.currentTarget).closest(this.options.dropdownListItemSelector);
			var $items = this.$dropdown.find(this.options.dropdownListItemSelector);
			var index = $listItem.length ? $items.index($listItem[0]) : -1;

			event.preventDefault();

			this._setValue(index);
			this.close();
		},

		onKeydown: function(event) { // eslint-disable-line max-statements
			var $items;
			var KEYCODE = {ENTER: 13, ESCAPE: 27, TAB: 9, UP: 38, DOWN: 40};

			if (this.isCollapsed) {
				return;
			}

			if (event.which === KEYCODE.ESCAPE) {
				this.close();

				return;
			}

			if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.ENTER, KEYCODE.TAB].indexOf(event.which) === -1) {
				return;
			}

			event.preventDefault();

			$items = this.$dropdown.find(this.options.dropdownListItemSelector);

			if (event.which === KEYCODE.TAB && this.currentIndex < 0 && $items.length) {
				this.currentIndex = 0;
			}

			if ((event.which === KEYCODE.ENTER || event.which === KEYCODE.TAB) && this.currentIndex >= 0) {
				this._setValue(this.currentIndex);
				this.close();

				return;
			}

			if (event.which === KEYCODE.UP && this.currentIndex > 0) {
				this.currentIndex--;
			}

			if (event.which === KEYCODE.DOWN && this.currentIndex < ($items.length - 1)) {
				this.currentIndex++;
			}

			this._moveScroll();
		},

		_moveScroll: function() {
			var current = $items.eq(this.currentIndex).find('> a');
			var scroll = this.$dropdown.find('.dropdown__scroll');
			var topShift = current.offset().top - scroll.offset().top;
			var bottomShift = topShift + current.outerHeight() - scroll.innerHeight();
			var currentScroll = scroll.offset().top - this.$dropdownList.offset().top;

			if (topShift < 0) {
				scroll[0].scrollTop = topShift + currentScroll;
			}

			if (bottomShift > 0) {
				scroll[0].scrollTop = bottomShift + currentScroll;
			}

			this.$dropdown.find('.current-autocomplete-option').removeClass('current-autocomplete-option');
			current.addClass('current-autocomplete-option');
		},

		onClickOutside: function(event) {
			// Check that the click was made outside the dropdown.
			if (!this.$tools.dom.find(event.target).closest(this.options.dropdownSelector).length) {
				this.close();
			}
		}
	};


/***/ },

/***/ 474:
/***/ function(module, exports) {

	module.exports = "<li data-autocomplete-value=\"<%= value %>\">\r\n\t<a href=\"#\" class=\"text-truncate\"><%= label %></a>\r\n</li>\r\n"

/***/ },

/***/ 475:
/***/ function(module, exports) {

	'use strict';

	var DEFAULT_CONTROL_GROUPS = ['exclusiveAction'];

	/**
	name: Exclusive Action
	type: ui
	desc: >
		It's a kind of container component that helps to prevent actions on all buttons in specified groups
		except the button that actually do some action. All non-active buttons will be disabled till
		current action finished. This component could be used as extension or as ignored component to prevent
		breaking of components hierarchy.

		NOTES!
			* Currently this component process only buttons.
			* It search only first-descendant buttons
			* It doesn't save current state of buttons before disabling

	options:
		controlGroups: >
			Specifies comma-separated list of Aura components groups which should be processed together.
			Group `exclusiveAction` is processed by default.
	 */
	module.exports = {
		ready: function() {
			this.groups = DEFAULT_CONTROL_GROUPS;

			if (this.$options.controlGroups) {
				this.groups = this.$options.controlGroups.split(',').reduce(function(groups, currentGroup) {
					return groups.concat(currentGroup.trim());
				}, this.groups);
			}

			this.groups.forEach(function(group) {
				this.$events.on('click $$' + group, this._onControlClick.bind(this));
			}.bind(this));
		},

		_onControlClick: function(event) {
			event.component.activityIndicator();

			event.component.$events.one('actionFinished $this', function() {
				this._processControls(this._enableControlsCallback);
			}.bind(this));

			this._processControls(this._disableControlsCallback);
		},

		_processControls: function(callback) {
			this.groups.filter(function(group) {
				return !!this.$components[group];
			}.bind(this)).forEach(function(group) {
				this.$components[group].forEach(callback);
			}.bind(this));
		},

		_disableControlsCallback: function(control) {
			if (control.isLoading && !control.isLoading()) {
				control.disable();
			}
		},

		_enableControlsCallback: function(control) {
			if (control.enable) {
				control.enable();
			}
		}
	};


/***/ },

/***/ 476:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var GallerySlide = __webpack_require__(477);
	var styleHelper = __webpack_require__(478);

	var ROUND = {
		'-1': Math.floor.bind(Math),
		'1': Math.ceil.bind(Math),
		'0': Math.round.bind(Math)
	};

	var MODIFIERS = {
		init: 'carousel--init'
	};

	/**
		desc: flat gallery constructor. Instantiates gallery params
		params: >
			options. Object. settings for the gallery
				container: AuraElement. gallery container element
				holder: AuraElement. gallery holder element(Moving block)
				slides: AuraElement. slide elements
				duration: Number. animation duration
				visibleSlides: Number. amount of visible slides
	*/
	function FlatGallery(options) {
		this.$container = options.container;
		this.$holder = options.holder;

		this.const = {
			duration: options.duration,
			visibleSlides: Math.min(options.visibleSlides, options.slides.length)
		};
		
		this.vars = {
			currentIndex: 0,
			direction: 0,
			stepOffset: 0,
			slideWidth: 0
		};

		this.slides = options.slides.get().map(function(elem, index) {
			return new GallerySlide(options.slides.eq(index));
		});

		this.resize();
		
		this.$container.addClass(MODIFIERS.init);
		this.$holder.get(0).addEventListener('transitionend', this._onAnimationEnd.bind(this));
	}

	FlatGallery.prototype = {
		/**
			desc: move to next slide
		*/
		next: function() {
			if (this.hasNext()) {
				this._resetOnDirectionChange(1);
				this.vars.stepOffset = this.const.visibleSlides - 1;
				this.moveTo(++this.vars.currentIndex);
			}
		},

		/**
			desc: move to previous slide
		*/
		prev: function() {
			if (this.hasPrev()) {
				this._resetOnDirectionChange(-1);
				this.vars.stepOffset = 0;
				this.moveTo(--this.vars.currentIndex);
			}
		},

		/**
			desc: move to slide by index
			args: >
				index. Number. slide`s index in the gallery
				duration. Number. animation duration (milliseconds). Comes from gallery consts by default
		*/
		moveTo: function(index, duration) {
			var event;
			
			var currentDuration = duration !== undefined ? duration : this.const.duration;

			this.vars.currentIndex = this._limitIndex(index);
			this._animateOverTime(-this.vars.currentIndex * this.vars.slideWidth, currentDuration);
			
			event = new CustomEvent('move', {
				bubbles: true,
				cancelable: true,
				detail: this.getSlideIndex(this.vars.currentIndex)
			});
			
			this.$holder.get(0).dispatchEvent(event);
		},

		/**
			desc: Takes current index by gallery offset and moves to it
		*/
		moveToNearest: function() {
			var offset = this._getOffset();
			var index = this._getIndexByOffset();
			var duration = Math.abs((-index) - (offset / this.vars.slideWidth)) * this.const.duration;

			this.moveTo(index, duration);
		},

		/**
			desc: Moves gallery from current point by offset
			args: >
				offset. Number. offset for gallery to be moved (pixels)
		*/
		moveFromCurrentPoint: function(offset) {
			var currentOffset = this._getOffset();

			this.vars.direction = offset < 0 ? -1 : 1;
			this.vars.stepOffset = offset > 0 ? this.const.visibleSlides - 1 : 0;
			this._animateOverTime(currentOffset - offset, 0);
		},

		/**
			desc: returns true/false if gallery has/doesn't have next slide
		*/
		hasNext: function() {
			return this.vars.currentIndex + 1 <= this.slides.length - this.const.visibleSlides;
		},

		/**
			desc: returns true/false if gallery has/doesn't have previous slide
		*/
		hasPrev: function() {
			return this.vars.currentIndex - 1 >= 0;
		},

		/**
			desc: recalcucates gallery width, height, slide width and rearranges gallery
		*/
		resize: function() {
			var maxSlideHeight;

			this.$holder.css({width: '', transform: '', transitionDuration: '', height: ''});
			this.vars.slideWidth = this.$holder.width() / this.const.visibleSlides;
			
			maxSlideHeight = Math.max.apply(Math, this.slides.map(function(slide) {
				return slide.setWidth(this.vars.slideWidth).getHeight();
			}.bind(this)));

			this.$holder.css({width: this.vars.slideWidth * this.slides.length, height: maxSlideHeight});

			this._rearrange();
		},
		
		getSlideIndex: function() {
			return this.vars.currentIndex;
		},

		_rearrange: function() {
			this._animateOverTime(-this.vars.currentIndex * this.vars.slideWidth, 0);
		},

		_onAnimationEnd: function() {
			this.vars.direction = 0;
			this.vars.stepOffset = 0;
		},

		_getOffset: function() {
			return styleHelper.getTranslateX(this.$holder.get(0));
		},

		_resetOnDirectionChange: function(delta) {
			if (this.vars.direction + delta) {
				this.vars.direction = delta;

				return;
			}

			this.vars.currentIndex = this._getIndexByOffset();
			this.vars.direction = -this.vars.direction;
		},

		_animateOverTime: function(offset, duration) {
			var fn = styleHelper.setTransform.bind(this, this.$holder.get(0), offset, duration);

			if ((/(Edge)|(MSIE)|(Trident\/7)/ig).test(navigator.userAgent)) {
				fn();
			} else {
				requestAnimationFrame(fn);
			}
		},

		_getIndexByOffset: function() {
			var offset = this._getOffset();

			return ROUND[this.vars.direction](-offset / this.vars.slideWidth);
		},

		_limitIndex: function(index) {
			return Math.max(0, Math.min(index, this.slides.length - this.const.visibleSlides));
		}
	};

	module.exports = FlatGallery;


/***/ },

/***/ 477:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var styleHelper = __webpack_require__(478);

	var MODIFIERS = {
		clone: 'carousel__item--clone'
	};

	/**
		desc: gallery slide constructor
		params: >
			$slide. AuraElement. gallery slide element
	*/
	function GallerySlide($slide) {
		this.$slide = $slide;
		this.$slide.get(0).addEventListener('transitionend', this._stopTransitionPropagation.bind(this));
	}

	GallerySlide.prototype = {
		/**
			desc: return slide`s clone
		*/
		getClone: function() {
			return this.$slide.clone().addClass(MODIFIERS.clone);
		},

		/**
			desc: sets slides`s width
			args:
				width: slide width (pixels)
		*/
		setWidth: function(width) {
			this.$slide.width(width);

			return this;
		},

		/**
			desc: returns slides`s height
		*/
		getHeight: function() {
			var ownHeight;

			this.$slide.css({height: 'auto'});

			ownHeight = this.$slide.height();

			this.$slide.css({height: ''});

			return ownHeight;
		},

		/**
			desc: sets slide`s offset in the gallery
		*/
		setPosition: function(offset) {
			styleHelper.setTransform(this.$slide.get(0), offset);
		},

		/**
			desc: return slide`s offset in the gallery
		*/
		getPosition: function() {
			return styleHelper.getTranslateX(this.$slide.get(0));
		},

		_stopTransitionPropagation: function(event) {
			event.stopPropagation();
		}
	};

	module.exports = GallerySlide;


/***/ },

/***/ 478:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		/**
			desc: Sets element's transform and transition duration styles
			args: >
				elem: DOM Node
				translateX: Number. offset on X-axis for the element
				transitionDuration: Number. Value for the transition duration (milliseconds)
		*/
		/* eslint no-param-reassign: "off" */
		setTransform: function(elem, translateX, transitionDuration) {
			if (translateX !== undefined) {
				elem.style.transform = 'translate3d(' + translateX + 'px,0,0)';
			}

			if (transitionDuration !== undefined) {
				elem.style.transitionDuration = transitionDuration + 'ms';
			}
		},

		/**
			desc: Returns offset on X-axis set by transform style
			args: >
				elem: DOM Node
		*/
		/* eslint no-magic-numbers: "off" */
		getTranslateX: function(elem) {
			var transform = window.getComputedStyle(elem).transform;

			return transform === 'none'
				? 0
				: transform.replace(/matrix\((.*)\)/, '$1')
					.split(', ')
					.slice(-2, -1)[0];
		}
	};


/***/ },

/***/ 479:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FlatGallery = __webpack_require__(476);

	var MODIFIERS = {
		loop: 'carousel--loop'
	};

	function LoopGallery(options) {
		this.$clones = [];

		FlatGallery.call(this, options);

		this.const.autoPlayDelay = options.autoPlay;
		this.$container.addClass(MODIFIERS.loop);
		this._toggleAutoPlay(true);
	}

	LoopGallery.prototype = Object.assign({}, FlatGallery.prototype, {

		moveTo: function(index, duration) {
			FlatGallery.prototype.moveTo.call(this, index, duration);

			this._toggleAutoPlay(false);
			this._substituteSlide();
		},

		moveFromCurrentPoint: function(offset) {
			var index = this._getIndexByOffset();
			
			FlatGallery.prototype.moveFromCurrentPoint.call(this, offset);

			this._toggleAutoPlay(false);

			if (index === this.vars.currentIndex) {
				return;
			}
			
			this.vars.currentIndex = index;
			this._substituteSlide();
		},

		hasNext: function() {
			return true;
		},

		hasPrev: function() {
			return true;
		},
		
		getSlideIndex: function(index) {
			var currentIndex = index;
			
			currentIndex = (currentIndex + this.vars.stepOffset) % this.slides.length;

			return currentIndex < 0 ? this.slides.length + currentIndex : currentIndex;
		},

		_limitIndex: function(index) {
			return index;
		},

		_rearrange: function() {
			var index = this.getSlideIndex(this.vars.currentIndex);
			var limit = index + this.slides.length;
			var slideIndex;

			this.vars.currentIndex = index;
			this._removeClones();

			for (index; index < limit; index++) {
				slideIndex = this.getSlideIndex(index);

				this.slides[slideIndex].setPosition(this.vars.slideWidth * index);
			}

			FlatGallery.prototype._rearrange.call(this);
		},

		_substituteSlide: function() {
			var index = this.getSlideIndex(this.vars.currentIndex);
			var slide = this.slides[index];
			var newPosition = (this.vars.currentIndex + this.vars.stepOffset) * this.vars.slideWidth;
			var hasSamePosition = Math.ceil(newPosition) === Math.ceil(slide.getPosition());
			var $clone;
			
			if (hasSamePosition) {
				return;
			}
			
			$clone = slide.getClone();
			
			slide.setPosition(newPosition);

			this.$holder.get(0).appendChild($clone.get(0));
			this.$clones.push($clone);
		},

		_onAnimationEnd: function() {
			FlatGallery.prototype._onAnimationEnd.call(this);

			this._rearrange();
			this._toggleAutoPlay(true);
		},

		_removeClones: function() {
			this.$clones.forEach(function(elem) {
				elem.remove();
			});
		},

		_toggleAutoPlay: function(enable) {
			if (!enable) {
				clearTimeout(this.vars.autoPlayId);
			} else if (this.const.autoPlayDelay > 0) {
				this.vars.autoPlayId = setTimeout(this.next.bind(this), this.const.autoPlayDelay);
			}
		}
	});

	module.exports = LoopGallery;


/***/ },

/***/ 480:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FlatGallery = __webpack_require__(476);
	var LoopGallery = __webpack_require__(479);
	var tools = __webpack_require__(341);
	var paginationDefaultTemplate = tools.template.parse(__webpack_require__(481));

	var EVENTS = {
		start: document.ontouchstart !== undefined ? 'touchstart' : 'pointerdown',
		move: document.ontouchmove !== undefined ? 'touchmove' : 'pointermove',
		end: document.ontouchend !== undefined ? 'touchend' : 'pointerup',
		resize: 'resize'
	};

	var OPTIONS = {
		duration: 700,
		visibleSlides: 1,
		debounceTimeout: 200
	};

	var CLASSES = {
		activeClass: 'active'
	};

	/**
		name: Carousel
		type: ui
		desc: >
			Component for animating block collections
		options:
			duration: Number. animation duration (milliseconds)
			visibleSlides: Number. amount of visible slides in gallery frame
			autoPlay: Number. delay between autochanging slide  (milliseconds). Works only in pair with "loop" option
			minSlideNumber: Number. least amount of slides to instantiate gallery
			minActivationWidth: Number. least width to instantiate gallery (pixels)
			loop: Boolean. Flag to intantiate endless gallery
			mobile: Mobile only mode
			disableButtons: Boolean. If "true" disable buttons handler
	*/
	module.exports = {
		events: {
			'move carouselHolder': '_onGalleryMove',
			'click paginationItem': '_onPaginationClick',
			'click $btnNext': '_next',
			'click $btnPrev': '_prev'
		},
		
		ready: function() {
			if (!window.matchMedia('(max-width: 767px)').matches) {
				return;
			}
			
			if (this.$options.minSlidesNumber > this.$elements.carouselSlide.length) {
				return;
			}

			if (this.$options.minActivationWidth && window.innerWidth < this.$options.minActivationWidth) {
				return;
			}
			
			this.btnNext = this.$components.btnNext;
			this.btnPrev = this.$components.btnPrev;

			this._initGallery();
			this._addEvents();
		},

		_initGallery: function() {
			var options = {
				container: this.$el,
				holder: this.$elements.carouselHolder,
				slides: this.$elements.carouselSlide,
				duration: this.$options.duration || OPTIONS.duration,
				visibleSlides: this.$options.visibleSlides || OPTIONS.visibleSlides,
				autoPlay: this.$options.autoPlay
			};
			
			if (options.slides.length > 1 && this.$options.pagination) {
				this._createPagination();
			}
			
			if (this.$options.loop) {
				this.gallery = new LoopGallery(options);
			} else {
				this.gallery = new FlatGallery(options);
			}
		},
		
		_createPagination: function() {
			var paginationTemplate = paginationDefaultTemplate({
				slides: this.$elements.carouselSlide
			});
			
			this.html(paginationTemplate, this, 'beforeend')
				.then(function() {
					this._setPaginationActive(this.gallery.vars.currentIndex);
				}.bind(this));
		},
		
		_onPaginationClick: function(event) {
			var index = parseInt(event.$el[0].dataset.index, 10);

			if (this.gallery.vars.currentIndex !== index) {
				this.gallery.moveTo(index);
			}
			
		},
		
		_onGalleryMove: function(event) {
			this._setPaginationActive(event.detail);
		},
		
		_setPaginationActive: function(index) {
			this.$elements.paginationItem.removeClass(CLASSES.activeClass);
			this.$elements.paginationItem[index].classList.add(CLASSES.activeClass);
		},

		_addEvents: function() {
			var resizeHandler = this.gallery.resize.bind(this.gallery);

			if (this.$tools.browser.isMobile) {
				this._moveHandler = this._onTouchMove.bind(this);
				this._upHandler = this._onTouchEnd.bind(this);
				
				this.$events.on(EVENTS.start + ' carouselHolder', this._onTouchStart.bind(this));
			} else {
				resizeHandler = this.$tools.helper.debounce(resizeHandler, OPTIONS.debounceTimeout);
			}

			window.addEventListener(EVENTS.resize, resizeHandler);
		},

		_next: function(event) {
			event.preventDefault();

			this.gallery.next();
			this._toggleButtons();
		},

		_prev: function(event) {
			event.preventDefault();
			
			this.gallery.prev();
			this._toggleButtons();
		},

		_onTouchStart: function(event) {
			this.position = this._getPosition(event);
			
			if (this.position.X !== undefined) {
				this._appendTouchEvents();
			}
		},

		_onTouchEnd: function() {
			this.hooked = false;
			this.gallery.moveToNearest();
			this._toggleButtons();
			this._removeTouchEvents();
		},

		_onTouchMove: function(event) {
			var position = this._getPosition(event);
			var deltaX = this.position.X - position.X;
			var deltaY = this.position.Y - position.Y;
			
			if (!this.hooked && Math.abs(deltaY) > Math.abs(deltaX)) {
				this._removeTouchEvents();
				
				return;
			}

			if (!this.hooked) {
				deltaX = 1;
			}

			event.preventDefault();
			
			this.gallery.moveFromCurrentPoint(deltaX);
			this.position = position;
			this.hooked = true;
		},
		
		/* eslint id-length: "off" */
		_getPosition: function(event) {
			return {
				X: event.pageX || (event.targetTouches && event.targetTouches[0] && event.targetTouches[0].pageX),
				Y: event.pageY || (event.targetTouches && event.targetTouches[0] && event.targetTouches[0].pageY)
			};
		},

		_toggleButtons: function() {
			if (this.$options.disableButtons) {
				return;
			}
			
			if (this.gallery.hasNext()) {
				this.btnNext.enable();
			} else {
				this.btnNext.disable();
			}
			
			if (this.gallery.hasPrev()) {
				this.btnPrev.enable();
			} else {
				this.btnPrev.disable();
			}
		},

		_appendTouchEvents: function() {
			document.addEventListener(EVENTS.move, this._moveHandler);
			document.addEventListener(EVENTS.end, this._upHandler);
		},

		_removeTouchEvents: function() {
			document.removeEventListener(EVENTS.move, this._moveHandler);
			document.removeEventListener(EVENTS.end, this._upHandler);
		}
	};


/***/ },

/***/ 481:
/***/ function(module, exports) {

	module.exports = "<ul class=\"carousel__pagination\" data-element=\"pagination\">\r\n\t<% slides.forEach(function(item, index) { %>\r\n\t\t<li data-index=\"<%- index %>\" data-element=\"paginationItem\" class=\"carousel__pagination-item\"><span></span></li>\r\n\t<% }) %>\r\n</ul>"

/***/ },

/***/ 482:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Form checkbox
	type: ui
	desc: Wrapper for native checkbox
	events:
		changed: Fires when checkbox state was changed. Passes current state to event handler.
		checked: Fires when checkbox state was changed and current state is checked.
		unchecked: Fires when checkbox state was changed and current state is unchecked.
	*/
	module.exports = {
		events: {
			'change': '_changeHandler'
		},

		/**
			desc: Sets state of checkbox to "checked"
		*/
		check: function() {
			this.toggle(true);
		},

		/**
			desc: Sets state of checkbox to "unchecked"
		*/
		uncheck: function() {
			this.toggle(false);
		},

		/**
			desc: Sets state to one given as argument or to opposite to current one.
			args:
				checked: Boolean state to be set or empty to toggle current state.
		*/
		toggle: function(checked) {
			var currentState = this.isChecked();
			var newState = arguments.length ? Boolean(checked) : !currentState;

			if (newState === currentState) {
				return;
			}

			this.$el[0].checked = newState;

			this._changeHandler();
		},

		/**
			desc: Checks state of checkbox. Returns `Boolean` value.
		*/
		isChecked: function() {
			return this.$el[0].checked;
		},

		/**
			desc: Gets checkbox value.
		*/
		value: function() {
			return this.$el.val();
		},

		/**
			desc: return checkbox name
		*/
		name: function() {
			return this.$el[0].name;
		},

		/**
			desc: Disables checkbox.
		*/
		disable: function() {
			this.$el[0].disabled = true;
		},

		/**
			desc: Enables checkbox.
		*/
		enable: function() {
			this.$el[0].disabled = false;
		},

		_changeHandler: function() {
			var checked = this.isChecked();

			this.$events.trigger('change', checked);

			this.$events.trigger(checked ? 'checked' : 'unchecked');
		}
	};


/***/ },

/***/ 483:
/***/ function(module, exports) {

	'use strict';

	var STATES = {
		opened: 'show',
		closed: 'hide'
	};

	var CLASSES = {
		collapsed: 'collapsed',
		expanded: 'is-expanded',
		collapsing: 'collapsing'
	};

	var ATTRIBUTES = {
		disabledKey: 'disabled',
		disabledValue: 'disabled'
	};

	var animationName = 'height';

	/**
	name: Collapse
	type: ui
	desc: >
		Collapses/expands content by click on trigger with animation effect.
		Target content should be linked with component collapse by adding it attribute data-element, and use component's scope via alias of component.

		Attribute data-element of target content includes alias of collapse component and value `collapseTarget`. As result - correct alias is: `data-element='menuCollapse:collapseTarget'`.

		Also target content should include div with attribute `data-element='collapseContent'`. Rules for creating value of this attribute are the same as for target holder.

		By default target content is hidden. Target content should have class `'collapse--closed'`. First click on trigger expands target content, second - collapses.
		For showing opened state of collapse it's nessesary add attribute data\-active='true' for collapse component and remove class `'collapse--closed'` for target holder.

		You can use additional trigger button(s) for collapse/expand content.
		Attribute data-element of trigger button includes alias of collapse component and value `toggleTrigger`. As result - correct alias is: `data-element='menuCollapse:toggleTrigger'`.
	options:
		active:
			Boolean. Shows target content by default.
		readmore:
			String. Adds a link with specified text as a trigger for collapse component.
		readless:
			String. Should be used together with 'readmore'. Specifies text for trigger in case if content is expanded.
		group:
			String. Name for 'collapse' components that should work together. If one component from group is expanded, other will be collapsed.
	*/
	module.exports = {
		events: {
			'change': '_onChange',
			'click': '_onClick'
		},

		initialize: function() {
			this.$options.state = this.$options.active ? STATES.opened : STATES.closed;

			this.$toggleTrigger = this.$tools.dom.find('[data-element="' + this.$options.alias + ':toggleTrigger"]');
			this.$collapseTarget = this.$tools.dom.find('[data-element="' + this.$options.alias + ':collapseTarget"]');
			this.$collapseContent = this.$tools.dom.find('[data-element="' + this.$options.alias + ':collapseContent"]');

			this._setStateClass();
			this._setTriggerText();

			if (this.$options.state === STATES.opened) {
				this.$collapseTarget.css('height', 'auto');
			}
			this.$tools.data.pubsub.subscribe('collapse.group.hide', this._hideGroup.bind(this));
		},

		ready: function() {

			// Collapse events fix
			this.$toggleTrigger.on('change', this._onChange.bind(this));
			this.$toggleTrigger.on('click', this._onClick.bind(this));
			this.$collapseTarget.on('transitionend', this._onTransitionEnd.bind(this));
		},

		/**
			desc: Checks state of collapse. Returns `Boolean` value.
		*/
		isExpanded: function() {
			return this.$options.state === STATES.opened;
		},

		/**
			desc: Shows target content if it's hidden and hides if it's shown.
			args:
				show: Forces visibility state. Could be omitted - new state will be opposite to current.
		*/
		toggle: function(show) {
			//TODO need check for boolean or undefined not arguments
			this[(arguments.length ? show : (this.$options.state === STATES.closed)) ? 'show' : 'hide']();
		},

		/**
			desc: Shows target content.
		*/
		show: function() {
			if (this.$options.state === STATES.opened) {
				return;
			}
			this.$collapseTarget.show();
			this._setHeight();
			this.$collapseTarget.addClass(CLASSES.collapsing);
			this.$options.state = STATES.opened;
			this._setStateClass();
			this._setTriggerText();

			if (this.$options.group) {
				this.$tools.data.pubsub.publish('collapse.group.hide', {
					group: this.$options.group,
					excludeId: this.$options._ref
				});
			}
		},

		/**
			desc: Hides target content.
		*/
		hide: function() {
			if (this.$options.state === STATES.closed) {
				return;
			}

			requestAnimationFrame(function() {
				this._setHeight();

				requestAnimationFrame(function() {
					this.$collapseTarget.css('height', 0);
					this.$collapseTarget.addClass(CLASSES.collapsing);
					this.$options.state = STATES.closed;
					this._setStateClass();
					this._setTriggerText();
				}.bind(this));
			}.bind(this));
		},

		/**
			desc: Enables target collapse button.
		*/
		enable: function() {
			this.$el.removeAttr(ATTRIBUTES.disabledKey);
		},

		/**
			desc: Disables target collapse button.
		*/
		disable: function() {
			this.$el.attr(ATTRIBUTES.disabledKey, ATTRIBUTES.disabledValue);
		},

		_onClick: function(event) {
			if (!this.$el.is('input, select')) {
				this._toggle();
				if (!this.$el.is('label')) {
					event.preventDefault();
				}
			}
		},

		_onChange: function() {
			this._toggle();
		},

		_toggle: function() {
			this.toggle();
		},

		_setTriggerText: function() {
			var textContainer = this.$el;

			if (this.$options.readmore && this.$options.readless) {
				if (this.$elements.toggleText) {
					textContainer = this.$elements.toggleText;
				}

				textContainer.text(this.$options.state === STATES.closed ? this.$options.readmore : this.$options.readless);
			}
		},

		/*
		* Hides link if content is empty.
		* Call this function if content is loaded asynchronously.
		*
		* @return true - if content was hid, otherwise - false.
		*/
		_hideGroup: function(event, data) {
			if (this.$options._ref !== data.excludeId && this.$options.group === data.group) {
				this.hide();
			}
		},

		_setStateClass: function() {
			this.$el
				.toggleClass(CLASSES.collapsed, this.$options.state === STATES.closed)
				.toggleClass(CLASSES.expanded, this.$options.state === STATES.opened);
		},

		_setHeight: function() {
			this.$collapseTarget.css('height', this._getHeight());
		},

		_getHeight: function() {
			return this.$collapseContent.outerHeight(true);
		},

		_onTransitionEnd: function(event) {
			if ((event.propertyName !== animationName) && (event.originalEvent.propertyName !== animationName)) {
				return;
			}

			this.$collapseTarget.removeClass(CLASSES.collapsing);

			if (this.$options.state === STATES.opened) {
				this.$collapseTarget.css('height', 'auto');
			} else if (this.$options.state === STATES.closed) {
				this.$collapseTarget.hide();
			}

			this.$events.trigger(this.$options.state);
			this.$events.trigger('change', this.isExpanded());

		}
	};


/***/ },

/***/ 484:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		initialize: function() {
			this.$options.rangeSeparator = this.$options.rangeSeparator || ' - ';

			this._$clearButton = this.$el.find('[data-selector=clearDates]');
			this._$startDate = this.$el.find('[data-selector=startDate]');
			this._$endDate = this.$el.find('[data-selector=endDate]');
			this._$dateRange = this.$el.find('[data-selector=dateRange]');

			this._$clearButton.attr('title', this.$options.clearStatus);
		},

		toggleDisabled: function(condition) {
			this._$dateRange.prop('disabled', !condition);
			this._$startDate.prop('disabled', !condition);
			this._$endDate.prop('disabled', !condition);
			this.$el.toggleClass('datepicker--disabled', !condition);
		},

		getDates: function() {
			return {
				startDate: this._$startDate.val(),
				endDate: this._$endDate.val()
			};
		},

		reset: function() {
			if (this.$options.alwaysFilled) {
				this._setDates(new Date(this.$options.defaultStartDate), new Date(this.$options.defaultEndDate));

				return;
			}

			this._setDates(null, null);
		},

		_triggerChange: function() {
			this.$events.trigger('change', this.getDates());
		},

		_dateToString: function(date) {
			var MAX_LENGTH = 10;

			return date ? date.toISOString().slice(0, MAX_LENGTH) : '';
		},

		_getValidationAttributes: function() { // eslint-disable-line max-statements
			var attributes = {};

			attributes['data-val'] = true;
			attributes['data-val-date'] = this.$options.dateMessage;
			attributes['data-date-format'] = this.$options.dateFormat;
			attributes['data-separator'] = this.$options.rangeSeparator;

			if (this.$options.rangeSelect) {
				attributes['data-val-daterange'] = this.$options.daterangeMessage;
			}

			if (this.$options.minDate) {
				attributes['data-val-mindate'] = this.$options.minDateMessage;
				attributes['data-val-mindate-value'] = this.$options.minDate;
			}

			if (this.$options.maxDate) {
				attributes['data-val-maxdate'] = this.$options.maxDateMessage;
				attributes['data-val-maxdate-value'] = this.$options.maxDate;
			}

			if (this.$options.disabledDates) {
				attributes['data-val-disableddates'] = this.$options.disabledDatesMessage;
				attributes['data-val-disableddates-value'] = this.$options.disabledDates;
			}
			if (this.$options.enabledDates) {
				attributes['data-val-enableddates'] = this.$options.disabledDatesMessage;
				attributes['data-val-enableddates-value'] = this.$options.enabledDates;
			}

			if (this.$options.alwaysFilled) {
				attributes['data-val-required'] = this.$options.dateMessage;
			}

			return attributes;
		}
	};


/***/ },

/***/ 485:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(341);
	var baseDatepicker = __webpack_require__(484);
	var Picker = __webpack_require__(486);

	module.exports = tools.util.extend(true, {}, baseDatepicker, {
		events: {
			'click [data-selector=clearDates]': 'reset',
			'changeDate [data-selector=dateRange]': '_pickerChanged'
		},

		ready: function() {
			this.initializePicker();
		},

		initializePicker: function() {
			var attrs = this._getValidationAttributes();

			Object.keys(attrs).forEach(function(key) {
				this._$dateRange.attr(key, attrs[key]);
			}.bind(this));

			if (this._picker) {
				this._picker.destroy();
			}

			this._picker = new Picker(this._$dateRange, this.$options);

			this.reset();
		},

		_setDates: function(startDate, endDate) {
			var currentDates;

			this._picker.setDates(startDate, endDate);

			currentDates = this._picker.getDates();

			if (this.$options.alwaysFilled
				&& !currentDates.startDate
				&& !currentDates.endDate
				&& this.$options.defaultStartDate
			) {
				this.reset();

				return;
			}

			this._updateInputs(this._picker.getDates());

			this._toggleClear();

			this._triggerChange();
		},

		_updateInputs: function(dates) {
			this._$startDate.val(this._dateToString(dates.startDate));
			this._$endDate.val(this._dateToString(dates.endDate));
		},

		_toggleClear: function() {
			var isClearVisible = !(this._isEmpty() || this._isDefault());

			this.toggle('[data-selector=clearDates]', isClearVisible);
		},

		_isDefault: function() {
			var dates = this.getDates();

			return dates.startDate === this.$options.defaultStartDate &&
				dates.endDate === this.$options.defaultEndDate;
		},

		_isEmpty: function() {
			var dates = this.getDates();

			return !(dates.startDate || dates.endDate);
		},

		_isValidDates: function(dates) {
			return this.$options.rangeSelect ? Boolean(dates.startDate) === Boolean(dates.endDate) : true;
		},

		_pickerChanged: function(event) {
			var dates = event.detail || {};

			if (!dates.startDate && !dates.endDate) {
				this.reset();

				return;
			}

			if (!this._isValidDates(dates)) {
				return;
			}

			this._setDates(dates.startDate, dates.endDate);
		}
	});


/***/ },

/***/ 486:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	'use strict';

	var tools = __webpack_require__(341);
	var utils = __webpack_require__(487);
	var applyButtonTemplate = __webpack_require__(488);
	var datepick = __webpack_require__(489);

	function PluginWrapper($el, opts) { // eslint-disable-line max-statements
		this.$el = $el;

		this._options = {
			alignment: 'bottom',
			disabledClass: 'form-item--disabled',
			showAnim: '',
			changeMonth: false,
			onShow: this._tweakUI.bind(this),
			onClose: this._onDatepickerClose.bind(this)
		};

		tools.util.extend(true, this._options, opts);

		this._options.minDate = this._parseDate(this._options.minDate);
		this._options.maxDate = this._parseDate(this._options.maxDate);
		this._options.defaultStartDate = this._parseDate(this._options.defaultStartDate);
		this._options.defaultEndDate = this._parseDate(this._options.defaultEndDate);

		this._options.dateFormat = utils.dotNetToJs(this._options.dateFormat || '');

		this._options.monthNames = this._options.monthNames.split(',');
		this._options.monthNamesShort = this._options.monthNamesShort.split(',');
		this._options.dayNames = this._options.dayNames.split(',');
		this._options.dayNamesShort = this._options.dayNamesShort.split(',');
		this._options.dayNamesMin = this._options.dayNamesMin.split(',');

		if (this._options.disabledDates) {
			this._options.onDate = function(date) {
				var MAX_LENGTH = 10;
				var dateString = date.toISOString().slice(0, MAX_LENGTH);

				return {
					selectable: this._options.disabledDates.indexOf(dateString) === -1
				};
			}.bind(this);
		}

		if (this._options.enabledDates) {
			this._options.onDate = function(date) {
				var MAX_LENGTH = 10;
				var dateString = date.toISOString().slice(0, MAX_LENGTH);

				return {
					selectable: this._options.enabledDates.indexOf(dateString) !== -1
				};
			}.bind(this);
		}

		if (!this._options.rangeSelect) {
			this._options.onSelect = this._triggerValidation.bind(this);
		}

		$el.on('keydown', this._onKeydown.bind(this));
		$el.on('blur', this._onBlur.bind(this));

		$el.datepick(this._options);

		if (this._options.defaultStartDate || this._options.defaultEndDate) {
			this.setDates(this._options.defaultStartDate || this._options.defaultEndDate);
		}

		this._currentValue = this.$el.val();
	}

	PluginWrapper.prototype.getDates = function() {
		var dateFormat = this._options.dateFormat;
		var inputValue = this.$el.val() || '';
		var dates = this._splitDates(inputValue).map(function(dateString) {
			try {
				return datepick.parseDate(dateFormat, dateString);
			} catch (exc) {
				return null;
			}
		});

		return {
			startDate: dates[0],
			endDate: dates[1]
		};
	};

	PluginWrapper.prototype.setDates = function(startDate, endDate) {
		this.$el.datepick('setDate', startDate, endDate);

		this._currentValue = this.$el.val();
	};

	PluginWrapper.prototype.show = function() {
		this.$el.datepick('show');
	};

	PluginWrapper.prototype.hide = function() {
		this.$el.datepick('hide');
	};

	PluginWrapper.prototype._splitDates = function(datesText) {
		var separator = this._options.rangeSeparator.replace(/\s/g, '')
			.replace(/-/g, '\\-');
		var rgx = new RegExp('\\s*' + separator + '\\s*', 'g');

		return datesText.split(rgx);
	};

	PluginWrapper.prototype._parseDate = function(date) {
		return date && new Date(date);
	};

	PluginWrapper.prototype._tweakUI = function($picker) {
		this._$picker = $picker;

		if ($picker.find('.datepick-month.first .datepick-month-header').length) {
			$picker.find('.datepick-cmd-prev').prependTo('.datepick-month.first .datepick-month-header');
			$picker.find('.datepick-cmd-next').appendTo('.datepick-month.last .datepick-month-header');
		} else {
			$picker.find('.datepick-cmd-prev').prependTo('.datepick-month .datepick-month-header');
			$picker.find('.datepick-cmd-next').appendTo('.datepick-month .datepick-month-header');
		}

		$picker.find('.datepick-cmd-close')
			.click(this.hide.bind(this))
			.prependTo($picker.find('.datepick-nav'));

		if (this._options.rangeSelect) {
			$picker.find('.datepick-ctrl').prepend(applyButtonTemplate);

			$picker.find('[data-selector=applyButton]')
				.text(this._options.applyText)
				.on('click', this._apply.bind(this));
		} else {
			$picker.find('.datepick-ctrl').remove();
		}
	};

	PluginWrapper.prototype._updateState = function() {
		var value = this.$el.val();
		var event;

		if (this._currentValue === value) {
			return;
		}

		this._currentValue = value;

		event = new CustomEvent('changeDate', {
			bubbles: true,
			cancelable: true,
			detail: this.getDates()
		});
		this.$el[0].dispatchEvent(event);
	};

	PluginWrapper.prototype._onDatepickerClose = function() {
		/**
		 * Is called when datepicker is closed on any purpose:
		 *  - date was selected
		 *  - apply button was pressed (see _apply)
		 *  - "enter" was pressed (see _onKeydown)
		 *  - input has lost focus (see _onBlur)
		 *  - "close" button was clicked in popup
		 *  - datepicker.hide() method was called directly
		 *
		 * @private
		 */
		this._$picker = null;

		this._updateState();

		// just to remove focus from input after enter
		this.$el.trigger('blur');
	};

	/**
	 * Handles "apply" button click
	 *
	 * @private
	 */
	PluginWrapper.prototype._apply = function() {
		this.$el.datepick('apply');
		this._triggerValidation();
	};

	PluginWrapper.prototype._triggerValidation = function() {
		this.$el.trigger('keyup');
	};

	PluginWrapper.prototype._onKeydown = function(event) {
		var ENTER_KEY = 13;

		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		// just to remove focus from input after enter
		this.$el.trigger('blur');

		if (this._$picker) {
			// state is updated after close
			this.hide();
		}

		this._updateState();

		// just to remove focus from input after enter
		this.$el.trigger('blur');

		event.stopImmediatePropagation();
		event.preventDefault();
	};

	PluginWrapper.prototype._onBlur = function() {
		// click on datepicker popup
		if (this._$picker) {
			return;
		}

		this._updateState();
	};

	PluginWrapper.prototype.destroy = function() {
		this.$el.datepick('destroy');
	};

	module.exports = PluginWrapper;


/***/ },

/***/ 487:
/***/ function(module, exports) {

	'use strict';

	var RE = /(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)|./g;

	module.exports = {
		dotNetToJs: function(format) {
			var specifiers = format.match(RE) || [];

			return specifiers.map(function(specifier) {
				switch (specifier) {
					case 'ddd':
						return 'D';
					case 'dddd':
						return 'DD';
					case 'M':
						return 'm';
					case 'MM':
						return 'mm';
					case 'MMM':
						return 'M';
					case 'MMMM':
						return 'MM';
					case 'yy':
						return 'yy';
					case 'yyyy':
						return 'yyyy';
					default:
						return specifier;
				}
			}).join('');
		}
	};


/***/ },

/***/ 488:
/***/ function(module, exports) {

	module.exports = "<button class=\"button button--action button--small button--stretch\" data-selector=\"applyButton\"></button>"

/***/ },

/***/ 489:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* eslint-disable */
	/* http://keith-wood.name/datepick.html
	 Date picker for jQuery v5.0.1.
	 Written by Keith Wood (kbwood{at}iinet.com.au) February 2010.
	 Licensed under the MIT (http://keith-wood.name/licence.html) licence.
	 Please attribute the author if you use it. */

	__webpack_require__(490);

	(function(jQuery) { // Hide scope, no jQuery conflict

		var pluginName = 'datepick';

		/** Create the datepicker plugin.
		 <p>Sets an input field to popup a calendar for date entry,
		 or a <code>div</code> or <code>span</code> to show an inline calendar.</p>
		 <p>Expects HTML like:</p>
		 <pre>&lt;input type="text"> or &lt;div>&lt;/div></pre>
		 <p>Provide inline configuration like:</p>
		 <pre>&lt;input type="text" data-datepick="name: 'value'"/></pre>
		 @module Datepick
		 @augments JQPlugin
		 @example jQuery(selector).datepick()
		 jQuery(selector).datepick({minDate: 0, maxDate: '+1m +1w'}) */
		jQuery.JQPlugin.createPlugin({

			/** The name of the plugin. */
			name: pluginName,

			/** Default template for generating a datepicker.
			 Insert anywhere: '{l10n:name}' to insert localised value for name,
			 '{link:name}' to insert a link trigger for command name,
			 '{button:name}' to insert a button trigger for command name,
			 '{popup:start}...{popup:end}' to mark a section for inclusion in a popup datepicker only,
			 '{inline:start}...{inline:end}' to mark a section for inclusion in an inline datepicker only.
			 @property picker {string} Overall structure: '{months}' to insert calendar months.
			 @property monthRow {string} One row of months: '{months}' to insert calendar months.
			 @property month {string} A single month: '{monthHeader<em>:dateFormat</em>}' to insert the month header -
			 <em>dateFormat</em> is optional and defaults to 'MM yyyy',
			 '{weekHeader}' to insert a week header, '{weeks}' to insert the month's weeks.
			 @property weekHeader {string} A week header: '{days}' to insert individual day names.
			 @property dayHeader {string} Individual day header: '{day}' to insert day name.
			 @property week {string} One week of the month: '{days}' to insert the week's days,
			 '{weekOfYear}' to insert week of year.
			 @property day {string} An individual day: '{day}' to insert day value.
			 @property monthSelector {string} jQuery selector, relative to picker, for a single month.
			 @property daySelector {string} jQuery selector, relative to picker, for individual days.
			 @property rtlClass {string} Class for right-to-left (RTL) languages.
			 @property multiClass {string} Class for multi-month datepickers.
			 @property defaultClass {string} Class for selectable dates.
			 @property selectedClass {string} Class for currently selected dates.
			 @property highlightedClass {string} Class for highlighted dates.
			 @property todayClass {string} Class for today.
			 @property otherMonthClass {string} Class for days from other months.
			 @property weekendClass {string} Class for days on weekends.
			 @property commandClass {string} Class prefix for commands.
			 @property commandButtonClass {string} Extra class(es) for commands that are buttons.
			 @property commandLinkClass {string} Extra class(es) for commands that are links.
			 @property disabledClass {string} Class for disabled commands. */
			defaultRenderer: {
				picker: '<div class="datepick">' +
				'<div class="datepick-nav">{link:prev}{link:today}{link:next}</div>{months}' +
				'{popup:start}<div class="datepick-ctrl">{link:clear}{link:close}</div>{popup:end}' +
				'<div class="datepick-clear-fix"></div></div>',
				monthRow: '<div class="datepick-month-row">{months}</div>',
				month: '<div class="datepick-month"><div class="datepick-month-header">{monthHeader}</div>' +
				'<table><thead>{weekHeader}</thead><tbody>{weeks}</tbody></table></div>',
				weekHeader: '<tr>{days}</tr>',
				dayHeader: '<th>{day}</th>',
				week: '<tr>{days}</tr>',
				day: '<td>{day}</td>',
				monthSelector: '.datepick-month',
				daySelector: 'td',
				rtlClass: 'datepick-rtl',
				multiClass: 'datepick-multi',
				defaultClass: '',
				selectedClass: 'datepick-selected',
				highlightedClass: 'datepick-highlight',
				todayClass: 'datepick-today',
				otherMonthClass: 'datepick-other-month',
				weekendClass: 'datepick-weekend',
				commandClass: 'datepick-cmd',
				commandButtonClass: '',
				commandLinkClass: '',
				disabledClass: 'datepick-disabled'
			},

			/** Command actions that may be added to a layout by name.
			 <ul>
			 <li>prev - Show the previous month (based on <code>monthsToStep</code> option) - <em>PageUp</em></li>
			 <li>prevJump - Show the previous year (based on <code>monthsToJump</code> option) - <em>Ctrl+PageUp</em></li>
			 <li>next - Show the next month (based on <code>monthsToStep</code> option) - <em>PageDown</em></li>
			 <li>nextJump - Show the next year (based on <code>monthsToJump</code> option) - <em>Ctrl+PageDown</em></li>
			 <li>current - Show the currently selected month or today's if none selected - <em>Ctrl+Home</em></li>
			 <li>today - Show today's month - <em>Ctrl+Home</em></li>
			 <li>clear - Erase the date and close the datepicker popup - <em>Ctrl+End</em></li>
			 <li>close - Close the datepicker popup - <em>Esc</em></li>
			 <li>prevWeek - Move the cursor to the previous week - <em>Ctrl+Up</em></li>
			 <li>prevDay - Move the cursor to the previous day - <em>Ctrl+Left</em></li>
			 <li>nextDay - Move the cursor to the next day - <em>Ctrl+Right</em></li>
			 <li>nextWeek - Move the cursor to the next week - <em>Ctrl+Down</em></li>
			 </ul>
			 The command name is the key name and is used to add the command to a layout
			 with '{button:name}' or '{link:name}'. Each has the following attributes.
			 @property text {string} The field in the regional settings for the displayed text.
			 @property status {string} The field in the regional settings for the status text.
			 @property keystroke {object} The keystroke to trigger the action, with attributes:
			 <code>keyCode</code> {number} the code for the keystroke,
			 <code>ctrlKey</code> {boolean} <code>true</code> if <em>Ctrl</em> is required,
			 <code>altKey</code> {boolean} <code>true</code> if <em>Alt</em> is required,
			 <code>shiftKey</code> {boolean} <code>true</code> if <em>Shift</em> is required.
			 @property enabled {DatepickCommandEnabled} The function that indicates the command is enabled.
			 @property date {DatepickCommandDate} The function to get the date associated with this action.
			 @property action {DatepickCommandAction} The function that implements the action. */
			commands: {
				prev: {
					text: 'prevText', status: 'prevStatus', // Previous month
					keystroke: {keyCode: 33}, // Page up
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						return (!minDate || plugin.add(plugin.day(
							plugin._applyMonthsOffset(plugin.add(plugin.newDate(inst.drawDate),
								1 - inst.options.monthsToStep, 'm'), inst), 1), -1, 'd').getTime() >= minDate.getTime());
					},
					date: function(inst) {
						return plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), -inst.options.monthsToStep, 'm'), inst), 1);
					},
					action: function(inst) {
						plugin.changeMonth(this, -inst.options.monthsToStep);
					}
				},
				prevJump: {
					text: 'prevJumpText', status: 'prevJumpStatus', // Previous year
					keystroke: {keyCode: 33, ctrlKey: true}, // Ctrl + Page up
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						return (!minDate || plugin.add(plugin.day(
							plugin._applyMonthsOffset(plugin.add(plugin.newDate(inst.drawDate),
								1 - inst.options.monthsToJump, 'm'), inst), 1), -1, 'd').getTime() >= minDate.getTime());
					},
					date: function(inst) {
						return plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), -inst.options.monthsToJump, 'm'), inst), 1);
					},
					action: function(inst) {
						plugin.changeMonth(this, -inst.options.monthsToJump);
					}
				},
				next: {
					text: 'nextText', status: 'nextStatus', // Next month
					keystroke: {keyCode: 34}, // Page down
					enabled: function(inst) {
						var maxDate = inst.get('maxDate');
						return (!maxDate || plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), inst.options.monthsToStep, 'm'), inst), 1).getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), inst.options.monthsToStep, 'm'), inst), 1);
					},
					action: function(inst) {
						plugin.changeMonth(this, inst.options.monthsToStep);
					}
				},
				nextJump: {
					text: 'nextJumpText', status: 'nextJumpStatus', // Next year
					keystroke: {keyCode: 34, ctrlKey: true}, // Ctrl + Page down
					enabled: function(inst) {
						var maxDate = inst.get('maxDate');
						return (!maxDate || plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), inst.options.monthsToJump, 'm'), inst), 1).getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return plugin.day(plugin._applyMonthsOffset(plugin.add(
							plugin.newDate(inst.drawDate), inst.options.monthsToJump, 'm'), inst), 1);
					},
					action: function(inst) {
						plugin.changeMonth(this, inst.options.monthsToJump);
					}
				},
				current: {
					text: 'currentText', status: 'currentStatus', // Current month
					keystroke: {keyCode: 36, ctrlKey: true}, // Ctrl + Home
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						var maxDate = inst.get('maxDate');
						var curDate = inst.selectedDates[0] || plugin.today();
						return (!minDate || curDate.getTime() >= minDate.getTime()) &&
							(!maxDate || curDate.getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return inst.selectedDates[0] || plugin.today();
					},
					action: function(inst) {
						var curDate = inst.selectedDates[0] || plugin.today();
						plugin.showMonth(this, curDate.getFullYear(), curDate.getMonth() + 1);
					}
				},
				today: {
					text: 'todayText', status: 'todayStatus', // Today's month
					keystroke: {keyCode: 36, ctrlKey: true}, // Ctrl + Home
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						var maxDate = inst.get('maxDate');
						return (!minDate || plugin.today().getTime() >= minDate.getTime()) &&
							(!maxDate || plugin.today().getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return plugin.today();
					},
					action: function(inst) {
						plugin.showMonth(this);
					}
				},
				clear: {
					text: 'clearText', status: 'clearStatus', // Clear the datepicker
					keystroke: {keyCode: 35, ctrlKey: true}, // Ctrl + End
					enabled: function(inst) {
						return true;
					},
					date: function(inst) {
						return null;
					},
					action: function(inst) {
						plugin.clear(this);
					}
				},
				close: {
					text: 'closeText', status: 'closeStatus', // Close the datepicker
					keystroke: {keyCode: 27}, // Escape
					enabled: function(inst) {
						return true;
					},
					date: function(inst) {
						return null;
					},
					action: function(inst) {
						plugin.hide(this);
					}
				},
				prevWeek: {
					text: 'prevWeekText', status: 'prevWeekStatus', // Previous week
					keystroke: {keyCode: 38, ctrlKey: true}, // Ctrl + Up
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						return (!minDate || plugin.add(plugin.newDate(inst.drawDate), -7, 'd').getTime() >= minDate.getTime());
					},
					date: function(inst) {
						return plugin.add(plugin.newDate(inst.drawDate), -7, 'd');
					},
					action: function(inst) {
						plugin.changeDay(this, -7);
					}
				},
				prevDay: {
					text: 'prevDayText', status: 'prevDayStatus', // Previous day
					keystroke: {keyCode: 37, ctrlKey: true}, // Ctrl + Left
					enabled: function(inst) {
						var minDate = inst.curMinDate();
						return (!minDate || plugin.add(plugin.newDate(inst.drawDate), -1, 'd').getTime() >= minDate.getTime());
					},
					date: function(inst) {
						return plugin.add(plugin.newDate(inst.drawDate), -1, 'd');
					},
					action: function(inst) {
						plugin.changeDay(this, -1);
					}
				},
				nextDay: {
					text: 'nextDayText', status: 'nextDayStatus', // Next day
					keystroke: {keyCode: 39, ctrlKey: true}, // Ctrl + Right
					enabled: function(inst) {
						var maxDate = inst.get('maxDate');
						return (!maxDate || plugin.add(plugin.newDate(inst.drawDate), 1, 'd').getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return plugin.add(plugin.newDate(inst.drawDate), 1, 'd');
					},
					action: function(inst) {
						plugin.changeDay(this, 1);
					}
				},
				nextWeek: {
					text: 'nextWeekText', status: 'nextWeekStatus', // Next week
					keystroke: {keyCode: 40, ctrlKey: true}, // Ctrl + Down
					enabled: function(inst) {
						var maxDate = inst.get('maxDate');
						return (!maxDate || plugin.add(plugin.newDate(inst.drawDate), 7, 'd').getTime() <= maxDate.getTime());
					},
					date: function(inst) {
						return plugin.add(plugin.newDate(inst.drawDate), 7, 'd');
					},
					action: function(inst) {
						plugin.changeDay(this, 7);
					}
				}
			},

			/** Determine whether a command is enabled.
			 @callback DatepickCommandEnabled
			 @param inst {object} The current instance settings.
			 @return {boolean} <code>true</code> if this command is enabled, <code>false</code> if not.
			 @example enabled: function(inst) {
		return !!inst.curMinDate();
	 } */

			/** Calculate the representative date for a command.
			 @callback DatepickCommandDate
			 @param inst {object} The current instance settings.
			 @return {Date} A date appropriate for this command.
			 @example date: function(inst) {
		return inst.curMinDate();
	 } */

			/** Perform the action for a command.
			 @callback DatepickCommandAction
			 @param inst {object} The current instance settings.
			 @example date: function(inst) {
		jQuery.datepick.setDate(inst.elem, inst.curMinDate());
	 } */

			/** Calculate the week of the year for a date.
			 @callback DatepickCalculateWeek
			 @param date {Date} The date to evaluate.
			 @return {number} The week of the year.
			 @example calculateWeek: function(date) {
		return Math.floor((jQuery.datepick.dayOfYear(date) - 1) / 7) + 1;
	 } */

			/** Provide information about an individual date shown in the calendar.
			 @callback DatepickOnDate
			 @param date {Date} The date to evaluate.
			 @return {object} Information about that date, with the properties above.
			 @property selectable {boolean} <code>true</code> if this date can be selected.
			 @property dateClass {string} Class(es) to be applied to the date.
			 @property content {string} The date cell content.
			 @property tooltip {string} A popup tooltip for the date.
			 @example onDate: function(date) {
		return {selectable: date.getDay() > 0 && date.getDay() &lt; 5,
			dateClass: date.getDay() == 4 ? 'last-day' : ''};
	 } */

			/** Update the datepicker display.
			 @callback DatepickOnShow
			 @param picker {jQuery} The datepicker <code>div</code> to be shown.
			 @param inst {object} The current instance settings.
			 @example onShow: function(picker, inst) {
		picker.append('&lt;button type="button">Hi&lt;/button>').
			find('button:last').click(function() {
				alert('Hi!');
			});
	 } */

			/** React to navigating through the months/years.
			 @callback DatepickOnChangeMonthYear
			 @param year {number} The new year.
			 @param month {number} The new month (1 to 12).
			 @example onChangeMonthYear: function(year, month) {
		alert('Now in ' + month + '/' + year);
	 } */

			/** Datepicker on select callback.
			 Triggered when a date is selected.
			 @callback DatepickOnSelect
			 @param dates {Date[]} The selected date(s).
			 @example onSelect: function(dates) {
	 	alert('Selected ' + dates);
	 } */

			/** Datepicker on close callback.
			 Triggered when a popup calendar is closed.
			 @callback DatepickOnClose
			 @param dates {Date[]} The selected date(s).
			 @example onClose: function(dates) {
	 	alert('Selected ' + dates);
	 } */

			/** Default settings for the plugin.
			 @property [pickerClass=''] {string} CSS class to add to this instance of the datepicker.
			 @property [showOnFocus=true] {boolean} <code>true</code> for popup on focus, <code>false</code> for not.
			 @property [showTrigger=null] {string|Element|jQuery} Element to be cloned for a trigger, <code>null</code> for none.
			 @property [showAnim='show'] {string} Name of jQuery animation for popup, '' for no animation.
			 @property [showOptions=null] {object} Options for enhanced animations.
			 @property [showSpeed='normal'] {string} Duration of display/closure.
			 @property [popupContainer=null] {string|Element|jQuery} The element to which a popup calendar is added, <code>null</code> for body.
			 @property [alignment='bottom'] {string} Alignment of popup - with nominated corner of input:
			 'top' or 'bottom' aligns depending on language direction,
			 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
			 @property [fixedWeeks=false] {boolean} <code>true</code> to always show 6 weeks, <code>false</code> to only show as many as are needed.
			 @property [firstDay=0] {number} First day of the week, 0 = Sunday, 1 = Monday, etc.
			 @property [calculateWeek=this.iso8601Week] {DatepickCalculateWeek} Calculate week of the year from a date, <code>null</code> for ISO8601.
			 @property [monthsToShow=1] {number|number[]} How many months to show, cols or [rows, cols].
			 @property [monthsOffset=0] {number} How many months to offset the primary month by;
			 may be a function that takes the date and returns the offset.
			 @property [monthsToStep=1] {number} How many months to move when prev/next clicked.
			 @property [monthsToJump=12] {number} How many months to move when large prev/next clicked.
			 @property [useMouseWheel=true] {boolean} <code>true</code> to use mousewheel if available, <code>false</code> to never use it.
			 @property [changeMonth=true] {boolean} <code>true</code> to change month/year via drop-down, <code>false</code> for navigation only.
			 @property [yearRange='c-10:c+10'] {string} Range of years to show in drop-down: 'any' for direct text entry
			 or 'start:end', where start/end are '+-nn' for relative to today
			 or 'c+-nn' for relative to the currently selected date
			 or 'nnnn' for an absolute year.
			 @property [shortYearCutoff='+10'] {string} Cutoff for two-digit year in the current century.
			 @property [showOtherMonths=false] {boolean} <code>true</code> to show dates from other months, <code>false</code> to not show them.
			 @property [selectOtherMonths=false] {boolean} <code>true</code> to allow selection of dates from other months too.
			 @property [defaultDate=null] {string|number|Date} Date to show if no other selected.
			 @property [selectDefaultDate=false] {boolean} <code>true</code> to pre-select the default date if no other is chosen.
			 @property [minDate=null] {string|number|Date} The minimum selectable date.
			 @property [maxDate=null] {string|number|Date} The maximum selectable date.
			 @property [dateFormat='mm/dd/yyyy'] {string} Format for dates.
			 @property [autoSize=false] {boolean} <code>true</code> to size the input field according to the date format.
			 @property [rangeSelect=false] {boolean} Allows for selecting a date range on one date picker.
			 @property [rangeSeparator=' - '] {string} Text between two dates in a range.
			 @property [multiSelect=0] {number} Maximum number of selectable dates, zero for single select.
			 @property [multiSeparator=','] {string} Text between multiple dates.
			 @property [onDate=null] {DatepickOnDate} Callback as a date is added to the datepicker.
			 @property [onShow=null] {DatepickOnShow} Callback just before a datepicker is shown.
			 @property [onChangeMonthYear=null] {DatepickOnChangeMonthYear} Callback when a new month/year is selected.
			 @property [onSelect=null] {DatepickOnSelect} Callback when a date is selected.
			 @property [onClose=null] {DatepickOnClose} Callback when a datepicker is closed.
			 @property [altField=null] {string|Element|jQuery} Alternate field to update in synch with the datepicker.
			 @property [altFormat=null] {string} Date format for alternate field, defaults to <code>dateFormat</code>.
			 @property [constrainInput=true] {boolean} <code>true</code> to constrain typed input to <code>dateFormat</code> allowed characters.
			 @property [commandsAsDateFormat=false] {boolean} <code>true</code> to apply
			 <code><a href="#formatDate">formatDate</a></code> to the command texts.
			 @property [commands=this.commands] {object} Command actions that may be added to a layout by name. */
			defaultOptions: {
				pickerClass: '',
				showOnFocus: true,
				showTrigger: null,
				showAnim: 'show',
				showOptions: {},
				showSpeed: 'normal',
				popupContainer: null,
				alignment: 'bottom',
				fixedWeeks: false,
				firstDay: 0,
				calculateWeek: null, // this.iso8601Week,
				monthsToShow: 1,
				monthsOffset: 0,
				monthsToStep: 1,
				monthsToJump: 12,
				useMouseWheel: true,
				changeMonth: true,
				yearRange: 'c-10:c+10',
				shortYearCutoff: '+10',
				showOtherMonths: false,
				selectOtherMonths: false,
				defaultDate: null,
				selectDefaultDate: false,
				minDate: null,
				maxDate: null,
				dateFormat: 'mm/dd/yyyy',
				autoSize: false,
				rangeSelect: false,
				rangeSeparator: ' - ',
				multiSelect: 0,
				multiSeparator: ',',
				onDate: null,
				onShow: null,
				onChangeMonthYear: null,
				onSelect: null,
				onClose: null,
				altField: null,
				altFormat: null,
				constrainInput: true,
				commandsAsDateFormat: false,
				commands: {} // this.commands
			},

			/** Localisations for the plugin.
			 Entries are objects indexed by the language code ('' being the default US/English).
			 Each object has the following attributes.
			 @property [monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']]
			 The long names of the months.
			 @property [monthNamesShort=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']]
			 The short names of the months.
			 @property [dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']]
			 The long names of the days of the week.
			 @property [dayNamesShort=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']] The short names of the days of the week.
			 @property [dayNamesMin=['Su','Mo','Tu','We','Th','Fr','Sa']] The minimal names of the days of the week.
			 @property [dateFormat='mm/dd/yyyy'] {string} See options on <code><a href="#formatDate">formatDate</a></code>.
			 @property [firstDay=0] {number} The first day of the week, Sun = 0, Mon = 1, etc.
			 @property [renderer=this.defaultRenderer] {string} The rendering templates.
			 @property [prevText='&lt;Prev'] {string} Text for the previous month command.
			 @property [prevStatus='Show the previous month'] {string} Status text for the previous month command.
			 @property [prevJumpText='&lt;&lt;'] {string} Text for the previous year command.
			 @property [prevJumpStatus='Show the previous year'] {string} Status text for the previous year command.
			 @property [nextText='Next&gt;'] {string} Text for the next month command.
			 @property [nextStatus='Show the next month'] {string} Status text for the next month command.
			 @property [nextJumpText='&gt;&gt;'] {string} Text for the next year command.
			 @property [nextJumpStatus='Show the next year'] {string} Status text for the next year command.
			 @property [currentText='Current'] {string} Text for the current month command.
			 @property [currentStatus='Show the current month'] {string} Status text for the current month command.
			 @property [todayText='Today'] {string} Text for the today's month command.
			 @property [todayStatus='Show today\'s month'] {string} Status text for the today's month command.
			 @property [clearText='Clear'] {string} Text for the clear command.
			 @property [clearStatus='Clear all the dates'] {string} Status text for the clear command.
			 @property [closeText='Close'] {string} Text for the close command.
			 @property [closeStatus='Close the datepicker'] {string} Status text for the close command.
			 @property [yearStatus='Change the year'] {string} Status text for year selection.
			 @property [earlierText='&#160;&#160;▲'] {string} Text for earlier years.
			 @property [laterText='&#160;&#160;▼'] {string} Text for later years.
			 @property [monthStatus='Change the month'] {string} Status text for month selection.
			 @property [weekText='Wk'] {string} Text for week of the year column header.
			 @property [weekStatus='Week of the year'] {string} Status text for week of the year column header.
			 @property [dayStatus='Select DD,&#160;M&#160;d,&#160;yyyy'] {string} Status text for selectable days.
			 @property [defaultStatus='Select a date'] {string} Status text shown by default.
			 @property [isRTL=false] {boolean} <code>true</code> if language is right-to-left. */
			regionalOptions: { // Available regional settings, indexed by language/country code
				'': { // Default regional settings - English/US
					monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
						'July', 'August', 'September', 'October', 'November', 'December'],
					monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
					dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					dateFormat: 'mm/dd/yyyy',
					firstDay: 0,
					renderer: {}, // this.defaultRenderer
					prevText: '&lt;Prev',
					prevStatus: 'Show the previous month',
					prevJumpText: '&lt;&lt;',
					prevJumpStatus: 'Show the previous year',
					nextText: 'Next&gt;',
					nextStatus: 'Show the next month',
					nextJumpText: '&gt;&gt;',
					nextJumpStatus: 'Show the next year',
					currentText: 'Current',
					currentStatus: 'Show the current month',
					todayText: 'Today',
					todayStatus: 'Show today\'s month',
					clearText: 'Clear',
					clearStatus: 'Clear all the dates',
					closeText: 'Close',
					closeStatus: 'Close the datepicker',
					yearStatus: 'Change the year',
					earlierText: '&#160;&#160;▲',
					laterText: '&#160;&#160;▼',
					monthStatus: 'Change the month',
					weekText: 'Wk',
					weekStatus: 'Week of the year',
					dayStatus: 'Select DD, M d, yyyy',
					defaultStatus: 'Select a date',
					isRTL: false
				}
			},

			/** Names of getter methods - those that can't be chained. */
			_getters: ['getDate', 'isDisabled', 'isSelectable', 'retrieveDate'],

			_disabled: [],

			_popupClass: pluginName + '-popup', // Marker for popup division
			_triggerClass: pluginName + '-trigger', // Marker for trigger element
			_disableClass: pluginName + '-disable', // Marker for disabled element
			_monthYearClass: pluginName + '-month-year', // Marker for month/year inputs
			_curMonthClass: pluginName + '-month-', // Marker for current month/year
			_anyYearClass: pluginName + '-any-year', // Marker for year direct input
			_curDoWClass: pluginName + '-dow-', // Marker for day of week

			_ticksTo1970: ((((1970 - 1) * 365) + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
			Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),
			_msPerDay: 24 * 60 * 60 * 1000,

			/** The date format for use with Atom (RFC 3339/ISO 8601). */
			ATOM: 'yyyy-mm-dd',
			/** The date format for use with cookies. */
			COOKIE: 'D, dd M yyyy',
			/** The date format for full display. */
			FULL: 'DD, MM d, yyyy',
			/** The date format for use with ISO 8601. */
			ISO_8601: 'yyyy-mm-dd',
			/** The date format for Julian dates. */
			JULIAN: 'J',
			/** The date format for use with RFC 822. */
			RFC_822: 'D, d M yy',
			/** The date format for use with RFC 850. */
			RFC_850: 'DD, dd-M-yy',
			/** The date format for use with RFC 1036. */
			RFC_1036: 'D, d M yy',
			/** The date format for use with RFC 1123. */
			RFC_1123: 'D, d M yyyy',
			/** The date format for use with RFC 2822. */
			RFC_2822: 'D, d M yyyy',
			/** The date format for use with RSS (RFC 822). */
			RSS: 'D, d M yy',
			/** The date format for Windows ticks. */
			TICKS: '!',
			/** The date format for Unix timestamp. */
			TIMESTAMP: '@',
			/** The date format for use with W3C (ISO 8601). */
			W3C: 'yyyy-mm-dd',

			/** Format a date object into a string value.
			 The format can be combinations of the following:
			 <ul>
			 <li>d  - day of month (no leading zero)</li>
			 <li>dd - day of month (two digit)</li>
			 <li>o  - day of year (no leading zeros)</li>
			 <li>oo - day of year (three digit)</li>
			 <li>D  - day name short</li>
			 <li>DD - day name long</li>
			 <li>w  - week of year (no leading zero)</li>
			 <li>ww - week of year (two digit)</li>
			 <li>m  - month of year (no leading zero)</li>
			 <li>mm - month of year (two digit)</li>
			 <li>M  - month name short</li>
			 <li>MM - month name long</li>
			 <li>yy - year (two digit)</li>
			 <li>yyyy - year (four digit)</li>
			 <li>@  - Unix timestamp (s since 01/01/1970)</li>
			 <li>!  - Windows ticks (100ns since 01/01/0001)</li>
			 <li>'...' - literal text</li>
			 <li>'' - single quote</li>
			 </ul>
			 @param [format=dateFormat] {string} The desired format of the date.
			 @param date {Date} The date value to format.
			 @param [settings] {object} With the properties shown below.
			 @property [dayNamesShort] {string[]} Abbreviated names of the days from Sunday.
			 @property [dayNames] {string[]} Names of the days from Sunday.
			 @property [monthNamesShort] {string[]} Abbreviated names of the months.
			 @property [monthNames] {string[]} Names of the months.
			 @property [calculateWeek] {DatepickCalculateWeek} Function that determines week of the year.
			 @return {string} The date in the above format.
			 @example var display = jQuery.datepick.formatDate('yyyy-mm-dd', new Date(2014, 12-1, 25)) */
			formatDate: function(format, date, settings) {
				if (typeof format !== 'string') {
					settings = date;
					date = format;
					format = '';
				}
				if (!date) {
					return '';
				}
				format = format || this.defaultOptions.dateFormat;
				settings = settings || {};
				var dayNamesShort = settings.dayNamesShort || this.defaultOptions.dayNamesShort;
				var dayNames = settings.dayNames || this.defaultOptions.dayNames;
				var monthNamesShort = settings.monthNamesShort || this.defaultOptions.monthNamesShort;
				var monthNames = settings.monthNames || this.defaultOptions.monthNames;
				var calculateWeek = settings.calculateWeek || this.defaultOptions.calculateWeek;
				// Check whether a format character is doubled
				var doubled = function(match, step) {
					var matches = 1;
					while (iFormat + matches < format.length && format.charAt(iFormat + matches) === match) {
						matches++;
					}
					iFormat += matches - 1;
					return Math.floor(matches / (step || 1)) > 1;
				};
				// Format a number, with leading zeroes if necessary
				var formatNumber = function(match, value, len, step) {
					var num = '' + value;
					if (doubled(match, step)) {
						while (num.length < len) {
							num = '0' + num;
						}
					}
					return num;
				};
				// Format a name, short or long as requested
				var formatName = function(match, value, shortNames, longNames) {
					return (doubled(match) ? longNames[value] : shortNames[value]);
				};
				var output = '';
				var literal = false;
				for (var iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !doubled("'")) {
							literal = false;
						} else {
							output += format.charAt(iFormat);
						}
					} else {
						switch (format.charAt(iFormat)) {
							case 'd':
								output += formatNumber('d', date.getDate(), 2);
								break;
							case 'D':
								output += formatName('D', date.getDay(),
									dayNamesShort, dayNames);
								break;
							case 'o':
								output += formatNumber('o', this.dayOfYear(date), 3);
								break;
							case 'w':
								output += formatNumber('w', calculateWeek(date), 2);
								break;
							case 'm':
								output += formatNumber('m', date.getMonth() + 1, 2);
								break;
							case 'M':
								output += formatName('M', date.getMonth(),
									monthNamesShort, monthNames);
								break;
							case 'y':
								output += (doubled('y', 2) ? date.getFullYear() :
								(date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100));
								break;
							case '@':
								output += Math.floor(date.getTime() / 1000);
								break;
							case '!':
								output += (date.getTime() * 10000) + this._ticksTo1970;
								break;
							case "'":
								if (doubled("'")) {
									output += "'";
								} else {
									literal = true;
								}
								break;
							default:
								output += format.charAt(iFormat);
						}
					}
				}
				return output;
			},

			/** Parse a string value into a date object.
			 See <code><a href="#formatDate">formatDate</a></code> for the possible formats, plus:
			 <ul>
			 <li>* - ignore rest of string</li>
			 </ul>
			 @param format {string} The expected format of the date ('' for default datepicker format).
			 @param value {string} The date in the above format.
			 @param [settings] {object} With the properties shown above.
			 @property [shortYearCutoff] {number} the cutoff year for determining the century.
			 @property [dayNamesShort] {string[]} abbreviated names of the days from Sunday.
			 @property [dayNames] {string[]} names of the days from Sunday.
			 @property [monthNamesShort] {string[]} abbreviated names of the months.
			 @property [monthNames] {string[]} names of the months.
			 @return {Date} The extracted date value or <code>null</code> if value is blank.
			 @throws Errors if the format and/or value are missing, if the value doesn't match the format,
			 or if the date is invalid.
			 @example var date = jQuery.datepick.parseDate('dd/mm/yyyy', '25/12/2014') */
			parseDate: function(format, value, settings) {
				if (value == null) {
					throw 'Invalid arguments';
				}
				value = (typeof value === 'object' ? value.toString() : value + '');
				if (value === '') {
					return null;
				}
				format = format || this.defaultOptions.dateFormat;
				settings = settings || {};
				var shortYearCutoff = settings.shortYearCutoff || this.defaultOptions.shortYearCutoff;
				shortYearCutoff = (typeof shortYearCutoff !== 'string' ? shortYearCutoff :
				(this.today().getFullYear() % 100) + parseInt(shortYearCutoff, 10));
				var dayNamesShort = settings.dayNamesShort || this.defaultOptions.dayNamesShort;
				var dayNames = settings.dayNames || this.defaultOptions.dayNames;
				var monthNamesShort = settings.monthNamesShort || this.defaultOptions.monthNamesShort;
				var monthNames = settings.monthNames || this.defaultOptions.monthNames;
				var year = -1;
				var month = -1;
				var day = -1;
				var doy = -1;
				var shortYear = false;
				var literal = false;
				// Check whether a format character is doubled
				var doubled = function(match, step) {
					var matches = 1;
					while (iFormat + matches < format.length && format.charAt(iFormat + matches) === match) {
						matches++;
					}
					iFormat += matches - 1;
					return Math.floor(matches / (step || 1)) > 1;
				};
				// Extract a number from the string value
				var getNumber = function(match, step) {
					var isDoubled = doubled(match, step);
					var size = [2, 3, isDoubled ? 4 : 2, 11, 20]['oy@!'.indexOf(match) + 1];
					var digits = new RegExp('^-?\\d{1,' + size + '}');
					var num = value.substring(iValue).match(digits);
					if (!num) {
						throw 'Missing number at position {0}'.replace(/\{0\}/, iValue);
					}
					iValue += num[0].length;
					return parseInt(num[0], 10);
				};
				// Extract a name from the string value and convert to an index
				var getName = function(match, shortNames, longNames, step) {
					var names = (doubled(match, step) ? longNames : shortNames);
					for (var i = 0; i < names.length; i++) {
						if (value.substr(iValue, names[i].length).toLowerCase() === names[i].toLowerCase()) {
							iValue += names[i].length;
							return i + 1;
						}
					}
					throw 'Unknown name at position {0}'.replace(/\{0\}/, iValue);
				};
				// Confirm that a literal character matches the string value
				var checkLiteral = function() {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw 'Unexpected literal at position {0}'.replace(/\{0\}/, iValue);
					}
					iValue++;
				};
				var iValue = 0;
				for (var iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !doubled("'")) {
							literal = false;
						} else {
							checkLiteral();
						}
					} else {
						switch (format.charAt(iFormat)) {
							case 'd':
								day = getNumber('d');
								break;
							case 'D':
								getName('D', dayNamesShort, dayNames);
								break;
							case 'o':
								doy = getNumber('o');
								break;
							case 'w':
								getNumber('w');
								break;
							case 'm':
								month = getNumber('m');
								break;
							case 'M':
								month = getName('M', monthNamesShort, monthNames);
								break;
							case 'y':
								var iSave = iFormat;
								shortYear = !doubled('y', 2);
								iFormat = iSave;
								year = getNumber('y', 2);
								break;
							case '@':
								var date = this._normaliseDate(new Date(getNumber('@') * 1000));
								year = date.getFullYear();
								month = date.getMonth() + 1;
								day = date.getDate();
								break;
							case '!':
								var date = this._normaliseDate(
									new Date((getNumber('!') - this._ticksTo1970) / 10000));
								year = date.getFullYear();
								month = date.getMonth() + 1;
								day = date.getDate();
								break;
							case '*':
								iValue = value.length;
								break;
							case "'":
								if (doubled("'")) {
									checkLiteral();
								} else {
									literal = true;
								}
								break;
							default:
								checkLiteral();
						}
					}
				}
				if (iValue < value.length) {
					throw 'Additional text found at end';
				}
				if (year === -1) {
					year = this.today().getFullYear();
				} else if (year < 100 && shortYear) {
					year += (shortYearCutoff === -1 ? 1900 : this.today().getFullYear() -
					(this.today().getFullYear() % 100) - (year <= shortYearCutoff ? 0 : 100));
				}
				if (doy > -1) {
					month = 1;
					day = doy;
					for (var dim = this.daysInMonth(year, month); day > dim;
					     dim = this.daysInMonth(year, month)) {
						month++;
						day -= dim;
					}
				}
				var date = this.newDate(year, month, day);
				if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
					throw 'Invalid date';
				}
				return date;
			},

			/** A date may be specified as an exact value or a relative one.
			 @param dateSpec {Date|number|string} The date as an object or string
			 in the given format or an offset - numeric days from today,
			 or string amounts and periods, e.g. '+1m +2w'.
			 @param defaultDate {Date} The date to use if no other supplied, may be <code>null</code>.
			 @param [currentDate] {Date} The current date as a possible basis for relative dates,
			 if <code>null</code> today is used.
			 @param dateFormat {string} The expected date format - see <code><a href="#formatDate">formatDate</a></code>.
			 @param settings {object} With the properties shown above.
			 @property [shortYearCutoff] {number} The cutoff year for determining the century.
			 @property [dayNamesShort] {string[]} Abbreviated names of the days from Sunday.
			 @property [dayNames] {string[]} Names of the days from Sunday.
			 @property [monthNamesShort] {string[]} Abbreviated names of the months.
			 @property [monthNames] {string[]} Names of the months.
			 @return {Date} The decoded date.
			 @example jQuery.datepick.determineDate('+1m +2w', new Date()) */
			determineDate: function(dateSpec, defaultDate, currentDate, dateFormat, settings) {
				if (currentDate && typeof currentDate !== 'object') {
					settings = dateFormat;
					dateFormat = currentDate;
					currentDate = null;
				}
				if (typeof dateFormat !== 'string') {
					settings = dateFormat;
					dateFormat = '';
				}
				var offsetString = function(offset) {
					try {
						return plugin.parseDate(dateFormat, offset, settings);
					} catch (e) {
						// Ignore
					}
					offset = offset.toLowerCase();
					var date = (offset.match(/^c/) && currentDate ? plugin.newDate(currentDate) : null) ||
						plugin.today();
					var pattern = /([+-]?[0-9]+)\s*(d|w|m|y)?/g;
					var matches = null;
					while (matches = pattern.exec(offset)) {
						date = plugin.add(date, parseInt(matches[1], 10), matches[2] || 'd');
					}
					return date;
				};
				defaultDate = (defaultDate ? plugin.newDate(defaultDate) : null);
				dateSpec = (dateSpec == null ? defaultDate :
					(typeof dateSpec === 'string' ? offsetString(dateSpec) : (typeof dateSpec === 'number' ?
						(isNaN(dateSpec) || dateSpec === Infinity || dateSpec === -Infinity ? defaultDate :
							plugin.add(plugin.today(), dateSpec, 'd')) : plugin.newDate(dateSpec))));
				return dateSpec;
			},

			/** Find the number of days in a given month.
			 @param year {Date|number} The date to get days for or the full year.
			 @param month {number} The month (1 to 12).
			 @return {number} The number of days in this month.
			 @example var days = jQuery.datepick.daysInMonth(2014, 12) */
			daysInMonth: function(year, month) {
				month = (year.getFullYear ? year.getMonth() + 1 : month);
				year = (year.getFullYear ? year.getFullYear() : year);
				return this.newDate(year, month + 1, 0).getDate();
			},

			/** Calculate the day of the year for a date.
			 @param year {Date|number} The date to get the day-of-year for or the full year.
			 @param month {number} The month (1-12).
			 @param day {number} The day.
			 @return {number} The day of the year.
			 @example var doy = jQuery.datepick.dayOfYear(2014, 12, 25) */
			dayOfYear: function(year, month, day) {
				var date = (year.getFullYear ? year : plugin.newDate(year, month, day));
				var newYear = plugin.newDate(date.getFullYear(), 1, 1);
				return Math.floor((date.getTime() - newYear.getTime()) / plugin._msPerDay) + 1;
			},

			/** Set as <code>calculateWeek</code> to determine the week of the year based on the ISO 8601 definition.
			 @param year {Date|number} The date to get the week for or the full year.
			 @param month {number} The month (1-12).
			 @param day {number} The day.
			 @return {number} The number of the week within the year that contains this date.
			 @example var week = jQuery.datepick.iso8601Week(2014, 12, 25) */
			iso8601Week: function(year, month, day) {
				var checkDate = (year.getFullYear ?
					new Date(year.getTime()) : plugin.newDate(year, month, day));
				// Find Thursday of this week starting on Monday
				checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
				var time = checkDate.getTime();
				checkDate.setMonth(0, 1); // Compare with Jan 1
				return Math.floor(Math.round((time - checkDate) / plugin._msPerDay) / 7) + 1;
			},

			/** Return today's date.
			 @return {Date} Today.
			 @example jQuery.datepick.today() */
			today: function() {
				return this._normaliseDate(new Date());
			},

			/** Return a new date.
			 @param year {Date|number} The date to clone or the year.
			 @param month {number} The month (1-12).
			 @param day {number} The day.
			 @return {Date} The date.
			 @example jQuery.datepick.newDate(oldDate)
			 jQuery.datepick.newDate(2014, 12, 25) */
			newDate: function(year, month, day) {
				return (!year ? null : (year.getFullYear ? this._normaliseDate(new Date(year.getTime())) :
					new Date(year, month - 1, day, 12)));
			},

			/** Standardise a date into a common format - time portion is 12 noon.
			 @private
			 @param date {Date} The date to standardise.
			 @return {Date} The normalised date. */
			_normaliseDate: function(date) {
				if (date) {
					date.setHours(12, 0, 0, 0);
				}
				return date;
			},

			/** Set the year for a date.
			 @param date {Date} The original date.
			 @param year {number} The new year.
			 @return {Date} The updated date.
			 @example jQuery.datepick.year(date, 2014) */
			year: function(date, year) {
				date.setFullYear(year);
				return this._normaliseDate(date);
			},

			/** Set the month for a date.
			 @param date  {Date} The original date.
			 @param month {number} The new month (1-12).
			 @return {Date} The updated date.
			 @example jQuery.datepick.month(date, 12) */
			month: function(date, month) {
				date.setMonth(month - 1);
				return this._normaliseDate(date);
			},

			/** Set the day for a date.
			 @param date {Date} The original date.
			 @param day {number} The new day of the month.
			 @return {Date} The updated date.
			 @example jQuery.datepick.day(date, 25) */
			day: function(date, day) {
				date.setDate(day);
				return this._normaliseDate(date);
			},

			/** Add a number of periods to a date.
			 @param date {Date} The original date.
			 @param amount {number} The number of periods.
			 @param period {string} The type of period d/w/m/y.
			 @return {Date} The updated date.
			 @example jQuery.datepick.add(date, 10, 'd') */
			add: function(date, amount, period) {
				if (period === 'd' || period === 'w') {
					this._normaliseDate(date);
					date.setDate(date.getDate() + (amount * (period === 'w' ? 7 : 1)));
				} else {
					var year = date.getFullYear() + (period === 'y' ? amount : 0);
					var month = date.getMonth() + (period === 'm' ? amount : 0);
					date.setTime(plugin.newDate(year, month + 1,
						Math.min(date.getDate(), this.daysInMonth(year, month + 1))).getTime());
				}
				return date;
			},

			/** Apply the months offset value to a date.
			 @private
			 @param date {Date} The original date.
			 @param inst {object} The current instance settings.
			 @return {Date} The updated date. */
			_applyMonthsOffset: function(date, inst) {
				var monthsOffset = inst.options.monthsOffset;
				if (jQuery.isFunction(monthsOffset)) {
					monthsOffset = monthsOffset.apply(inst.elem[0], [date]);
				}
				return plugin.add(date, -monthsOffset, 'm');
			},

			_init: function() {
				this.defaultOptions.commands = this.commands;
				this.defaultOptions.calculateWeek = this.iso8601Week;
				this.regionalOptions[''].renderer = this.defaultRenderer;
				this._super();
			},

			_instSettings: function(elem, options) {
				return {
					selectedDates: [], drawDate: null, pickingRange: false,
					inline: (jQuery.inArray(elem[0].nodeName.toLowerCase(), ['div', 'span']) > -1),
					get: function(name) { // Get a setting value, computing if necessary
						if (jQuery.inArray(name, ['defaultDate', 'minDate', 'maxDate']) > -1) { // Decode date settings
							return plugin.determineDate(this.options[name], null,
								this.selectedDates[0], this.options.dateFormat, this.getConfig());
						}
						return this.options[name];
					},
					curMinDate: function() {
						return (this.pickingRange ? this.selectedDates[0] : this.get('minDate'));
					},
					getConfig: function() {
						return {
							dayNamesShort: this.options.dayNamesShort, dayNames: this.options.dayNames,
							monthNamesShort: this.options.monthNamesShort, monthNames: this.options.monthNames,
							calculateWeek: this.options.calculateWeek,
							shortYearCutoff: this.options.shortYearCutoff
						};
					}
				};
			},

			_postAttach: function(elem, inst) {
				if (inst.inline) {
					inst.drawDate = plugin._checkMinMax(plugin.newDate(inst.selectedDates[0] ||
						inst.get('defaultDate') || plugin.today()), inst);
					inst.prevDate = plugin.newDate(inst.drawDate);
					this._update(elem[0]);
					if (jQuery.fn.mousewheel) {
						elem.mousewheel(this._doMouseWheel);
					}
				} else {
					this._attachments(elem, inst);
					elem.on('keydown.' + inst.name, this._keyDown).on('keypress.' + inst.name, this._keyPress).on('keyup.' + inst.name, this._keyUp);
					if (elem.attr('disabled')) {
						this.disable(elem[0]);
					}
				}
			},

			_optionsChanged: function(elem, inst, options) {
				if (options.calendar && options.calendar !== inst.options.calendar) {
					var discardDate = function(name) {
						return (typeof inst.options[name] === 'object' ? null : inst.options[name]);
					};
					options = jQuery.extend({
						defaultDate: discardDate('defaultDate'),
						minDate: discardDate('minDate'), maxDate: discardDate('maxDate')
					}, options);
					inst.selectedDates = [];
					inst.drawDate = null;
				}
				var dates = inst.selectedDates;
				jQuery.extend(inst.options, options);
				this.setDate(elem[0], dates, null, false, true);
				inst.pickingRange = false;
				inst.drawDate = plugin.newDate(this._checkMinMax(
					(inst.options.defaultDate ? inst.get('defaultDate') : inst.drawDate) ||
					inst.get('defaultDate') || plugin.today(), inst));
				if (!inst.inline) {
					this._attachments(elem, inst);
				}
				if (inst.inline || inst.div) {
					this._update(elem[0]);
				}
			},

			/** Attach events and trigger, if necessary.
			 @private
			 @param elem {jQuery} The control to affect.
			 @param inst {object} The current instance settings. */
			_attachments: function(elem, inst) {
				elem.off('focus.' + inst.name);
				if (inst.options.showOnFocus) {
					elem.on('focus.' + inst.name, this.show);
				}
				if (inst.trigger) {
					inst.trigger.remove();
				}
				var trigger = inst.options.showTrigger;
				inst.trigger = (!trigger ? jQuery([]) :
					jQuery(trigger).clone().removeAttr('id').addClass(this._triggerClass)
						[inst.options.isRTL ? 'insertBefore' : 'insertAfter'](elem).click(function() {
							if (!plugin.isDisabled(elem[0])) {
								plugin[plugin.curInst === inst ? 'hide' : 'show'](elem[0]);
							}
						}));
				this._autoSize(elem, inst);
				var dates = this._extractDates(inst, elem.val());
				if (dates) {
					this.setDate(elem[0], dates, null, true);
				}
				var defaultDate = inst.get('defaultDate');
				if (inst.options.selectDefaultDate && defaultDate && inst.selectedDates.length === 0) {
					this.setDate(elem[0], plugin.newDate(defaultDate || plugin.today()));
				}
			},

			/** Apply the maximum length for the date format.
			 @private
			 @param elem {jQuery} The control to affect.
			 @param inst {object} The current instance settings. */
			_autoSize: function(elem, inst) {
				if (inst.options.autoSize && !inst.inline) {
					var date = plugin.newDate(2009, 10, 20); // Ensure double digits
					var dateFormat = inst.options.dateFormat;
					if (dateFormat.match(/[DM]/)) {
						var findMax = function(names) {
							var max = 0;
							var maxI = 0;
							for (var i = 0; i < names.length; i++) {
								if (names[i].length > max) {
									max = names[i].length;
									maxI = i;
								}
							}
							return maxI;
						};
						date.setMonth(findMax(inst.options[dateFormat.match(/MM/) ? // Longest month
							'monthNames' : 'monthNamesShort']));
						date.setDate(findMax(inst.options[dateFormat.match(/DD/) ? // Longest day
								'dayNames' : 'dayNamesShort']) + 20 - date.getDay());
					}
					inst.elem.attr('size', plugin.formatDate(dateFormat, date, inst.getConfig()).length);
				}
			},

			_preDestroy: function(elem, inst) {
				if (inst.trigger) {
					inst.trigger.remove();
				}
				elem.empty().off('.' + inst.name);
				if (inst.inline && jQuery.fn.mousewheel) {
					elem.unmousewheel();
				}
				if (!inst.inline && inst.options.autoSize) {
					elem.removeAttr('size');
				}
			},

			/** Apply multiple event functions.
			 @param fns {function} The functions to apply.
			 @example onShow: multipleEvents(fn1, fn2, ...) */
			multipleEvents: function(fns) {
				var funcs = arguments;
				return function(args) {
					for (var i = 0; i < funcs.length; i++) {
						funcs[i].apply(this, arguments);
					}
				};
			},

			/** Enable the control.
			 @param elem {Element} The control to affect.
			 @example jQuery(selector).datepick('enable') */
			enable: function(elem) {
				elem = jQuery(elem);
				if (!elem.hasClass(this._getMarker())) {
					return;
				}
				var inst = this._getInst(elem);
				if (inst.inline) {
					elem.children('.' + this._disableClass).remove().end().find('button,select').prop('disabled', false).end().find('a').attr('href', 'javascript:void(0)');
				} else {
					elem.prop('disabled', false);
					inst.trigger.filter('button.' + this._triggerClass).prop('disabled', false).end().filter('img.' + this._triggerClass).css({
						opacity: '1.0',
						cursor: ''
					});
				}
				this._disabled = jQuery.map(this._disabled,
					function(value) {
						return (value === elem[0] ? null : value);
					}); // Delete entry
			},

			/** Disable the control.
			 @param elem {Element} The control to affect.
			 @example jQuery(selector).datepick('disable') */
			disable: function(elem) {
				elem = jQuery(elem);
				if (!elem.hasClass(this._getMarker())) {
					return;
				}
				var inst = this._getInst(elem);
				if (inst.inline) {
					var inline = elem.children(':last');
					var offset = inline.offset();
					var relOffset = {left: 0, top: 0};
					inline.parents().each(function() {
						if (jQuery(this).css('position') === 'relative') {
							relOffset = jQuery(this).offset();
							return false;
						}
					});
					var zIndex = elem.css('zIndex');
					zIndex = (zIndex === 'auto' ? 0 : parseInt(zIndex, 10)) + 1;
					elem.prepend('<div class="' + this._disableClass + '" style="' +
						'width: ' + inline.outerWidth() + 'px; height: ' + inline.outerHeight() +
						'px; left: ' + (offset.left - relOffset.left) + 'px; top: ' +
						(offset.top - relOffset.top) + 'px; z-index: ' + zIndex + '"></div>').find('button,select').prop('disabled', true).end().find('a').removeAttr('href');
				} else {
					elem.prop('disabled', true);
					inst.trigger.filter('button.' + this._triggerClass).prop('disabled', true).end().filter('img.' + this._triggerClass).css({
						opacity: '0.5',
						cursor: 'default'
					});
				}
				this._disabled = jQuery.map(this._disabled,
					function(value) {
						return (value === elem[0] ? null : value);
					}); // Delete entry
				this._disabled.push(elem[0]);
			},

			/** Is the first field in a jQuery collection disabled as a datepicker?
			 @param elem {Element} The control to examine.
			 @return {boolean} <code>true</code> if disabled, <code>false</code> if enabled.
			 @example if (jQuery(selector).datepick('isDisabled')) {...} */
			isDisabled: function(elem) {
				return (elem && jQuery.inArray(elem, this._disabled) > -1);
			},

			/** Show a popup datepicker.
			 @param elem {Event|Element} a focus event or the control to use.
			 @example jQuery(selector).datepick('show') */
			show: function(elem) {
				elem = jQuery(elem.target || elem);
				var inst = plugin._getInst(elem);
				if (plugin.curInst === inst) {
					return;
				}
				if (plugin.curInst) {
					plugin.hide(plugin.curInst, true);
				}
				if (!jQuery.isEmptyObject(inst)) {
					// Retrieve existing date(s)
					inst.lastVal = null;
					inst.selectedDates = plugin._extractDates(inst, elem.val());
					inst.pickingRange = false;
					inst.drawDate = plugin._checkMinMax(plugin.newDate(inst.selectedDates[0] ||
						inst.get('defaultDate') || plugin.today()), inst);
					inst.prevDate = plugin.newDate(inst.drawDate);
					plugin.curInst = inst;
					// Generate content
					plugin._update(elem[0], true);
					// Adjust position before showing
					var offset = plugin._checkOffset(inst);
					inst.div.css({left: offset.left, top: offset.top});
					// And display
					var showAnim = inst.options.showAnim;
					var showSpeed = inst.options.showSpeed;
					showSpeed = (showSpeed === 'normal' && jQuery.ui &&
					parseInt(jQuery.ui.version.substring(2)) >= 8 ? '_default' : showSpeed);
					if (jQuery.effects && (jQuery.effects[showAnim] || (jQuery.effects.effect && jQuery.effects.effect[showAnim]))) {
						var data = inst.div.data(); // Update old effects data
						for (var key in data) {
							if (key.match(/^ec\.storage\./)) {
								data[key] = inst._mainDiv.css(key.replace(/ec\.storage\./, ''));
							}
						}
						inst.div.data(data).show(showAnim, inst.options.showOptions, showSpeed);
					} else {
						inst.div[showAnim || 'show'](showAnim ? showSpeed : 0);
					}
				}
			},

			/** Extract possible dates from a string.
			 @private
			 @param inst {object} The current instance settings.
			 @param text {string} The text to extract from.
			 @return {Date[]} The extracted dates. */
			_extractDates: function(inst, datesText) {
				if (datesText === inst.lastVal) {
					return;
				}
				inst.lastVal = datesText;
				datesText = datesText.split(inst.options.multiSelect ? inst.options.multiSeparator :
					(inst.options.rangeSelect ? inst.options.rangeSeparator : '\x00'));
				var dates = [];
				for (var i = 0; i < datesText.length; i++) {
					try {
						var date = plugin.parseDate(inst.options.dateFormat, datesText[i], inst.getConfig());
						if (date) {
							var found = false;
							for (var j = 0; j < dates.length; j++) {
								if (dates[j].getTime() === date.getTime()) {
									found = true;
									break;
								}
							}
							if (!found) {
								dates.push(date);
							}
						}
					} catch (e) {
						// Ignore
					}
				}
				dates.splice(inst.options.multiSelect || (inst.options.rangeSelect ? 2 : 1), dates.length);
				if (inst.options.rangeSelect && dates.length === 1) {
					dates[1] = dates[0];
				}
				return dates;
			},

			/** Update the datepicker display.
			 @private
			 @param elem {Event|Element} a focus event or the control to use.
			 @param hidden {boolean} <code>true</code> to initially hide the datepicker. */
			_update: function(elem, hidden) {
				elem = jQuery(elem.target || elem);
				var inst = plugin._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					if (inst.inline || plugin.curInst === inst) {
						if (jQuery.isFunction(inst.options.onChangeMonthYear) && (!inst.prevDate ||
							inst.prevDate.getFullYear() !== inst.drawDate.getFullYear() ||
							inst.prevDate.getMonth() !== inst.drawDate.getMonth())) {
							inst.options.onChangeMonthYear.apply(elem[0],
								[inst.drawDate.getFullYear(), inst.drawDate.getMonth() + 1]);
						}
					}
					if (inst.inline) {
						var index = jQuery('a, :input', elem).index(jQuery(':focus', elem));
						elem.html(this._generateContent(elem[0], inst));
						var focus = elem.find('a, :input');
						focus.eq(Math.max(Math.min(index, focus.length - 1), 0)).focus();
					} else if (plugin.curInst === inst) {
						if (!inst.div) {
							inst.div = jQuery('<div></div>').addClass(this._popupClass).css({
								display: (hidden ? 'none' : 'static'), position: 'absolute',
								left: elem.offset().left, top: elem.offset().top + elem.outerHeight()
							}).appendTo(jQuery(inst.options.popupContainer || 'body'));
							if (jQuery.fn.mousewheel) {
								inst.div.mousewheel(this._doMouseWheel);
							}
						}
						inst.div.html(this._generateContent(elem[0], inst));
						elem.focus();
					}
				}
			},

			/** Update the input field and any alternate field with the current dates.
			 @private
			 @param elem {Element} The control to use.
			 @param keyUp {boolean} <code>true</code> if coming from <code>keyUp</code> processing (internal). */
			_updateInput: function(elem, keyUp) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					var value = '';
					var altValue = '';
					var sep = (inst.options.multiSelect ? inst.options.multiSeparator :
						inst.options.rangeSeparator);
					var altFormat = inst.options.altFormat || inst.options.dateFormat;
					for (var i = 0; i < inst.selectedDates.length; i++) {
						value += (keyUp ? '' : (i > 0 ? sep : '') + plugin.formatDate(
							inst.options.dateFormat, inst.selectedDates[i], inst.getConfig()));
						altValue += (i > 0 ? sep : '') + plugin.formatDate(
								altFormat, inst.selectedDates[i], inst.getConfig());
					}
					if (!inst.inline && !keyUp) {
						jQuery(elem).val(value);
					}
					jQuery(inst.options.altField).val(altValue);
					if (jQuery.isFunction(inst.options.onSelect) && !keyUp && !inst.inSelect) {
						inst.inSelect = true; // Prevent endless loops
						inst.options.onSelect.apply(elem, [inst.selectedDates]);
						inst.inSelect = false;
					}
				}
			},

			/** Retrieve the size of left and top borders for an element.
			 @private
			 @param elem {jQuery} The element of interest.
			 @return {number[]} The left and top borders. */
			_getBorders: function(elem) {
				var convert = function(value) {
					return {thin: 1, medium: 3, thick: 5}[value] || value;
				};
				return [parseFloat(convert(elem.css('border-left-width'))),
					parseFloat(convert(elem.css('border-top-width')))];
			},

			/** Check positioning to remain on the screen.
			 @private
			 @param inst {object} The current instance settings.
			 @return {object} The updated offset for the datepicker. */
			_checkOffset: function(inst) {
				var base = (inst.elem.is(':hidden') && inst.trigger ? inst.trigger : inst.elem);
				var offset = base.offset();
				var browserWidth = jQuery(window).width();
				var browserHeight = jQuery(window).height();
				if (browserWidth === 0) {
					return offset;
				}
				var isFixed = false;
				jQuery(inst.elem).parents().each(function() {
					isFixed |= jQuery(this).css('position') === 'fixed';
					return !isFixed;
				});
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var above = offset.top - (isFixed ? scrollY : 0) - inst.div.outerHeight();
				var below = offset.top - (isFixed ? scrollY : 0) + base.outerHeight();
				var alignL = offset.left - (isFixed ? scrollX : 0);
				var alignR = offset.left - (isFixed ? scrollX : 0) + base.outerWidth() - inst.div.outerWidth();
				var tooWide = (offset.left - scrollX + inst.div.outerWidth()) > browserWidth;
				var tooHigh = (offset.top - scrollY + inst.elem.outerHeight() +
					inst.div.outerHeight()) > browserHeight;
				inst.div.css('position', isFixed ? 'fixed' : 'absolute');

				if (tooWide) {
					inst.div.addClass('datepick--position-left');
				}

				var alignment = inst.options.alignment;
				if (alignment === 'topLeft') {
					offset = {left: alignL, top: above};
				} else if (alignment === 'topRight') {
					offset = {left: alignR, top: above};
				} else if (alignment === 'bottomLeft') {
					offset = {left: alignL, top: below};
				} else if (alignment === 'bottomRight') {
					offset = {left: alignR, top: below};
				} else if (alignment === 'bottom') {
					offset = {left: (inst.options.isRTL || tooWide ? alignR : alignL), top: below};
				} else { // top
					offset = {
						left: (inst.options.isRTL || tooWide ? alignR : alignL),
						top: (tooHigh ? above : below)
					};
				}
				offset.left = Math.max((isFixed ? 0 : scrollX), offset.left);
				offset.top = Math.max((isFixed ? 0 : scrollY), offset.top);
				return offset;
			},

			/** Close date picker if clicked elsewhere.
			 @private
			 @param event {MouseEvent} The mouse click to check. */
			_checkExternalClick: function(event) {
				if (!plugin.curInst) {
					return;
				}
				var elem = jQuery(event.target);
				if (elem.closest('.' + plugin._popupClass + ',.' + plugin._triggerClass).length === 0 && !elem.hasClass(plugin._getMarker())) {
					plugin.hide(plugin.curInst);
				}
			},

			/** Hide a popup datepicker.
			 @param elem {Element|object} The control to use or the current instance settings.
			 @param immediate {boolean} <code>true</code> to close immediately without animation (internal).
			 @example jQuery(selector).datepick('hide') */
			hide: function(elem, immediate) {
				if (!elem) {
					return;
				}
				var inst = this._getInst(elem);
				if (jQuery.isEmptyObject(inst)) {
					inst = elem;
				}
				if (inst && inst === plugin.curInst) {
					var showAnim = (immediate ? '' : inst.options.showAnim);
					var showSpeed = inst.options.showSpeed;
					showSpeed = (showSpeed === 'normal' && jQuery.ui &&
					parseInt(jQuery.ui.version.substring(2)) >= 8 ? '_default' : showSpeed);
					var postProcess = function() {
						if (!inst.div) {
							return;
						}
						inst.div.remove();
						inst.div = null;
						plugin.curInst = null;
						if (jQuery.isFunction(inst.options.onClose)) {
							inst.options.onClose.apply(elem, [inst.selectedDates]);
						}
					};
					inst.div.stop();
					if (jQuery.effects && (jQuery.effects[showAnim] || (jQuery.effects.effect && jQuery.effects.effect[showAnim]))) {
						inst.div.hide(showAnim, inst.options.showOptions, showSpeed, postProcess);
					} else {
						var hideAnim = (showAnim === 'slideDown' ? 'slideUp' :
							(showAnim === 'fadeIn' ? 'fadeOut' : 'hide'));
						inst.div[hideAnim]((showAnim ? showSpeed : ''), postProcess);
					}
					if (!showAnim) {
						postProcess();
					}
				}
			},

			/** Handle keystrokes in the datepicker.
			 @private
			 @param event {KeyEvent} The keystroke.
			 @return {boolean} <code>true</code> if not handled, <code>false</code> if handled. */
			_keyDown: function(event) {
				var elem = (event.data && event.data.elem) || event.target;
				var inst = plugin._getInst(elem);
				var handled = false;
				if (inst.inline || inst.div) {
					if (event.keyCode === 9) { // Tab - close
						plugin.hide(elem);
					} else if (event.keyCode === 13) { // Enter - select
						plugin.selectDate(elem,
							jQuery('a.' + inst.options.renderer.highlightedClass, inst.div)[0]);
						handled = true;
					} else { // Command keystrokes
						var commands = inst.options.commands;
						for (var name in commands) {
							var command = commands[name];
							if (command.keystroke.keyCode === event.keyCode &&
								!!command.keystroke.ctrlKey === !!(event.ctrlKey || event.metaKey) &&
								!!command.keystroke.altKey === event.altKey &&
								!!command.keystroke.shiftKey === event.shiftKey) {
								plugin.performAction(elem, name);
								handled = true;
								break;
							}
						}
					}
				} else { // Show on 'current' keystroke
					var command = inst.options.commands.current;
					if (command.keystroke.keyCode === event.keyCode &&
						!!command.keystroke.ctrlKey === !!(event.ctrlKey || event.metaKey) &&
						!!command.keystroke.altKey === event.altKey &&
						!!command.keystroke.shiftKey === event.shiftKey) {
						plugin.show(elem);
						handled = true;
					}
				}
				inst.ctrlKey = ((event.keyCode < 48 && event.keyCode !== 32) || event.ctrlKey || event.metaKey);
				if (handled) {
					event.preventDefault();
					event.stopPropagation();
				}
				return !handled;
			},

			/** Filter keystrokes in the datepicker.
			 @private
			 @param event {KeyEvent} The keystroke.
			 @return {boolean} <code>true</code> if allowed, <code>false</code> if not allowed. */
			_keyPress: function(event) {
				var inst = plugin._getInst((event.data && event.data.elem) || event.target);
				if (!jQuery.isEmptyObject(inst) && inst.options.constrainInput) {
					var ch = String.fromCharCode(event.keyCode || event.charCode);
					var allowedChars = plugin._allowedChars(inst);
					return (event.metaKey || inst.ctrlKey || ch < ' ' || !allowedChars || allowedChars.indexOf(ch) > -1);
				}
				return true;
			},

			/** Determine the set of characters allowed by the date format.
			 @private
			 @param inst {object} The current instance settings.
			 @return {string} The set of allowed characters, or <code>null</code> if anything allowed. */
			_allowedChars: function(inst) {
				var allowedChars = (inst.options.multiSelect ? inst.options.multiSeparator :
					(inst.options.rangeSelect ? inst.options.rangeSeparator : ''));
				var literal = false;
				var hasNum = false;
				var dateFormat = inst.options.dateFormat;
				for (var i = 0; i < dateFormat.length; i++) {
					var ch = dateFormat.charAt(i);
					if (literal) {
						if (ch === "'" && dateFormat.charAt(i + 1) !== "'") {
							literal = false;
						} else {
							allowedChars += ch;
						}
					} else {
						switch (ch) {
							case 'd':
							case 'm':
							case 'o':
							case 'w':
								allowedChars += (hasNum ? '' : '0123456789');
								hasNum = true;
								break;
							case 'y':
							case '@':
							case '!':
								allowedChars += (hasNum ? '' : '0123456789') + '-';
								hasNum = true;
								break;
							case 'J':
								allowedChars += (hasNum ? '' : '0123456789') + '-.';
								hasNum = true;
								break;
							case 'D':
							case 'M':
							case 'Y':
								return null; // Accept anything
							case "'":
								if (dateFormat.charAt(i + 1) === "'") {
									allowedChars += "'";
								} else {
									literal = true;
								}
								break;
							default:
								allowedChars += ch;
						}
					}
				}
				return allowedChars;
			},

			/** Synchronise datepicker with the field.
			 @private
			 @param event {KeyEvent} The keystroke.
			 @return {boolean} <code>true</code> if allowed, <code>false</code> if not allowed. */
			_keyUp: function(event) {
				var elem = (event.data && event.data.elem) || event.target;
				var inst = plugin._getInst(elem);
				if (!jQuery.isEmptyObject(inst) && !inst.ctrlKey && inst.lastVal !== inst.elem.val()) {
					try {
						var dates = plugin._extractDates(inst, inst.elem.val());
						if (dates.length > 0) {
							plugin.setDate(elem, dates, null, true);
						}
					} catch (event) {
						// Ignore
					}
				}
				return true;
			},

			/** Increment/decrement month/year on mouse wheel activity.
			 @private
			 @param event {event} The mouse wheel event.
			 @param delta {number} The amount of change. */
			_doMouseWheel: function(event, delta) {
				var elem = (plugin.curInst && plugin.curInst.elem[0]) ||
					jQuery(event.target).closest('.' + plugin._getMarker())[0];
				if (plugin.isDisabled(elem)) {
					return;
				}
				var inst = plugin._getInst(elem);
				if (inst.options.useMouseWheel) {
					delta = (delta < 0 ? -1 : +1);
					plugin.changeMonth(elem, -inst.options[event.ctrlKey ? 'monthsToJump' : 'monthsToStep'] * delta);
				}
				event.preventDefault();
			},

			/** Clear an input and close a popup datepicker.
			 @param elem {Element} The control to use.
			 @example jQuery(selector).datepick('clear') */
			clear: function(elem) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					inst.selectedDates = [];
					this.hide(elem);
					var defaultDate = inst.get('defaultDate');
					if (inst.options.selectDefaultDate && defaultDate) {
						this.setDate(elem, plugin.newDate(defaultDate || plugin.today()));
					} else {
						this._updateInput(elem);
					}
				}
			},

			/** Retrieve the selected date(s) for a datepicker.
			 @param elem {Element} The control to examine.
			 @return {Date[]} The selected date(s).
			 @example var dates = jQuery(selector).datepick('getDate') */
			getDate: function(elem) {
				var inst = this._getInst(elem);
				return (!jQuery.isEmptyObject(inst) ? inst.selectedDates : []);
			},

			/** Set the selected date(s) for a datepicker.
			 @param elem {Element} the control to examine.
			 @param dates {Date|number|string|array} the selected date(s).
			 @param [endDate] {Date|number|string} the ending date for a range.
			 @param keyUp {boolean} <code>true</code> if coming from <code>keyUp</code> processing (internal).
			 @param setOpt {boolean} <code>true</code> if coming from option processing (internal).
			 @example jQuery(selector).datepick('setDate', new Date(2014, 12-1, 25))
			 jQuery(selector).datepick('setDate', '12/25/2014', '01/01/2015')
			 jQuery(selector).datepick('setDate', [date1, date2, date3]) */
			setDate: function(elem, dates, endDate, keyUp, setOpt) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					if (!jQuery.isArray(dates)) {
						dates = [dates];
						if (endDate) {
							dates.push(endDate);
						}
					}
					var minDate = inst.get('minDate');
					var maxDate = inst.get('maxDate');
					var curDate = inst.selectedDates[0];
					inst.selectedDates = [];
					for (var i = 0; i < dates.length; i++) {
						var date = plugin.determineDate(
							dates[i], null, curDate, inst.options.dateFormat, inst.getConfig());
						if (date) {
							if ((!minDate || date.getTime() >= minDate.getTime()) &&
								(!maxDate || date.getTime() <= maxDate.getTime())) {
								var found = false;
								for (var j = 0; j < inst.selectedDates.length; j++) {
									if (inst.selectedDates[j].getTime() === date.getTime()) {
										found = true;
										break;
									}
								}
								if (!found) {
									inst.selectedDates.push(date);
								}
							}
						}
					}
					inst.selectedDates.splice(inst.options.multiSelect ||
						(inst.options.rangeSelect ? 2 : 1), inst.selectedDates.length);
					if (inst.options.rangeSelect) {
						switch (inst.selectedDates.length) {
							case 1:
								inst.selectedDates[1] = inst.selectedDates[0];
								break;
							case 2:
								inst.selectedDates[1] =
									(inst.selectedDates[0].getTime() > inst.selectedDates[1].getTime() ?
										inst.selectedDates[0] : inst.selectedDates[1]);
								break;
						}
						inst.pickingRange = false;
					}
					inst.prevDate = (inst.drawDate ? plugin.newDate(inst.drawDate) : null);
					inst.drawDate = this._checkMinMax(plugin.newDate(inst.selectedDates[0] ||
						inst.get('defaultDate') || plugin.today()), inst);
					if (!setOpt) {
						this._update(elem);
						this._updateInput(elem, keyUp);
					}
				}
			},

			/** Determine whether a date is selectable for this datepicker.
			 @private
			 @param elem {Element} The control to check.
			 @param date {Date|string|number} The date to check.
			 @return {boolean} <code>true</code> if selectable, <code>false</code> if not.
			 @example var selectable = jQuery(selector).datepick('isSelectable', date) */
			isSelectable: function(elem, date) {
				var inst = this._getInst(elem);
				if (jQuery.isEmptyObject(inst)) {
					return false;
				}
				date = plugin.determineDate(date, inst.selectedDates[0] || this.today(), null,
					inst.options.dateFormat, inst.getConfig());
				return this._isSelectable(elem, date, inst.options.onDate,
					inst.get('minDate'), inst.get('maxDate'));
			},

			/** Internally determine whether a date is selectable for this datepicker.
			 @private
			 @param elem {Element} the control to check.
			 @param date {Date} The date to check.
			 @param onDate {function|boolean} Any onDate callback or callback.selectable.
			 @param minDate {Date} The minimum allowed date.
			 @param maxDate {Date} The maximum allowed date.
			 @return {boolean} <code>true</code> if selectable, <code>false</code> if not. */
			_isSelectable: function(elem, date, onDate, minDate, maxDate) {
				var dateInfo = (typeof onDate === 'boolean' ? {selectable: onDate} :
					(!jQuery.isFunction(onDate) ? {} : onDate.apply(elem, [date, true])));
				return (dateInfo.selectable !== false) &&
					(!minDate || date.getTime() >= minDate.getTime()) &&
					(!maxDate || date.getTime() <= maxDate.getTime());
			},

			/** Perform a named action for a datepicker.
			 @param elem {element} The control to affect.
			 @param action {string} The name of the action. */
			performAction: function(elem, action) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst) && !this.isDisabled(elem)) {
					var commands = inst.options.commands;
					if (commands[action] && commands[action].enabled.apply(elem, [inst])) {
						commands[action].action.apply(elem, [inst]);
					}
				}
			},

			/** Set the currently shown month, defaulting to today's.
			 @param elem {Element} The control to affect.
			 @param [year] {number} The year to show.
			 @param [month] {number} The month to show (1-12).
			 @param [day] {number} The day to show.
			 @example jQuery(selector).datepick('showMonth', 2014, 12, 25) */
			showMonth: function(elem, year, month, day) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst) && (day != null ||
					(inst.drawDate.getFullYear() !== year || inst.drawDate.getMonth() + 1 !== month))) {
					inst.prevDate = plugin.newDate(inst.drawDate);
					var show = this._checkMinMax((year != null ?
						plugin.newDate(year, month, 1) : plugin.today()), inst);
					inst.drawDate = plugin.newDate(show.getFullYear(), show.getMonth() + 1,
						(day != null ? day : Math.min(inst.drawDate.getDate(),
							plugin.daysInMonth(show.getFullYear(), show.getMonth() + 1))));
					this._update(elem);
				}
			},

			/** Adjust the currently shown month.
			 @param elem {Element} The control to affect.
			 @param offset {number} The number of months to change by.
			 @example jQuery(selector).datepick('changeMonth', 2)*/
			changeMonth: function(elem, offset) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					var date = plugin.add(plugin.newDate(inst.drawDate), offset, 'm');
					this.showMonth(elem, date.getFullYear(), date.getMonth() + 1);
				}
			},

			/** Adjust the currently shown day.
			 @param elem {Element} The control to affect.
			 @param offset {number} The number of days to change by.
			 @example jQuery(selector).datepick('changeDay', 7)*/
			changeDay: function(elem, offset) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst)) {
					var date = plugin.add(plugin.newDate(inst.drawDate), offset, 'd');
					this.showMonth(elem, date.getFullYear(), date.getMonth() + 1, date.getDate());
				}
			},

			/** Restrict a date to the minimum/maximum specified.
			 @private
			 @param date {Date} The date to check.
			 @param inst {object} The current instance settings. */
			_checkMinMax: function(date, inst) {
				var minDate = inst.get('minDate');
				var maxDate = inst.get('maxDate');
				date = (minDate && date.getTime() < minDate.getTime() ? plugin.newDate(minDate) : date);
				date = (maxDate && date.getTime() > maxDate.getTime() ? plugin.newDate(maxDate) : date);
				return date;
			},

			/** Retrieve the date associated with an entry in the datepicker.
			 @param elem {Element} The control to examine.
			 @param target {Element} The selected datepicker element.
			 @return {Date} The corresponding date, or <code>null</code>.
			 @example var date = jQuery(selector).datepick('retrieveDate', jQuery('div.datepick-popup a:contains(10)')[0]) */
			retrieveDate: function(elem, target) {
				var inst = this._getInst(elem);
				return (jQuery.isEmptyObject(inst) ? null : this._normaliseDate(
					new Date(parseInt(target.className.replace(/^.*dp(-?\d+).*$/, '$1'), 10))));
			},

			/** Select a date for this datepicker.
			 @param elem {Element} The control to examine.
			 @param target {Element} The selected datepicker element.
			 @example jQuery(selector).datepick('selectDate', jQuery('div.datepick-popup a:contains(10)')[0]) */
			selectDate: function(elem, target) {
				var inst = this._getInst(elem);
				if (!jQuery.isEmptyObject(inst) && !this.isDisabled(elem)) {
					var date = this.retrieveDate(elem, target);
					if (inst.options.multiSelect) {
						var found = false;
						for (var i = 0; i < inst.selectedDates.length; i++) {
							if (date.getTime() === inst.selectedDates[i].getTime()) {
								inst.selectedDates.splice(i, 1);
								found = true;
								break;
							}
						}
						if (!found && inst.selectedDates.length < inst.options.multiSelect) {
							inst.selectedDates.push(date);
						}
					} else if (inst.options.rangeSelect) {
						if (inst.pickingRange) {
							inst.selectedDates[1] = date;
						} else {
							inst.selectedDates = [date, date];
						}
						inst.pickingRange = !inst.pickingRange;
					} else {
						inst.selectedDates = [date];
					}

					// --- start ---
					// Fix for OneScreen Datepicker
					if (inst.options.rangeSelect) {
						inst.prevDate = plugin.newDate(date);
						this._update(elem);

						return;
					}
					// --- end ---

					inst.prevDate = inst.drawDate = plugin.newDate(date);
					this._updateInput(elem);
					if (inst.inline || inst.pickingRange || inst.selectedDates.length <
						(inst.options.multiSelect || (inst.options.rangeSelect ? 2 : 1))) {
						this._update(elem);
					} else {
						this.hide(elem);
					}
				}
			},

			/** Generate the datepicker content for this control.
			 @private
			 @param elem {Element} The control to affect.
			 @param inst {object} The current instance settings.
			 @return {jQuery} The datepicker content */
			_generateContent: function(elem, inst) {
				var monthsToShow = inst.options.monthsToShow;
				monthsToShow = (jQuery.isArray(monthsToShow) ? monthsToShow : [1, monthsToShow]);
				inst.drawDate = this._checkMinMax(
					inst.drawDate || inst.get('defaultDate') || plugin.today(), inst);
				var drawDate = plugin._applyMonthsOffset(plugin.newDate(inst.drawDate), inst);
				// Generate months
				var monthRows = '';
				for (var row = 0; row < monthsToShow[0]; row++) {
					var months = '';
					for (var col = 0; col < monthsToShow[1]; col++) {
						months += this._generateMonth(elem, inst, drawDate.getFullYear(),
							drawDate.getMonth() + 1, inst.options.renderer, (row === 0 && col === 0));
						plugin.add(drawDate, 1, 'm');
					}
					monthRows += this._prepare(inst.options.renderer.monthRow, inst).replace(/\{months\}/, months);
				}
				var picker = this._prepare(inst.options.renderer.picker, inst).replace(/\{months\}/, monthRows).replace(/\{weekHeader\}/g, this._generateDayHeaders(inst, inst.options.renderer));
				// Add commands
				var addCommand = function(type, open, close, name, classes) {
					if (picker.indexOf('{' + type + ':' + name + '}') === -1) {
						return;
					}
					var command = inst.options.commands[name];
					var date = (inst.options.commandsAsDateFormat ? command.date.apply(elem, [inst]) : null);
					picker = picker.replace(new RegExp('\\{' + type + ':' + name + '\\}', 'g'),
						'<' + open + (command.status ? ' title="' + inst.options[command.status] + '"' : '') +
						' class="' + inst.options.renderer.commandClass + ' ' +
						inst.options.renderer.commandClass + '-' + name + ' ' + classes +
						(command.enabled(inst) ? '' : ' ' + inst.options.renderer.disabledClass) + '">' +
						(date ? plugin.formatDate(inst.options[command.text], date, inst.getConfig()) :
							inst.options[command.text]) + '</' + close + '>');
				};
				for (var name in inst.options.commands) {
					addCommand('button', 'button type="button"', 'button', name,
						inst.options.renderer.commandButtonClass);
					addCommand('link', 'a href="javascript:void(0)"', 'a', name,
						inst.options.renderer.commandLinkClass);
				}
				picker = jQuery(picker);
				if (monthsToShow[1] > 1) {
					var count = 0;
					jQuery(inst.options.renderer.monthSelector, picker).each(function() {
						var nth = ++count % monthsToShow[1];
						jQuery(this).addClass(nth === 1 ? 'first' : (nth === 0 ? 'last' : ''));
					});
				}
				// Add datepicker behaviour
				var self = this;

				function removeHighlight() {
					(inst.inline ? jQuery(this).closest('.' + self._getMarker()) : inst.div).find(inst.options.renderer.daySelector + ' a').removeClass(inst.options.renderer.highlightedClass);
				}

				picker.find(inst.options.renderer.daySelector + ' a').hover(
					function() {
						removeHighlight.apply(this);
						jQuery(this).addClass(inst.options.renderer.highlightedClass);
					},
					removeHighlight).click(function() {
						self.selectDate(elem, this);
					}).end().find('select.' + this._monthYearClass + ':not(.' + this._anyYearClass + ')').change(function() {
						var monthYear = jQuery(this).val().split('/');
						self.showMonth(elem, parseInt(monthYear[1], 10), parseInt(monthYear[0], 10));
					}).end().find('select.' + this._anyYearClass).click(function() {
						jQuery(this).css('visibility', 'hidden').next('input').css({
							left: this.offsetLeft, top: this.offsetTop,
							width: this.offsetWidth, height: this.offsetHeight
						}).show().focus();
					}).end().find('input.' + self._monthYearClass).change(function() {
						try {
							var year = parseInt(jQuery(this).val(), 10);
							year = (isNaN(year) ? inst.drawDate.getFullYear() : year);
							self.showMonth(elem, year, inst.drawDate.getMonth() + 1, inst.drawDate.getDate());
						} catch (e) {
							console.error(e);
						}
					}).keydown(function(event) {
						if (event.keyCode === 13) { // Enter
							jQuery(event.elem).change();
						} else if (event.keyCode === 27) { // Escape
							jQuery(event.elem).hide().prev('select').css('visibility', 'visible');
							inst.elem.focus();
						}
					});
				// Add keyboard handling
				var data = {elem: inst.elem[0]};
				picker.keydown(data, this._keyDown).keypress(data, this._keyPress).keyup(data, this._keyUp);
				// Add command behaviour
				picker.find('.' + inst.options.renderer.commandClass).click(function() {
					if (!jQuery(this).hasClass(inst.options.renderer.disabledClass)) {
						var action = this.className.replace(
							new RegExp('^.*' + inst.options.renderer.commandClass + '-([^ ]+).*$'), '$1');
						plugin.performAction(elem, action);
					}
				});
				// Add classes
				if (inst.options.isRTL) {
					picker.addClass(inst.options.renderer.rtlClass);
				}
				if (monthsToShow[0] * monthsToShow[1] > 1) {
					picker.addClass(inst.options.renderer.multiClass);
				}
				if (inst.options.pickerClass) {
					picker.addClass(inst.options.pickerClass);
				}
				// Resize
				jQuery('body').append(picker);
				var width = 0;
				picker.find(inst.options.renderer.monthSelector).each(function() {
					width += jQuery(this).outerWidth();
				});
				picker.width(width / monthsToShow[0]);
				// Pre-show customisation
				if (jQuery.isFunction(inst.options.onShow)) {
					inst.options.onShow.apply(elem, [picker, inst]);
				}
				return picker;
			},

			/** Generate the content for a single month.
			 @private
			 @param elem {Element} The control to affect.
			 @param inst {object} The current instance settings.
			 @param year {number} The year to generate.
			 @param month {number} The month to generate.
			 @param renderer {object} The rendering templates.
			 @param first {boolean} <code>true</code> if first of multiple months.
			 @return {string} The month content. */
			_generateMonth: function(elem, inst, year, month, renderer, first) {
				var daysInMonth = plugin.daysInMonth(year, month);
				var monthsToShow = inst.options.monthsToShow;
				monthsToShow = (jQuery.isArray(monthsToShow) ? monthsToShow : [1, monthsToShow]);
				var fixedWeeks = inst.options.fixedWeeks || (monthsToShow[0] * monthsToShow[1] > 1);
				var firstDay = inst.options.firstDay;
				var leadDays = (plugin.newDate(year, month, 1).getDay() - firstDay + 7) % 7;
				var numWeeks = (fixedWeeks ? 6 : Math.ceil((leadDays + daysInMonth) / 7));
				var selectOtherMonths = inst.options.selectOtherMonths && inst.options.showOtherMonths;
				var minDate = (inst.pickingRange ? inst.selectedDates[0] : inst.get('minDate'));
				var maxDate = inst.get('maxDate');
				var showWeeks = renderer.week.indexOf('{weekOfYear}') > -1;
				var today = plugin.today();
				var drawDate = plugin.newDate(year, month, 1);
				plugin.add(drawDate, -leadDays - (fixedWeeks && (drawDate.getDay() === firstDay) ? 7 : 0), 'd');
				var ts = drawDate.getTime();
				// Generate weeks
				var weeks = '';
				for (var week = 0; week < numWeeks; week++) {
					var weekOfYear = (!showWeeks ? '' : '<span class="dp' + ts + '">' +
					(jQuery.isFunction(inst.options.calculateWeek) ? inst.options.calculateWeek(drawDate) : 0) + '</span>');
					var days = '';
					for (var day = 0; day < 7; day++) {
						var selected = false;
						if (inst.options.rangeSelect && inst.selectedDates.length > 0) {
							selected = (drawDate.getTime() >= inst.selectedDates[0] &&
							drawDate.getTime() <= inst.selectedDates[1]);
						} else {
							for (var i = 0; i < inst.selectedDates.length; i++) {
								if (inst.selectedDates[i].getTime() === drawDate.getTime()) {
									selected = true;
									break;
								}
							}
						}
						var dateInfo = (!jQuery.isFunction(inst.options.onDate) ? {} :
							inst.options.onDate.apply(elem, [drawDate, drawDate.getMonth() + 1 === month]));
						var selectable = (selectOtherMonths || drawDate.getMonth() + 1 === month) &&
							this._isSelectable(elem, drawDate, dateInfo.selectable, minDate, maxDate);
						days += this._prepare(renderer.day, inst).replace(/\{day\}/g,
							(selectable ? '<a href="javascript:void(0)"' : '<span') +
							' class="dp' + ts + ' ' + (dateInfo.dateClass || '') +
							(selected && (selectOtherMonths || drawDate.getMonth() + 1 === month) ?
							' ' + renderer.selectedClass : '') +
							(selectable ? ' ' + renderer.defaultClass : '') +
							((drawDate.getDay() || 7) < 6 ? '' : ' ' + renderer.weekendClass) +
							(drawDate.getMonth() + 1 === month ? '' : ' ' + renderer.otherMonthClass) +
							(drawDate.getTime() === today.getTime() && (drawDate.getMonth() + 1) === month ?
							' ' + renderer.todayClass : '') +
							(drawDate.getTime() === inst.drawDate.getTime() && (drawDate.getMonth() + 1) === month ?
							' ' + renderer.highlightedClass : '') + '"' +
							(dateInfo.title || (inst.options.dayStatus && selectable) ? ' title="' +
							(dateInfo.title || plugin.formatDate(
								inst.options.dayStatus, drawDate, inst.getConfig())) + '"' : '') + '>' +
							(inst.options.showOtherMonths || (drawDate.getMonth() + 1) === month ?
							dateInfo.content || drawDate.getDate() : '&#160;') +
							(selectable ? '</a>' : '</span>'));
						plugin.add(drawDate, 1, 'd');
						ts = drawDate.getTime();
					}
					weeks += this._prepare(renderer.week, inst).replace(/\{days\}/g, days).replace(/\{weekOfYear\}/g, weekOfYear);
				}
				var monthHeaderFormat = inst.options.monthHeaderFormat? inst.options.monthHeaderFormat : 'MM yyyy';
				var monthHeader = this._prepare(renderer.month, inst).match(/\{monthHeader(:[^\}]+)?\}/);
				monthHeader = (monthHeader[0].length <= 13 ? monthHeaderFormat :
					monthHeader[0].substring(13, monthHeader[0].length - 1));
				monthHeader = (first ? this._generateMonthSelection(
					inst, year, month, minDate, maxDate, monthHeader, renderer) :
					plugin.formatDate(monthHeader, plugin.newDate(year, month, 1), inst.getConfig()));
				var weekHeader = this._prepare(renderer.weekHeader, inst).replace(/\{days\}/g, this._generateDayHeaders(inst, renderer));
				return this._prepare(renderer.month, inst).replace(/\{monthHeader(:[^\}]+)?\}/g, monthHeader).replace(/\{weekHeader\}/g, weekHeader).replace(/\{weeks\}/g, weeks);
			},

			/** Generate the HTML for the day headers.
			 @private
			 @param inst {object} The current instance settings.
			 @param renderer {object} The rendering templates.
			 @return {string} A week's worth of day headers. */
			_generateDayHeaders: function(inst, renderer) {
				var header = '';
				for (var day = 0; day < 7; day++) {
					var dow = (day + inst.options.firstDay) % 7;
					header += this._prepare(renderer.dayHeader, inst).replace(/\{day\}/g,
						'<span class="' + this._curDoWClass + dow + '" title="' +
						inst.options.dayNames[dow] + '">' + inst.options.dayNamesMin[dow] + '</span>');
				}
				return header;
			},

			/** Generate selection controls for month.
			 @private
			 @param inst {object} The current instance settings.
			 @param year {number} The year to generate.
			 @param month {number} The month to generate.
			 @param minDate {Date} The minimum date allowed.
			 @param maxDate {Date} The maximum date allowed.
			 @param monthHeader {string} The month/year format.
			 @return {string} The month selection content. */
			_generateMonthSelection: function(inst, year, month, minDate, maxDate, monthHeader) {
				if (!inst.options.changeMonth) {
					return plugin.formatDate(
						monthHeader, plugin.newDate(year, month, 1), inst.getConfig());
				}
				// Months
				var monthNames = inst.options['monthNames' + (monthHeader.match(/mm/i) ? '' : 'Short')];
				var html = monthHeader.replace(/m+/i, '\\x2E').replace(/y+/i, '\\x2F');
				var selector = '<select class="' + this._monthYearClass +
					'" title="' + inst.options.monthStatus + '">';
				for (var monthIndex = 1; monthIndex <= 12; monthIndex++) {
					if ((!minDate || plugin.newDate(year, monthIndex, plugin.daysInMonth(year, monthIndex)).getTime() >= minDate.getTime()) &&
						(!maxDate || plugin.newDate(year, monthIndex, 1).getTime() <= maxDate.getTime())) {
						selector += '<option value="' + monthIndex + '/' + year + '"' +
							(month === monthIndex ? ' selected="selected"' : '') + '>' +
							monthNames[monthIndex - 1] + '</option>';
					}
				}
				selector += '</select>';
				html = html.replace(/\\x2E/, selector);
				// Years
				var yearRange = inst.options.yearRange;
				if (yearRange === 'any') {
					selector = '<select class="' + this._monthYearClass + ' ' + this._anyYearClass +
						'" title="' + inst.options.yearStatus + '">' +
						'<option>' + year + '</option></select>' +
						'<input class="' + this._monthYearClass + ' ' + this._curMonthClass +
						month + '" value="' + year + '">';
				} else {
					yearRange = yearRange.split(':');
					var todayYear = plugin.today().getFullYear();
					var start = (yearRange[0].match('c[+-].*') ? year + parseInt(yearRange[0].substring(1), 10) :
						((yearRange[0].match('[+-].*') ? todayYear : 0) + parseInt(yearRange[0], 10)));
					var end = (yearRange[1].match('c[+-].*') ? year + parseInt(yearRange[1].substring(1), 10) :
						((yearRange[1].match('[+-].*') ? todayYear : 0) + parseInt(yearRange[1], 10)));
					selector = '<select class="' + this._monthYearClass +
						'" title="' + inst.options.yearStatus + '">';
					start = plugin.add(plugin.newDate(start + 1, 1, 1), -1, 'd');
					end = plugin.newDate(end, 1, 1);
					var addYear = function(yIndex, yDisplay) {
						if (yIndex !== 0) {
							selector += '<option value="' + month + '/' + yIndex + '"' +
								(year === yIndex ? ' selected="selected"' : '') + '>' + (yDisplay || yIndex) + '</option>';
						}
					};
					if (start.getTime() < end.getTime()) {
						start = (minDate && minDate.getTime() > start.getTime() ? minDate : start).getFullYear();
						end = (maxDate && maxDate.getTime() < end.getTime() ? maxDate : end).getFullYear();
						var earlierLater = Math.floor((end - start) / 2);
						if (!minDate || minDate.getFullYear() < start) {
							addYear(start - earlierLater, inst.options.earlierText);
						}
						for (var yearAdd = start; yearAdd <= end; yearAdd++) {
							addYear(yearAdd);
						}
						if (!maxDate || maxDate.getFullYear() > end) {
							addYear(end + earlierLater, inst.options.laterText);
						}
					} else {
						start = (maxDate && maxDate.getTime() < start.getTime() ? maxDate : start).getFullYear();
						end = (minDate && minDate.getTime() > end.getTime() ? minDate : end).getFullYear();
						var earlierLater = Math.floor((start - end) / 2);
						if (!maxDate || maxDate.getFullYear() > start) {
							addYear(start + earlierLater, inst.options.earlierText);
						}
						for (var yearAdd = start; yearAdd >= end; yearAdd--) {
							addYear(yearAdd);
						}
						if (!minDate || minDate.getFullYear() < end) {
							addYear(end - earlierLater, inst.options.laterText);
						}
					}
					selector += '</select>';
				}
				html = html.replace(/\\x2F/, selector);
				return html;
			},

			/** Prepare a render template for use.
			 Exclude popup/inline sections that are not applicable.
			 Localise text of the form: {l10n:name}.
			 @private
			 @param text {string} The text to localise.
			 @param inst {object} The current instance settings.
			 @return {string} The localised text. */
			_prepare: function(text, inst) {
				var replaceSection = function(type, retain) {
					while (true) {
						var start = text.indexOf('{' + type + ':start}');
						if (start === -1) {
							return;
						}
						var end = text.substring(start).indexOf('{' + type + ':end}');
						if (end > -1) {
							text = text.substring(0, start) +
								(retain ? text.substr(start + type.length + 8, end - type.length - 8) : '') +
								text.substring(start + end + type.length + 6);
						}
					}
				};
				replaceSection('inline', inst.inline);
				replaceSection('popup', !inst.inline);
				var pattern = /\{l10n:([^\}]+)\}/;
				var matches = null;
				while (matches = pattern.exec(text)) {
					text = text.replace(matches[0], inst.options[matches[1]]);
				}
				return text;
			},

			// --- start ---
			// Fix for OneScreen Datepicker
			apply: function(elem) {
				this._updateInput(elem);
				this.hide(elem);
			}
			// --- end ---

		});

		var plugin = jQuery.datepick; // Singleton instance

		jQuery(function() {
			jQuery(document).on('mousedown.' + pluginName, plugin._checkExternalClick).on('resize.' + pluginName, function() {
				plugin.hide(plugin.curInst);
			});
		});

		module.exports = plugin;
	})(__webpack_require__(3));


/***/ },

/***/ 490:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* eslint-disable */
	/* Simple JavaScript Inheritance
	 * By John Resig http://ejohn.org/
	 * MIT Licensed.
	 */
	// Inspired by base2 and Prototype
	(function(){
		var initializing = false;

		// The base JQClass implementation (does nothing)
		window.JQClass = function(){};

		// Collection of derived classes
		JQClass.classes = {};

		// Create a new JQClass that inherits from this class
		JQClass.extend = function extender(prop) {
			var base = this.prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			var prototype = new this();
			initializing = false;

			// Copy the properties over onto the new prototype
			for (var name in prop) {
				// Check if we're overwriting an existing function
				prototype[name] = typeof prop[name] == 'function' &&
					typeof base[name] == 'function' ?
					(function(name, fn){
						return function() {
							var __super = this._super;

							// Add a new ._super() method that is the same method
							// but on the super-class
							this._super = function(args) {
								return base[name].apply(this, args || []);
							};

							var ret = fn.apply(this, arguments);

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							this._super = __super;

							return ret;
						};
					})(name, prop[name]) :
					prop[name];
			}

			// The dummy class constructor
			function JQClass() {
				// All construction is actually done in the init method
				if (!initializing && this._init) {
					this._init.apply(this, arguments);
				}
			}

			// Populate our constructed prototype object
			JQClass.prototype = prototype;

			// Enforce the constructor to be what we expect
			JQClass.prototype.constructor = JQClass;

			// And make this class extendable
			JQClass.extend = extender;

			return JQClass;
		};
	})();

	(function(jQuery) {
		var helper = __webpack_require__(25);
		/** Abstract base class for collection plugins v1.0.1.
			Written by Keith Wood (kbwood{at}iinet.com.au) December 2013.
			Licensed under the MIT (http://keith-wood.name/licence.html) license.
			@module jQuery.JQPlugin
			@abstract */
		JQClass.classes.JQPlugin = JQClass.extend({

			/** Name to identify this plugin.
				@example name: 'tabs' */
			name: 'plugin',

			/** Default options for instances of this plugin (default: {}).
				@example defaultOptions: {
	 	selectedClass: 'selected',
	 	triggers: 'click'
	 } */
			defaultOptions: {},

			/** Options dependent on the locale.
				Indexed by language and (optional) country code, with '' denoting the default language (English/US).
				@example regionalOptions: {
		'': {
			greeting: 'Hi'
		}
	 } */
			regionalOptions: {},

			/** Names of getter methods - those that can't be chained (default: []).
				@example _getters: ['activeTab'] */
			_getters: [],

			/** Retrieve a marker class for affected elements.
				@private
				@return {string} The marker class. */
			_getMarker: function() {
				return 'is-' + this.name;
			},

			/** Initialise the plugin.
				Create the jQuery bridge - plugin name <code>xyz</code>
				produces <code>jQuery.xyz</code> and <code>jQuery.fn.xyz</code>. */
			_init: function() {
				// Apply default localisations
				jQuery.extend(this.defaultOptions, (this.regionalOptions && this.regionalOptions['']) || {});
				// Camel-case the name
				var jqName = helper.camelCase(this.name);
				// Expose jQuery singleton manager
				jQuery[jqName] = this;
				// Expose jQuery collection plugin
				jQuery.fn[jqName] = function(options) {
					var otherArgs = Array.prototype.slice.call(arguments, 1);
					if (jQuery[jqName]._isNotChained(options, otherArgs)) {
						return jQuery[jqName][options].apply(jQuery[jqName], [this[0]].concat(otherArgs));
					}
					return this.each(function() {
						if (typeof options === 'string') {
							if (options[0] === '_' || !jQuery[jqName][options]) {
								throw 'Unknown method: ' + options;
							}
							jQuery[jqName][options].apply(jQuery[jqName], [this].concat(otherArgs));
						} else {
							jQuery[jqName]._attach(this, options);
						}
					});
				};
			},

			/** Set default values for all subsequent instances.
				@param options {object} The new default options.
				@example jQuery.plugin.setDefauls({name: value}) */
			setDefaults: function(options) {
				jQuery.extend(this.defaultOptions, options || {});
			},

			/** Determine whether a method is a getter and doesn't permit chaining.
				@private
				@param name {string} The method name.
				@param otherArgs {any[]} Any other arguments for the method.
				@return {boolean} True if this method is a getter, false otherwise. */
			_isNotChained: function(name, otherArgs) {
				if (name === 'option' && (otherArgs.length === 0 ||
						(otherArgs.length === 1 && typeof otherArgs[0] === 'string'))) {
					return true;
				}
				return jQuery.inArray(name, this._getters) > -1;
			},

			/** Initialise an element. Called internally only.
				Adds an instance object as data named for the plugin.
				@param elem {Element} The element to enhance.
				@param options {object} Overriding settings. */
			_attach: function(elem, options) {
				elem = jQuery(elem);
				if (elem.hasClass(this._getMarker())) {
					return;
				}
				elem.addClass(this._getMarker());
				options = jQuery.extend({}, this.defaultOptions, this._getMetadata(elem), options || {});
				var inst = jQuery.extend({name: this.name, elem: elem, options: options},
					this._instSettings(elem, options));
				elem.data(this.name, inst); // Save instance against element
				this._postAttach(elem, inst);
				this.option(elem, options);
			},

			/** Retrieve additional instance settings.
				Override this in a sub-class to provide extra settings.
				@param elem {jQuery} The current jQuery element.
				@param options {object} The instance options.
				@return {object} Any extra instance values.
				@example _instSettings: function(elem, options) {
	 	return {nav: elem.find(options.navSelector)};
	 } */
			_instSettings: function(elem, options) {
				return {};
			},

			/** Plugin specific post initialisation.
				Override this in a sub-class to perform extra activities.
				@param elem {jQuery} The current jQuery element.
				@param inst {object} The instance settings.
				@example _postAttach: function(elem, inst) {
	 	elem.on('click.' + this.name, function() {
	 		...
	 	});
	 } */
			_postAttach: function(elem, inst) {
			},

			/** Retrieve metadata configuration from the element.
				Metadata is specified as an attribute:
				<code>data-&lt;plugin name>="&lt;setting name>: '&lt;value>', ..."</code>.
				Dates should be specified as strings in this format: 'new Date(y, m-1, d)'.
				@private
				@param elem {jQuery} The source element.
				@return {object} The inline configuration or {}. */
			_getMetadata: function(elem) {
				try {
					var data = elem.data(this.name.toLowerCase()) || '';
					data = data.replace(/'/g, '"');
					data = data.replace(/([a-zA-Z0-9]+):/g, function(match, group, i) {
						var count = data.substring(0, i).match(/"/g); // Handle embedded ':'
						return (!count || count.length % 2 === 0 ? '"' + group + '":' : group + ':');
					});
					data = jQuery.parseJSON('{' + data + '}');
					for (var name in data) { // Convert dates
						var value = data[name];
						if (typeof value === 'string' && value.match(/^new Date\((.*)\)$/)) {
							data[name] = eval(value);
						}
					}
					return data;
				} catch (e) {
					return {};
				}
			},

			/** Retrieve the instance data for element.
				@param elem {Element} The source element.
				@return {object} The instance data or {}. */
			_getInst: function(elem) {
				return jQuery(elem).data(this.name) || {};
			},

			/** Retrieve or reconfigure the settings for a plugin.
				@param elem {Element} The source element.
				@param name {object|string} The collection of new option values or the name of a single option.
				@param [value] {any} The value for a single named option.
				@return {any|object} If retrieving a single value or all options.
				@example jQuery(selector).plugin('option', 'name', value)
			 jQuery(selector).plugin('option', {name: value, ...})
	 var value = jQuery(selector).plugin('option', 'name')
	 var options = jQuery(selector).plugin('option') */
			option: function(elem, name, value) {
				elem = jQuery(elem);
				var inst = elem.data(this.name);
				if  (!name || (typeof name === 'string' && value == null)) {
					var options = (inst || {}).options;
					return (options && name ? options[name] : options);
				}
				if (!elem.hasClass(this._getMarker())) {
					return;
				}
				var options = name || {};
				if (typeof name === 'string') {
					options = {};
					options[name] = value;
				}
				this._optionsChanged(elem, inst, options);
				jQuery.extend(inst.options, options);
			},

			/** Plugin specific options processing.
				Old value available in <code>inst.options[name]</code>, new value in <code>options[name]</code>.
				Override this in a sub-class to perform extra activities.
				@param elem {jQuery} The current jQuery element.
				@param inst {object} The instance settings.
				@param options {object} The new options.
				@example _optionsChanged: function(elem, inst, options) {
	 	if (options.name != inst.options.name) {
	 		elem.removeClass(inst.options.name).addClass(options.name);
	 	}
	 } */
			_optionsChanged: function(elem, inst, options) {
			},

			/** Remove all trace of the plugin.
				Override <code>_preDestroy</code> for plugin-specific processing.
				@param elem {Element} The source element.
				@example jQuery(selector).plugin('destroy') */
			destroy: function(elem) {
				elem = jQuery(elem);
				if (!elem.hasClass(this._getMarker())) {
					return;
				}
				this._preDestroy(elem, this._getInst(elem));
				elem.removeData(this.name).removeClass(this._getMarker());
			},

			/** Plugin specific pre destruction.
				Override this in a sub-class to perform extra activities and undo everything that was
				done in the <code>_postAttach</code> or <code>_optionsChanged</code> functions.
				@param elem {jQuery} The current jQuery element.
				@param inst {object} The instance settings.
				@example _preDestroy: function(elem, inst) {
	 	elem.off('.' + this.name);
	 } */
			_preDestroy: function(elem, inst) {
			}
		});

		/** Expose the plugin base.
			@namespace "jQuery.JQPlugin" */
		jQuery.JQPlugin = {

			/** Create a new collection plugin.
				@memberof "jQuery.JQPlugin"
				@param [superClass='JQPlugin'] {string} The name of the parent class to inherit from.
				@param overrides {object} The property/function overrides for the new class.
				@example jQuery.JQPlugin.createPlugin({
	 	name: 'tabs',
	 	defaultOptions: {selectedClass: 'selected'},
	 	_initSettings: function(elem, options) { return {...}; },
	 	_postAttach: function(elem, inst) { ... }
	 }); */
			createPlugin: function(superClass, overrides) {
				if (typeof superClass === 'object') {
					overrides = superClass;
					superClass = 'JQPlugin';
				}
				superClass = helper.camelCase(superClass);
				var className = helper.camelCase(overrides.name);
				JQClass.classes[className] = JQClass.classes[superClass].extend(overrides);
				new JQClass.classes[className]();
			}
		};

	})(__webpack_require__(3));


/***/ },

/***/ 491:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isMobile = __webpack_require__(341).browser.isMobile;

	/**
	  name: Datepicker
	  type: ui
	  desc: >
	    Provides functionality of choosing single date or date range
	    Works as a component or an extension
	    Allows you to restrict some dates from being selected
	    (requires to be wrapped with `form` with `form/validation`)

	    There is desktop and mobile versions
	    Desktop one wraps http://keith-wood.name/datepick.html
	    Mobile one uses `input[type=date]` native functionality

	  options:
	    rangeSelect: Enables range mode in datepicker
	    daterangeMessage: Error message to be shown when end date is less then start date
	    defaultStartDate: ISO Date string `yyyy-mm-dd` set as start date value on reset or after clearing the field
	    defaultEndDate: End date `yyyy-mm-dd` set on reset or clear
	    dateFormat: Format of displaying dates (`yyyy-mm-dd` by default)
	    dateMessage: Message shown if entered value in not valid
	    disabledDates: Comma-separated list of ISO dates that should be disabled
	    disabledDatesMessage: message that is shown if selected date is disabled
	    minDate: ISO date string disables all dates before given value
	    minDateMessage: Error message to be shown when selected date is less than minimal
	    maxDate: ISO date string disables all dates after given value
	    maxDateMessage: Error message to be shown when selected date is greater than maximal
	    monthsToShow: Number of months shown together in calendar
	    monthHeaderFormat: Format of month headers shown in popup (`MM yyyy` gives us `novemder 2015`)
	    monthNames: Comma-separated list of full month names (month header in calendar)
	    monthNamesShort: Comma-separated list of short month names (month name in day title)
	    dayNames: Comma-separated list of full day names (title for column headers in calendar)
	    dayNamesShort: Comma-separated list of short day names (day name in day title)
	    dayNamesMin: Comma-separated list of short day names (label for column headers in calendar)
	    applyText: Label for `apply` button in Range
	    todayText: Label for `Show current month` link
	    todayStatus: Title for `Show current month` link
	    prevStatus: Title for `Prev month` link
	    nextStatus: Title for `Next month` link
	    closeStatus: Title for `Close` button
	    clearStatus: Title for `Clear` button
	    dayStatus: a day title in calendar
	    alwaysFilled: Boolean. Means that value can not be empty (defaults will be used on reset or clear)

	  events:
	    change: Fires when date is changed
	*/
	module.exports = isMobile ? __webpack_require__(492) : __webpack_require__(485);

	/**
	  desc: >
	    Returns object with selected startDate and endDate as strings `yyyy-mm-dd`
	*/
	function getDates() {}

	/**
	  desc: >
	    Sets default values to start and end dates or clears them if no defaults set
	*/
	function reset() {}


/***/ },

/***/ 492:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(341);
	var baseDatepicker = __webpack_require__(484);

	module.exports = tools.util.extend(true, {}, baseDatepicker, {
		events: {
			'change [data-selector=startDate]': '_onChange',
			'change [data-selector=endDate]': '_onChange'
		},

		initialize: function() {
			baseDatepicker.initialize.apply(this, arguments);

			this._$clearButton.remove();
			this._$dateRange.addClass('js-hidden');
		},

		ready: function() {
			this.initializePicker();
		},

		_setDefaults: function() {
			this._setDates(this.$options.defaultStartDate, this.$options.defaultEndDate);
		},

		_setDates: function(startDate, endDate) {
			this._$startDate.val(this._dateToString(startDate));
			this._$endDate.val(this._dateToString(endDate));

			this._change();
		},

		_onChange: function() {
			this._triggerChange();
		},

		initializePicker: function() {
			var attrs = this._getValidationAttributes();
			var pluginLabel = document.querySelector('[for="' + this._$dateRange.attr('id') + '"]');
			var nativeLabel = document.querySelector('[for="' + this._$startDate.attr('id') + '"]');

			if (pluginLabel) {
				pluginLabel.classList.add('js-hidden');
			}

			this._$dateRange.parent().remove();

			this._$startDate
				.attr('type', 'date')
				.removeClass('datepicker__start')
				.val(this.$options.defaultStartDate || '');
			this._$startDate.parent().removeClass('mobile-visible');

			if (nativeLabel) {
				nativeLabel.classList.remove('mobile-visible');
			}

			if (this.$options.rangeSelect) {
				this._$endDate
					.attr('type', 'date')
					.removeClass('datepicker__end')
					.val(this.$options.defaultEndDate || '');
				this._$endDate.parent().removeClass('mobile-visible');
			}

			Object.keys(attrs).forEach(function(key) {
				this._$startDate.attr(key, attrs[key]);

				if (this.$options.rangeSelect) {
					this._$endDate.attr(key, attrs[key]);
				}
			}.bind(this));
		}
	});


/***/ },

/***/ 493:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Dropdown
	type: ui
	desc: >
		Renders popup with items list. Has ability to navigate through list via keyboard arrows.
		`Esc` key and outside mouse click closes dropdown.
	events:
		open: Fires when dropdown was shown.
		close: Fires when dropdown was hidden.
	 */
	module.exports = {
		events: {
			'newItemsAdded $this': '_bindEventsOnItems'
		},

		initialize: function() {
			this.isCollapsed = true;

			this.$toggle = this.$el.find('.dropdown__label, .dropdown__toggle, [data-toggle="dropdown"], .dropdown__label a');

			this.$toggle.on('click.dropdown', this._onClick.bind(this));

			this.$tools.dom.find(document).on('keydown.dropdown', this._onKeydown.bind(this));

			this._onChooseOptionHandler = this._onChooseOption.bind(this);
			this._onDocumentClickHandler = this._onDocumentClick.bind(this);

			this._bindEventsOnItems();
		},

		/**
		desc: Toggles dropdown state.
		 */
		toggle: function() {
			if (this.isCollapsed) {
				this.open();
			} else {
				this.close();
			}
		},

		/**
		 desc: Shows dropdown popup.
		 */
		open: function() {
			if (this.$options.disabled) {
				return;
			}

			this.isCollapsed = false;
			this.$el.addClass('is-open');
			this.$tools.dom.find(document).on('click.dropdown', this._onDocumentClickHandler);

			this.$events.trigger('open');
		},

		/**
		 desc: Hides dropdown popup.
		 */
		close: function() {
			this.isCollapsed = true;
			this.$el.removeClass('is-open');
			this.$tools.dom.find(document).off('click.dropdown', this._onDocumentClickHandler);

			this.$events.trigger('close');
		},

		/**
			desc: Disables open dropdown component
			*/
		disable: function() {
			this.$options.disabled = true;
			this.$toggle.attr('disabled', 'disabled');
			this.close();
		},

		/**
			desc: Enables open dropdown component
			*/
		enable: function() {
			this.$options.disabled = false;
			this.$toggle.removeAttr('disabled');
		},

		/**
			desc: Set title for element to show some hint for user
			*/
		setTitle: function(text) {
			this.$el.prop('title', text);
		},

		_bindEventsOnItems: function() {
			this.$el.find('.dropdown__content li')
				.off('click.dropdown', this._onChooseOptionHandler)
				.on('click.dropdown', this._onChooseOptionHandler);

		},

		_onClick: function(event) {
			event.preventDefault();
			this.toggle();
		},

		_onChooseOption: function(event) {
			if (this.$options.disableChooseOption) {
				return;
			}

			if (event.currentTarget.dataset.value) {
				this.$events.trigger('change', event.currentTarget.dataset.value);
			}

			this.toggle();
		},

		_onKeydown: function(event) { // eslint-disable-line max-statements
			var $activeEl;
			var $items;
			var $focusedItem;
			var index;
			var KEYCODE = { ESCAPE: 27, UP: 38, DOWN: 40};

			if (!/(27|38|40)/.test(event.which) || this.isCollapsed) {
				return;
			}

			if (event.which === KEYCODE.ESCAPE) {
				this.close();

				return;
			}
			event.preventDefault();

			$activeEl = this.$tools.dom.find(document.activeElement);
			$items = this.$el.find('.dropdown__list > li');
			$focusedItem = $activeEl.parent();
			index = $items.index($focusedItem);

			if (event.which === KEYCODE.UP && index > 0) {
				index--;
			}

			if (event.which === KEYCODE.DOWN && index < $items.length - 1) {
				index++;
			}

			if (!index) {
				index = 0;
			}

			$items.eq(index).find('> a').focus();
		},

		_onDocumentClick: function(event) {
			if (!this.$el[0].contains(event.target)) {
				this.close();
			}
		}
	};


/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var external = __webpack_require__(348);

	function AuraElement() {}

	/* Get fake Element prototype to prevent it of passing "instance of Array" validation */
	AuraElement.prototype = external.forgery();

	AuraElement.prototype.constructor = AuraElement;

	/* Using Framework::element as Component is DEPRECATED. Use it only as stumer for elements collection and event */

	/**
	name: Element
	type: ui
	desc: Lorem ipsum dolor sit amet.
	 */
	module.exports = {
		initialize: function() {
			external.call(this, this.$el.get ? this.$el.get() : this.$el);

			/* Base Component`s prototype */
			this.__super = this.constructor.prototype;
		},

		ready: function() {
			this.overlap();
		},

		events: {
			'click': '_reTriggerEvent',
			'change': '_reTriggerEvent'
		},

		_reTriggerEvent: function(event) {
			this.$events.trigger(event.type);
		},

		/* Overlaping methods with the same name for Element(external) calling Component methods */
		overlap: function() {
			this.show = function() {
				return this.__super.show.apply(this, arguments);
			};

			this.hide = function() {
				return this.__super.hide.apply(this, arguments);
			};

			this.toggle = function() {
				return this.__super.toggle.apply(this, arguments);
			};

			this.html = function() {
				return this.__super.html.apply(this, arguments);
			};
		},

		constructor: AuraElement
	};


/***/ },

/***/ 495:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Filtering Bar
	type: UI
	desc: Basic controller for filtering panel handling
	events:
		filterChange: Fires when some filter was changed (criteria, filterValue, etc).
	 */
	module.exports = {
		events: {
			'change filterControl': '_onFilterChange',
			'change filterAll': '_onFiltersReset'
		},

		initialize: function() {
			this.selectedValues = this._getSelectedValues();
		},

		/**
		desc: return current filter state as object. Contains selected values and criteria
		*/
		getCurrentState: function() {
			return {
				criteria: this.$options.filterGroup,
				values: this.selectedValues
			};
		},

		hasSelectedFilters: function() {
			return this.selectedValues.length > 0;
		},

		_onFilterChange: function() {
			this.selectedValues = this._getSelectedValues();

			this.$elements.filterAll.prop('checked', !this.selectedValues.length);

			this.$events.trigger('filterChange', this.getCurrentState());
		},

		_getSelectedValues: function() {
			if (!this.$elements.filterControl) {
				return [];
			}

			return this.$elements.filterControl.get()
				.filter(function(filter) {
					return filter.checked;
				})
				.map(function(filter) {
					return filter.value;
				});
		},

		_onFiltersReset: function() {
			this.$elements.filterControl.forEach(function(filterControl) {
				filterControl.checked = false; // eslint-disable-line no-param-reassign
			});

			this._onFilterChange();
		}
	};


/***/ },

/***/ 496:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(341);
	var filter = __webpack_require__(495);

	/**
	name: Filtering Bar/Multiple categories
	type: UI
	desc: >
		Controller for filtering panel. Inherits Filtering bar.
		Allows to use multiple categories.
		Each button holds property that defines category which button belongs to
	events:
		filterChange: Fires when some filter was changed (criteria, filterValue, etc).
	 */
	module.exports = tools.util.extend(true, {}, filter, {
		_getSelectedValues: function() {
			var filters = this.$elements.filterControl;
			var selectedValues = [];

			this.categories = {};

			if (!filters.length) {
				return selectedValues;
			}

			filters.forEach(function(filter) {
				var categoryName = filter.dataset.category;

				if (!filter.checked) {
					return;
				}

				if (!this.categories[categoryName]) {
					this.categories[categoryName] = [];
				}

				this.categories[categoryName].push(filter.value);
			}.bind(this));

			Object.keys(this.categories).forEach(function(category) {

				selectedValues.push({
					categoryName: category,
					values: this.categories[category]
				});
			}.bind(this));

			return selectedValues;
		}
	});


/***/ },

/***/ 497:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Form
	type: ui
	desc: >
		Powers `<form />` element.
		Helps with form validation, enabling/disabling, submitting data.
	options:
		preventSubmit: If `false` - performs native form submit. If 'true' prevents native form submitting. Default - true
		url: Specifies URL to interact with back-end.
		skipNamesTruncating: If set to `true`, method `serialize` will not remove first token of name (before the first dot) of input fields.
	events:
		reset: Fires when native `reset` event was triggered.
		formReset: Fires when `reset` method clears all fields.
		submit: Fires when form is submitting and all fields are valid.
	*/
	module.exports = {
		events: {
			'submit': '_onSubmit',
			'reset': '_onReset'
		},

		ready: function() {
			var autofocusElement = this.$el[0].querySelector('[autofocus]');

			if (autofocusElement) {
				autofocusElement.focus();
			}
		},

		/**
			desc: >
				Serializes form to key-value pair.

				Note! If control name contains dot, we should remove first token.
				Because .NET Razor mapper renders names with a token of ViewModel name,
				but MVC mapper for HTTP request parameters can't match them with model.
		*/
		serialize: function() {
			var obj = {};
			var	skipNamesTruncating = this.$options.skipNamesTruncating;
			var	serializedArray = this.$el.serializeArray();

			serializedArray.forEach(function(item) {
				if (!skipNamesTruncating) {
					item.name = item.name.replace(/^[^.]+\./, ''); // eslint-disable-line no-param-reassign
				}

				if (obj[item.name] !== undefined) {
					if (!obj[item.name].push) {
						obj[item.name] = [obj[item.name]];
					}

					obj[item.name].push(item.value || '');
				} else {
					obj[item.name] = item.value || '';
				}
			});

			return obj;
		},

		/**
			desc: Fills up HTML form controls with specified data.
			args:
				obj: Object. key-value object with form data.
		*/
		deserialize: function(obj) {
			Object.keys(obj).forEach(function(field) {
				var $el = this.$el.find('input').filter(function() {
					return this.getAttribute('name').toLowerCase().indexOf(field.toLowerCase()) !== -1;
				});

				$el.val(obj[field]);
			}.bind(this));
		},

		/**
			desc: Enables all form controls.
		*/
		enable: function() {
			this.$el.find(':input').prop('disabled', false);

			return this;
		},

		/**
			desc: Disables all form controls.
		*/
		disable: function() {
			this.$el.find(':input').prop('disabled', true);

			return this;
		},

		/**
			desc: Resets all form controls or only specified fields if aliases are set.
			args:
				aliases: Array<string>. Collection of aliases for inner components which should be cleared.
		*/
		reset: function(aliases) {
			if (aliases) {
				[].concat(aliases).forEach(function(alias) {
					alias = alias.trim(); // eslint-disable-line no-param-reassign
					if (this.$components[alias]) {
						this.$components[alias].$el.val('');
					}
				}.bind(this));
			} else {
				this.$el.get(0).reset();
			}

			this.$events.trigger('formReset');
		},

		/**
			desc: >
				Validates a form using jQuery Unobtrusive Validation library.
				Returns `true` if form is valid, otherwise - `false`.
		*/
		valid: function() {
			if (this.$el.validate) {
				this.$el.validate();

				return this.$el.valid();
			}

			return true;
		},

		updateValidate: function() {
			if (this.$extensions['form/validation']) {
				this.$extensions['form/validation'].updateValidationFields();
			}
		},

		_onSubmit: function(event) {
			if (this._isSubmitPrevented()) {
				event.preventDefault();
			}

			if (this.valid()) {
				this.$events.trigger('submit');
			}
		},

		_isSubmitPrevented: function() {
			if ('preventSubmit' in this.$options) {
				return this.$options.preventSubmit;
			}

			return true;
		},

		_onReset: function() {
			this.$events.trigger('reset');
		},

		/**
			desc: Gets form URL by `action` or `data-url` attributes to submit form data.
		*/
		getUrl: function() {
			return this.$el.prop('action') || this.$options.url;
		},

		_getMethod: function() {
			return (this.$el.prop('method') || 'post').toLowerCase();
		},

		/**
			desc: Submits native HTML form. Note that $el[0].submit() forces native submit without triggering submit event handlers
		*/
		submit: function() {
			this.$el.submit();
		},

		/**
			desc: Submits form via ajax. returns a promise
		*/
		submitAsync: function() {
			var url = this.getUrl();
			var method = this._getMethod();
			var data = this.serialize();

			return this.$tools.data[method](url, data);
		},

		/**
			desc: Do form submittable on not basing on argument
			args:
				isSubmitPrevented: <boolean> If `true` - prevents native form submitting.
		*/
		preventSubmit: function(isSubmitPrevented) {
			this.$options.preventSubmit = isSubmitPrevented;
		}
	};


/***/ },

/***/ 498:
/***/ function(module, exports) {

	'use strict';

	var ENTER_KEY = 13;
	var TIMEOUT_DEBOUNCE = 500;

	/**
	name: Form search
	type: ui
	desc: Fancy input with clear and submit buttons
	options:
	    searchOnChange: Boolean. trigger `search` event when value was changed
	    delay: delay before submit if searchOnChange is set to 'true'
	events:
		search: fires when user clicks submit button or chooses item from autocomplete dropdown
	*/
	module.exports = {
		initialize: function() {
			this._debouncedInputHandler = this.$tools.helper.debounce(function() {
				this._onSubmit();
			}.bind(this), this.$options.delay || TIMEOUT_DEBOUNCE);
		},

		events: {
			'input formSearchInput': '_onInput',
			'keypress formSearchInput': '_onKeypress',
			'click submitButton': '_onSubmit',
			'click clearButton': '_onClear',
			'valueIsSet $formSearchAutocomplete': '_onSelectAutocompleteItem'
		},

		/**
			desc: sets value of the input and performs submit
			args:
				value: String. New value for the input
		*/
		submitValue: function(value) {
			if (typeof(value) === 'string') {
				this.$elements.formSearchInput.val(value);
			}

			this._checkClear();
			this._onSubmit();
		},

		/**
		 	desc: Gets current value of search input.
		 */
		getValue: function() {
			return this.$elements.formSearchInput.val();
		},

		_onClear: function() {
			this.submitValue('');
		},

		_checkClear: function() {
			this.$elements.clearButton.toggle(!!this.getValue());
		},

		_onInput: function() {
			if (this.$options.searchOnChange) {
				this._debouncedInputHandler();
			}

			this._checkClear();
		},

		_onSubmit: function(event) {
			this.$events.trigger('search', this.getValue());

			if (event) {
				event.preventDefault();
			}
		},

		_onKeypress: function(event) {
			if (event.which === ENTER_KEY) {
				this._onSubmit(event);
			}
		},

		_onSelectAutocompleteItem: function(event, value) {
			this.submitValue(value);
		}
	};


/***/ },

/***/ 499:
/***/ function(module, exports) {

	'use strict';

	var adapters = module.exports = [];

	function setValidationValues(options, ruleName, value) {
		options.rules[ruleName] = value; // eslint-disable-line no-param-reassign

		if (options.message) {
			options.messages[ruleName] = options.message; // eslint-disable-line no-param-reassign
		}
	}

	function splitAndTrim(value) {
		return value.replace(/^\s+|\s+$/g, '').split(/\s*,\s*/g);
	}

	function escapeAttributeValue(value) {
		return value.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~\\])/g, '\\$1');
	}

	function getModelPrefix(fieldName) {
		return fieldName.substr(0, fieldName.lastIndexOf('.') + 1);
	}

	function appendModelPrefix(value, prefix) {
		if (value.indexOf('*.') === 0) {
			value = value.replace('*.', prefix); // eslint-disable-line no-param-reassign
		}

		return value;
	}

	adapters.add = function(adapterName, params, fn) {
		if (!fn) {
			fn = params; // eslint-disable-line no-param-reassign
			params = []; // eslint-disable-line no-param-reassign
		}

		this.push({name: adapterName, params: params, adapt: fn});

		return this;
	};

	adapters.addBool = function(adapterName, ruleName) {
		return this.add(adapterName, function(options) {
			setValidationValues(options, ruleName || adapterName, true);
		});
	};

	adapters.addMinMax = function(adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) { // eslint-disable-line max-params
		return this.add(adapterName, [minAttribute || 'min', maxAttribute || 'max'], function(options) {
			var min = options.params.min;
			var max = options.params.max;

			if (min && max) {
				setValidationValues(options, minMaxRuleName, [min, max]);
			} else if (min) {
				setValidationValues(options, minRuleName, min);
			} else if (max) {
				setValidationValues(options, maxRuleName, max);
			}
		});
	};

	adapters.addSingleVal = function(adapterName, attribute, ruleName) {
		return this.add(adapterName, [attribute || 'val'], function(options) {
			setValidationValues(options, ruleName || adapterName, options.params[attribute]);
		});
	};

	adapters
		.addSingleVal('accept', 'exts')
		.addSingleVal('regex', 'pattern')
		.addSingleVal('equalto', 'other')
		.addSingleVal('mindate', 'value')
		.addSingleVal('maxdate', 'value')
		.addSingleVal('disableddates', 'value')
		.addSingleVal('enableddates', 'value');

	adapters
		.addBool('creditcard')
		.addBool('date')
		.addBool('daterange')
		.addBool('digits')
		.addBool('email')
		.addBool('number')
		.addBool('url');

	adapters
		.addMinMax('length', 'minlength', 'maxlength', 'rangelength')
		.addMinMax('range', 'min', 'max', 'range');

	adapters.add('required', function(options) {
		setValidationValues(options, 'required', true);
	});

	adapters.add('password', ['min', 'nonalphamin', 'regex'], function(options) {
		if (options.params.min) {
			setValidationValues(options, 'minlength', options.params.min);
		}

		if (options.params.nonalphamin) {
			setValidationValues(options, 'nonalphamin', options.params.nonalphamin);
		}

		if (options.params.regex) {
			setValidationValues(options, 'regex', options.params.regex);
		}
	});


/***/ },

/***/ 500:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 name: Form validation
	 type: ui
	 desc: >
	 Validates form using .net validation attributtes.

	 Component should not be used directly, but form extension.
	 */
	var VALIDATION_MESSAGE_FOR = 'VALIDATION_MESSAGE_FOR';
	var VALIDATION_MESSAGE_FOR_SEPARATOR = '-';
	var adapters = __webpack_require__(499);
	var _methods = __webpack_require__(501);

	module.exports = {
		events: {
			'change input[type="date"]': '_onDateChange'
		},

		initialize: function() {
			this.options = Object.assign({
				errorClass: 'input-validation-error',
				errorElement: 'span',
				errorPlacement: this._onError.bind(this),
				invalidHandler: this._onErrors.bind(this),
				messages: {},
				rules: {},
				success: this._onSuccess.bind(this),
				focusCleanup: true,
				focusInvalid: false
			}, this.$options);
		},

		ready: function() {
			this.updateValidationFields();
			this.$events.on('formReset $this', this._resetValidation.bind(this));
			this.$events.on('customError $this', this._onCustomError.bind(this));

			this.$el.on('submit.validate', function() {
				if (!this._validator.valid()) {
					this._focusInvalid();
				}
			}.bind(this));
		},

		updateValidationFields: function() {
			this.$el.validate().destroy();
			this._fields = this.$el.find(':input[data-val="true"]').get();
			this._fields.forEach(this._prepareValidation, this);
			this.$el.find('.field-validation-error').get().forEach(this._showDefaultError, this);
			this._validator = this.$el.validate(this.options);
		},

		_focusInvalid: function() {
			var element = this._validator.findLastActive()
				|| (this._validator.errorList.length && this._validator.errorList[0].element);

			if (element) {
				element.scrollIntoViewIfNeeded(true);
				element.focus();
			}
		},

		_onDateChange: function(event) {
			this._validator.element(event.$el[0]);
		},

		_resetValidation: function() {
			this._fields.forEach(this._hideError, this);
		},

		_onError: function($errorElement, $input) {
			this._showError($input[0], $errorElement.text());
		},

		_showDefaultError: function(field) {
			if (field.previousElementSibling.classList.contains('input-validation-error')) {
				this._showError(field.previousElementSibling, field.textContent);
			}
		},

		_showError: function(input, errorMessage) {
			var validationMessage;

			if (!errorMessage) {
				return;
			}

			input.parentNode.classList.add('form-item--error');

			validationMessage = this._getValidationMessage(input.name);

			if (validationMessage) {
				validationMessage.showValidationMessage(errorMessage);
			}
		},

		_onErrors: function() {},

		_onSuccess: function($errorElement, input) {
			this._hideError(input);
		},

		_hideError: function(input) {
			var validationMessage = this._getValidationMessage(input.name);

			if (validationMessage) {
				validationMessage.hideValidationMessage();
			}

			input.parentNode.classList.remove('form-item--error');
		},

		_getValidationMessage: function(inputName) {
			var alias = [VALIDATION_MESSAGE_FOR, inputName].join(VALIDATION_MESSAGE_FOR_SEPARATOR);
			var validationMessages = this.$elements[alias] || [];

			if (validationMessages.length === 1) {
				return validationMessages[0].$component;
			} else if (validationMessages.length > 1) {
				this.$tools.logger.error('Tooltip for element "' + inputName + '"" is duplicated.');
			}

			return null;
		},

		_prepareValidation: function(input) {
			this.options.rules[input.name] = {};
			this.options.messages[input.name] = {};

			adapters.forEach(function(adapter) {
				var prefix = 'data-val-' + adapter.name;
				var paramValues = {};

				if (!input.hasAttribute(prefix)) {
					return;
				}

				adapter.params.forEach(function(param) {
					paramValues[param] = input.getAttribute(prefix + '-' + param) || undefined;
				});

				adapter.adapt({
					element: input,
					form: this.$el.get(0),
					message: input.getAttribute(prefix),
					params: paramValues,
					rules: this.options.rules[input.name],
					messages: this.options.messages[input.name]
				});
			}, this);
		},

		_onCustomError: function(event, data) {
			this._showError(data.input, data.message);
		}
	};


/***/ },

/***/ 501:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Element = __webpack_require__(348);
	var $ = __webpack_require__(3); // eslint-disable-line
	var NUMBER_RE = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:[,.]\d+)?$/;

	var datepick = __webpack_require__(489);

	var oldMin = $.validator.messages.min;
	var oldMax = $.validator.messages.max;

	$.validator.addMethod('regex', function(value, element, params) {
		var match;

		if (this.optional(element)) {
			return true;
		}

		match = new RegExp(params).exec(value);

		return (match && (match.index === 0) && (match[0].length === value.length));
	});

	$.validator.addMethod('nonalphamin', function(value, element, nonalphamin) {
		var match;

		if (nonalphamin) {
			match = value.match(/\W/g);
			match = match && match.length >= nonalphamin;
		}

		return match;
	});

	$.validator.addMethod('equalto', function(value, element, confirmName) {
		return value === Element.find(element).closest('form').find('[name="' + confirmName + '"]').val();
	});

	$.validator.addMethod('date', function(value, element) {
		var separator;
		var rgx;

		if (element.type === 'date' || !value) {
			return true;
		}

		separator = element.dataset.separator.replace(/\s/g, '').replace(/-/g, '\\-');
		rgx = new RegExp('\\s*' + separator + '\\s*');

		return value.split(rgx)
			.every(function(dateString) {
				return convertDateToISO(dateString, element.dataset.dateFormat);
			});
	});

	$.validator.addMethod('daterange', function(value, element) {
		var separator = element.dataset.separator.replace(/\s/g, '').replace(/-/g, '\\-');
		var rgx = new RegExp('\\s*' + separator + '\\s*');
		var dates = value.split(rgx)
			.map(function(dateString) {
				return convertDateToISO(dateString, element.dataset.dateFormat);
			});

		if (dates[0] && dates[1]) {
			return dates[1] >= dates[0];
		}

		return !dates[0] && !dates[1];
	});

	$.validator.addMethod('mindate', function(value, element, minDateString) {
		return value.split(element.dataset.separator)
			.every(function(dateString) {
				if (element.type !== 'date') {
					dateString = convertDateToISO(dateString, element.dataset.dateFormat); // eslint-disable-line no-param-reassign
				}

				return !dateString || dateString >= minDateString;
			});
	});

	$.validator.addMethod('maxdate', function(value, element, maxDateString) {
		return value.split(element.dataset.separator)
			.every(function(dateString) {
				if (element.type !== 'date') {
					dateString = convertDateToISO(dateString, element.dataset.dateFormat); // eslint-disable-line no-param-reassign
				}

				return !dateString || dateString <= maxDateString;
			});
	});

	$.validator.addMethod('disableddates', function(value, element, disabledDates) {
		return value.split(element.dataset.separator)
			.every(function(dateString) {
				if (element.type !== 'date') {
					dateString = convertDateToISO(dateString, element.dataset.dateFormat); // eslint-disable-line no-param-reassign
				}

				return !dateString || disabledDates.split(',').indexOf(dateString) === -1;
			});
	});

	$.validator.addMethod('enableddates', function(value, element, disabledDates) {
		return value.split(element.dataset.separator)
			.every(function(dateString) {
				if (element.type !== 'date') {
					dateString = convertDateToISO(dateString, element.dataset.dateFormat); // eslint-disable-line no-param-reassign
				}

				return !dateString || disabledDates.split(',').indexOf(dateString) !== -1;
			});
	});

	function convertDateToISO(dateString, format) {
		try {
			return datepick.formatDate('yyyy-mm-dd', datepick.parseDate(format, dateString));
		} catch (exc) {
			return '';
		}
	}

	$.validator.methods.number = function(value, element) {
		return this.optional(element) || NUMBER_RE.test(value);
	};

	$.validator.methods.min = function(value, element, min) {
		value = parseFloat(value.replace(',', '.')); // eslint-disable-line no-param-reassign

		return this.optional(element) || value >= min;
	};

	$.validator.methods.max = function(value, element, max) {
		value = parseFloat(value.replace(',', '.')); // eslint-disable-line no-param-reassign

		return this.optional(element) || value <= max;
	};

	$.validator.messages.min = function(param, element) {
		if (!NUMBER_RE.test(Element.find(element).val())) {
			return Element.find(element).data('valNumber') || $.validator.messages.number;
		}

		return oldMin(param, element);
	};

	$.validator.messages.max = function(param, element) {
		if (!NUMBER_RE.test(Element.find(element).val())) {
			return Element.find(element).data('valNumber') || $.validator.messages.number;
		}

		return oldMax(param, element);
	};


/***/ },

/***/ 502:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Validation message
	type: ui
	desc: >
		Abstract class.
		Used for showing/hiding validation messages
		Implemented in Framework::tooltip, Framework::message
	 */
	module.exports = {
		/**
		 desc: Public method for showing validation message
		*/
		showValidationMessage: function() {

		},

		/**
		 desc: Public method for hiding validation message
		*/
		hideValidationMessage: function() {
			
		}
	};


/***/ },

/***/ 503:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var loaderTemplate = __webpack_require__(504);

	/**
		name: Loader
		type: ui
		desc: >
			Show overlay with Loader when loaded state is activated
			Works as additional extension on component.
			To turn it on/off just trigger specific event in your component:

			`busy-mode-on` - to turn on
			`busy-mode-off` - to turn off

			Just like this `this.$events.trigger('busy-mode-on');`
	*/
	module.exports = {
		initialize: function() {
			this.$events.on('busy-mode-on $this', this.turnOn.bind(this));
			this.$events.on('busy-mode-off $this', this.turnOff.bind(this));

			this._container = this.$el.get(0);
			this._loader = document.createElement('div');
			this._loader.innerHTML = loaderTemplate;

			if (this.$options.autostart) {
				this.turnOn();
			}
		},

		/**
			desc: Show loader overlay
		 */
		turnOn: function() {
			this._container.appendChild(this._loader);
		},

		/**
			desc: Hide loader overlay
		 */
		turnOff: function() {
			if (this._container.contains(this._loader)) {
				this._container.removeChild(this._loader);
			}
		}
	};


/***/ },

/***/ 504:
/***/ function(module, exports) {

	module.exports = "<div class=\"loader__overlay\">\r\n\t<div class=\"loader loader--centered\">\r\n\t\t<span class=\"loader__spinner\"><i></i></span>\r\n\t</div>\r\n</div>\r\n"

/***/ },

/***/ 505:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		'maskedInput': 'masked-input'
	};

	// default settings
	var SETTINGS = {
		definitions: {
			'#': '[0-9]',
			'?': '[A-Za-z]', // to be improved for latin ascii chars
			'*': '\\w'
		},
		placeholder: '_',
		allowedTypes: ['text', 'tel'],
		regexpSpecialChars: ['*', '?']
	};

	/**
	name: Masked input
	type: ui
	desc: >
		Input that represents value according to specified mask and allows input according to that mask.

		this.mask statnds for mask defined in $options.mask. Like this: '(##) ??-?? *#'
		this.inputMask stands for the value that is displayed in input field when active. Like this: '(12) ab-c_ __'

	options:
		inputMask: Mask for defining format of input. Like this '+36## ### ####' for phonenumber in Hungary. # stands for any number, ? stands for latin char, * stands for any word character
		inputMaskDefinitions: JSON with key charackter representing a mask character (like # or ? or *) and a value that can be parsed as RegExp.

	*/
	module.exports = {
		initialize: function() { // eslint-disable-line max-statements
			var definitions;

			// define default options
			this._options = Object.assign({}, SETTINGS);
			this.mask = this.$options.inputMask || '';

			if (this.$options.inputMaskDefinitions) {
				this._options.definitions = this.$options.inputMaskDefinitions;
			}

			// set inputMask from this.mask, i.e. transform '(##) ??-?? *#' to '(__) __-__ __'
			this.inputMask = this.mask;
			this._options.regexpDefinitions = {};

			definitions = Object.keys(this._options.definitions);
			definitions.forEach(function(symbol) {
				var regexpSymbol = symbol;

				if (this._options.regexpSpecialChars.indexOf(symbol) > -1) {
					regexpSymbol = '\\' + symbol;
				}

				this.inputMask = this.inputMask.replace(new RegExp(regexpSymbol, 'g'), this._options.placeholder);
				// save regexp object for particular
				this._options.regexpDefinitions[symbol] = new RegExp(this._options.definitions[symbol]);
			}.bind(this));

			this.hiddenInput = this.$el[0];
			this.visibleInput = document.createElement('input');
			if (SETTINGS.allowedTypes.indexOf(this.hiddenInput.type) > -1) {
				this.visibleInput.type = this.hiddenInput.type;
			} else {
				this.visibleInput.type = 'text';
			}

			if (this.hiddenInput.disabled) {
				this.visibleInput.disabled = true;
			}

			this.hiddenInput.parentNode.insertBefore(this.visibleInput, this.hiddenInput.nextElementSibling);
			this.hiddenInput.classList.add(CLASSES.maskedInput);
			// borrow id to preserve correct label behavior
			this.visibleInput.id = this.hiddenInput.id;
			this.hiddenInput.id = '';

			this.visibleInput.value = this.inputMask;
			this._lastVisibleValue = this.visibleInput.value;

			if (this.hiddenInput.value.length) {
				this._setCaretPosition(0);
				this._pasteText(this.hiddenInput.value);
			}

			this._setCaretPosition(0);
			this._setCaretToNextPlaceholder();
			this._lastCaretPos = this._getCaretPosition();
		},

		ready: function() {
			//bind events
			var input = this.visibleInput;

			this._onKeyPressHandler = this._onKeyPress.bind(this);
			this._onKeyDownHandler = this._onKeyDown.bind(this);
			this._onPasteHandler = this._onPaste.bind(this);
			this._onCutHandler = this._onCut.bind(this);
			this._onInputHandler = this._onInput.bind(this);
			this._onFocusHandler = this._onFocus.bind(this);

			input.addEventListener('keypress', this._onKeyPressHandler);
			input.addEventListener('keydown', this._onKeyDownHandler);
			input.addEventListener('paste', this._onPasteHandler);
			input.addEventListener('cut', this._onCutHandler);
			input.addEventListener('input', this._onInputHandler);
			input.addEventListener('focus', this._onFocusHandler);
		},

		/* handler for keydown event. It's triggered both by hardware and software keyboards */
		_onKeyDown: function(event) { // eslint-disable-line max-statements
			var KEYCODE = {BACKSPACE: 8, DELETE: 46};
			var hadSelection;
			var pos;

			// handle backspace
			if (event.keyCode === KEYCODE.BACKSPACE) {
				event.preventDefault();

				hadSelection = this._clearCurrentSelection();

				if (hadSelection) {
					this._prepareParsedValue();

					return;
				}

				pos = this._getCaretPosition();

				if (pos > 0) {
					pos -= 1;
				}

				this._removeCharAtPos(pos);
				this._setCaretToPreviousPlaceholder();
				this._prepareParsedValue();
			} else if (event.keyCode === KEYCODE.DELETE) {
				event.preventDefault();
				hadSelection = this._clearCurrentSelection();

				if (!hadSelection) {
					this._removeCharAtPos(this._getCaretPosition());
				}

				this._prepareParsedValue();
			}

			// handle situation when input is clear but cursor at the end
			if (this.visibleInput.value === this.inputMask
				&& this._getCaretPosition() === this.visibleInput.value.length
			) {
				this._setCaretPosition(0);
				this._setCaretToNextPlaceholder();
			}
		},

		/* Handler for keypress event which occurs only on hardware keyboards. Event contains charcode in `which` property*/
		_onKeyPress: function(event) {
			var MIN_VISIBLE = 32;

			if (event.getModifierState && event.getModifierState('Control')) {
				return;
			}

			// handle keys that corresponds to printable characters
			if (event.which >= MIN_VISIBLE) {
				this._clearCurrentSelection();
				event.preventDefault();
				this._addChar(String.fromCharCode(event.which));
			}

			this._prepareParsedValue();
		},

		/* Handler for paste event. Cleares current selection and simulates typing symbols from buffer one by one */
		_onPaste: function(event) {
			var clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
			var pastedText = clipboardData.getData('Text');

			this._clearCurrentSelection();

			event.preventDefault();

			this._pasteText(pastedText);
			this._prepareParsedValue();
		},

		/* Handler for cut event */
		_onCut: function(event) {
			event.preventDefault();
			document.execCommand('copy');
			this._clearCurrentSelection();
			this._prepareParsedValue();
		},

		/* Handler for input event which occurs only on software keyboards (Android, iOS).
			Input event does not report which symbol was typed, it just silently modifies input value at current
			cursor position, passing by our validation. Workaround is to reset input mask and paste current input value and apply mask symbol by symbol.
			IMPORTANT: when typing alternative symbol (available via long touch, i.e. typing '5' which is alternative to 't' key)
			three keydown and input events actually occurs, like this:
			- adding t
			- removing t (like backspace)
			- adding 5
		*/
		_onInput: function() {
			var val = this.visibleInput.value;

			if (this.visibleInput.value.length > this.inputMask.length) {
				this.visibleInput.value = this.inputMask;
				this._setCaretPosition(0);
				this._pasteText(val);
				this._lastInputSuccessful = (this.visibleInput.value !== this._lastVisibleValue);
				this._prepareParsedValue();
			} else if (this.visibleInput.value.length < this.inputMask.length) {
				// treating situation with removing previous symbol on alternative symbol input
				if (this._lastInputSuccessful) {
					this._lastCaretPos = this._getCaretPosition();
					this.visibleInput.value = this.inputMask;

					this._setCaretPosition(0);
					this._pasteText(val);
					this._setCaretPosition(this._lastCaretPos);
					this._prepareParsedValue();
				} else {
					// restore previous valid visible state
					this.visibleInput.value = this._lastVisibleValue;
					this._setCaretPosition(this._lastCaretPos);
				}
			}
		},

		/* Handler for focus event. Sets caret to start of user input if field is pristine */
		_onFocus: function() {
			var pos = this._getFirstPlaceholder(0);

			if (pos) {
				requestAnimationFrame(function() {
					this._setCaretPosition(pos);
				}.bind(this));
			}
		},

		/* Paste text to current cursor position */
		_pasteText: function(pastedText) {
			var index = 0;
			var len = pastedText.length;

			for (; index < len; ++index) {
				this._addChar(pastedText.charAt(index));
			}
		},

		/* Delete values from selection (if selection is present).
			Returns true when selection was present, otherwise false */
		_clearCurrentSelection: function() {
			var start = this._getCaretPosition();
			var end = this._getSelectionEnd();
			var realStart = Math.min(start, end);
			var realEnd = Math.max(start, end);
			var cleared = false;
			var pos = realStart;

			for (; pos < realEnd; ++pos) {
				this._removeCharAtPos(pos);
				cleared = true;
			}

			if (cleared) {
				this._setCaretPosition(realStart);
				this._setCaretToNextPlaceholder();
			}

			return cleared;
		},

		/* Returns current caret position (or selectionStart) */
		_getCaretPosition: function() {
			return this.visibleInput.selectionStart;
		},

		/* Returns current selection end */
		_getSelectionEnd: function() {
			return this.visibleInput.selectionEnd;
		},

		/* Sets caret to specified position (also resets selection)*/
		_setCaretPosition: function(pos) {
			if (pos !== this.visibleInput.selectionEnd || pos !== this.visibleInput.selectionStart) {
				this.visibleInput.selectionEnd = pos;
				this.visibleInput.selectionStart = pos;
			}
		},

		/* Add char at current cursor position with respect to mask */
		_addChar: function(char) {
			var pos;
			var maskSymbol;
			var str;

			this._setCaretToNextPlaceholder();
			pos = this._getCaretPosition();
			maskSymbol = this.mask.substr(pos, 1);

			if (this._options.regexpDefinitions[maskSymbol] && this._options.regexpDefinitions[maskSymbol].test(char)) {
				// replace placeholder with symbol
				str = this.visibleInput.value;
				this.visibleInput.value = str.substring(0, pos) + char + str.substring(pos + 1);
				this._setCaretPosition(pos + 1);
			}
		},

		/* Remove char at specified position. Returns true if input char was deleted.
			Otherwise false. Also tries to delete previous symbol if current symbol is part of mask */
		_removeCharAtPos: function(pos) { // eslint-disable-line consistent-return
			var maskSymbol;
			var str;

			if ((pos >= this.visibleInput.value.length)) {
				// if cursor at the end of the input - do nothing
				return false;
			}

			maskSymbol = this.mask.substr(pos, 1);

			if (this._options.definitions[maskSymbol]) {
				// replace symbol with placeholder
				str = this.visibleInput.value;
				this.visibleInput.value = str.substring(0, pos) + this._options.placeholder + str.substring(pos + 1);
				this._setCaretPosition(pos);

				return true;
			} else if (--pos > -1) { // eslint-disable-line no-param-reassign
				// if cursor is not on the masked value - try to remove previous symbol
				return this._removeCharAtPos(pos);
			}
		},

		/* Set caret to the previous unfilled placeholder position starting from current position */
		_setCaretToPreviousPlaceholder: function() {
			var pos = this._getCaretPosition();
			var val = this.inputMask.substring(0, pos);
			var placeholderPosition = val.lastIndexOf(this._options.placeholder);

			if (placeholderPosition > -1) {
				this._setCaretPosition(placeholderPosition + 1);
			}
		},

		/* Set caret to next unfilled placehilder starting from current caret position */
		_setCaretToNextPlaceholder: function() {
			var pos = this._getFirstPlaceholder(this._getCaretPosition());

			this._setCaretPosition(pos);
		},

		/* Returns position of nearest placeholder starting from given position */
		_getFirstPlaceholder: function(pos) {
			var val = this.visibleInput.value.substring(pos);
			var placeholderPosition = val.indexOf(this._options.placeholder);

			if (placeholderPosition > -1) {
				pos += placeholderPosition; // eslint-disable-line no-param-reassign
			}

			return pos;
		},

		/* Parse visible value and set raw user input to value of initial input element */
		_prepareParsedValue: function() {
			var val = this.visibleInput.value;
			var parsedValue = '';
			var index;
			var len = val.length;
			var char;
			var maskChar;

			for (index = 0; index < len; ++index) {
				char = val.charAt(index);
				maskChar = this.inputMask.charAt(index);

				if (maskChar === this._options.placeholder && char !== this._options.placeholder) {
					parsedValue += char;
				}
			}

			this.hiddenInput.value = parsedValue;
			this._lastVisibleValue = val;
			this._lastCaretPos = this._getCaretPosition();
			// trigger jQuery event for validation. To be removed after re-implementation of form/validation
			this.$el.trigger('keyup.validate');
		},

		destroy: function() {
			var input = this.visibleInput;

			input.removeEventListener('keypress', this._onKeyPressHandler);
			input.removeEventListener('keydown', this._onKeyDownHandler);
			input.removeEventListener('paste', this._onPasteHandler);
			input.removeEventListener('cut', this._onCutHandler);
			input.removeEventListener('input', this._onInputHandler);
			input.removeEventListener('focus', this._onFocusHandler);
		}
	};


/***/ },

/***/ 506:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validationMessage = __webpack_require__(502);

	var STATES = {
		opened: 'open',
		closed: 'close'
	};

	var CLASSES = {
		prefix: 'message--',
		closed: 'closed',
		warning: 'alert',
		error: 'error',
		info: 'info',
		success: 'success',
		collapsing: 'collapsing'
	};

	var ICONS = {
		_layout: 'message__icon icon',
		error: 'icon-cross',
		warning: 'icon-warning',
		info: 'icon-notification',
		success: 'icon-check'
	};

	var animationName = 'height';

	/**
	name: Message
	type: ui
	desc: Can show notification to user.
	options:
		autoclose: Number. Sets time for auto close the message in milliseconds.
	events:
		click: Fires by click on close button if it exists.
		transitionend: Fires after finishing of show/hide animations.
	 */
	module.exports = Object.assign({}, validationMessage, {
		events: {
			'click messageClose': '_onClick',
			'transitionend': '_onTransitionEnd'
		},

		ready: function() {
			if ('autoclose' in this.$options) {
				this._startAutoCloseTimer(this.$options.autoclose);
			}

			this.$options.state = this.$el.hasClass(CLASSES.prefix + CLASSES.closed) ? STATES.closed : STATES.opened;
		},

		/**
		 desc: Public method for showing validation message
		 */
		showValidationMessage: function(text) {
			this.setText(text);
			this.open();
		},

		/**
		 desc: Public method for hiding validation message
		 */
		hideValidationMessage: function() {
			this.close();
		},

		/**
		desc:
			Sets text for the message
		args:
			newText: String
		*/
		setText: function(newText) {
			this._afterTransition(function() {
				this.html(newText, this.$elements.messageText);
			}.bind(this));
		},

		/**
		desc:
			Sets type of message, possible values - 'error', 'warning', 'info', 'success'.
		args:
			newType: String
		*/
		setType: function(newType) {
			var typeClasses = this._getTypeClasses();

			this.$el.removeClass(typeClasses).addClass(CLASSES.prefix + newType);
		},

		/**
		desc: >
			Sets type of icon, possible values - any string representing valid icon class (exm: 'icon-error')
		args:
			newIcon: String
		*/
		setIcon: function(newIcon) {
			if (!this.$elements.icon) {
				return;
			}

			this.$elements.icon.removeClass(this.$elements.icon.get(0).className);
			this.$elements.icon.addClass(ICONS._layout + ' ' + newIcon);
		},

		/**
		desc:
			Sets 'error' type of message and sets text for the message.
		args:
			text: String
		*/
		error: function(text) {
			this._message(text, CLASSES.error, ICONS.error);

			return this;
		},

		/**
		desc:
			Sets 'warning' type of message and sets text for the message.
		args:
			text: String
		*/
		warning: function(text) {
			this._message(text, CLASSES.warning, ICONS.warning);

			return this;
		},

		/**
		desc:
			Sets 'info' type of message and sets text for the message.
		args:
			text: String
		 */
		info: function(text) {
			this._message(text, CLASSES.info, ICONS.info);

			return this;
		},

		/**
		desc:
			Sets 'success' type of message and sets text for the message.
		args:
		text: String
		*/
		success: function(text) {
			this._message(text, CLASSES.success, ICONS.success);

			return this;
		},

		/**
		desc:
			Shows the message.
		*/
		open: function() {
			if (this.$options.state === STATES.opened) {
				return;
			}

			this._afterTransition(this._open.bind(this));
		},

		/**
		desc:
			Closes the message.
		 */
		close: function() {
			var dfd = this.$tools.q.defer();

			if (this.$options.state === STATES.closed) {
				dfd.resolve();

				return dfd;
			}

			this._afterTransition(function() {
				this._close(dfd);
			}.bind(this));

			return dfd;
		},

		_onClick: function(event) {
			event.preventDefault();
			this.close();
		},

		_onTransitionEnd: function(event) {
			if (event.propertyName !== animationName) {
				return;
			}

			this.$el.removeClass(CLASSES.collapsing);

			if (this.$options.state === STATES.opened) {
				this.$el.css('height', 'auto');
			}

			if (this._transition) {
				this._transition.resolve();
				this._transition = null;
			}

			this.$events.trigger(this.$options.state);
		},

		_open: function() {
			this.$options.state = STATES.opened;

			this._setHeight();
			this.$el.addClass(CLASSES.collapsing);

			this._transition = this.$tools.q.defer();
		},

		_close: function(dfd) {
			this.$options.state = STATES.closed;
			this._transition = this.$tools.q.defer();

			requestAnimationFrame(function() {
				this._setHeight();

				requestAnimationFrame(function() {
					this.$el.css('height', 0);
					this.$el.addClass(CLASSES.collapsing);
					if (dfd) {
						dfd.resolve();
					}

					if (this.$options.closeAction) {
						this.$tools.data.get(this.$options.closeAction);
					}

				}.bind(this));
			}.bind(this));
		},

		_startAutoCloseTimer: function(closeTime) {
			setTimeout(this.close, closeTime || 0);
		},

		_message: function(msg, type, iconType) {
			this.setText(msg);
			this.setType(type);
			this.setIcon(iconType);
		},

		_setHeight: function() {
			this.$el.css('height', this._getHeight());
		},

		_getHeight: function() {
			return this.$elements.messageContent.outerHeight(true);
		},

		_getTypeClasses: function() {
			return [CLASSES.prefix + CLASSES.info, CLASSES.prefix + CLASSES.success, CLASSES.prefix + CLASSES.warning, CLASSES.prefix + CLASSES.error, CLASSES.prefix + CLASSES.warning].join(' ');
		},

		_afterTransition: function(callback) {
			if (this._transition) {
				this._transition.then(callback);
			} else {
				callback();
			}
		}
	});


/***/ },

/***/ 507:
/***/ function(module, exports) {

	'use strict';

	/**
	 name: Confirmation Dialog
	 type: ui
	 desc: >
	    Modal-box wrapper that triggers events when modal-box 'cancel' or 'confirm' button was clicked. It allows to create
	    a custom behaviour for this events and be more flexible while using modal-box.
		confirmationModalBox - alias that should be used for modal-box component.

	 events:
	    confirm: Fires when modal-box confirm button was clicked.
	    cancel: Fires when modal-box cancel button was clicked.

	 examples:
	    -
	        name: Typical Confirmation Dialog
	        tmpl:
	            include: ../confirmation/[docs]/confirmation.html
	 */
	module.exports = {
		ready: function() {
			this.$components.confirmationModalBox.$events.on('click $confirm', this._onModalBoxConfirm.bind(this));
			this.$components.confirmationModalBox.$events.on('click $cancel', this._onModalBoxCancel.bind(this));
		},

		_onModalBoxCancel: function() {
			this.$events.trigger('cancel');
		},

		_onModalBoxConfirm: function() {
			this.$events.trigger('confirm');
		},

		/**
		 desc: Opens confirmation dialog.
		 */
		show: function() {
			this.$components.confirmationModalBox.show();
		},

		/**
		 desc: Hides confirmation dialog.
		 */
		hide: function() {
			this.$components.confirmationModalBox.hide();
		},

		/**
		 desc: Sets additional text inside confirmation dialog.
		 */
		setAdditionalText: function(data) {
			if (this.$components.confirmationModalBox.$elements.additionalInfoText) {
				this.$components.confirmationModalBox.$elements.additionalInfoText.text(data);
			} else {
				this.$tools.logger.error('Error. There is no data-element="additionalInfoText".');
			}
		}
	};


/***/ },

/***/ 508:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	name: extension for Modal Box
	type: ui
	desc: >
		Allows modal box to load html from from URL specified in "href" attribute of the link
		Element modalBoxContent is obligatory for this component
	options:
		modalBoxTrigger: String. Specifies value of the "data-selector" attribute for searching elements.
	 */

	var loadingClass = 'modal-box--is-loading';

	module.exports = {

		events: {
			'onHide $this': 'hide'
		},

		initialize: function() {
			this._preloaderTmpl = this.$tools.template.parse(__webpack_require__(509));
			this.$tools.dom.find(window.document).on('load.ajax.modal', this._onModalLinkClick.bind(this));
		},

		ready: function() {
			this.$trigger = this.$tools.dom.find('[data-selector="' + this.$options.modalBoxTrigger + '"]');
			this.$trigger.on('click', this._onModalLinkClick.bind(this));
		},

		_setContent: function(html) {
			this.html(html, this.$elements.modalBoxContent);
		},

		hide: function() {
			if (this.$options.clearContent) {
				this.html('', this.$elements.modalBoxContent);
			}
		},

		_showPreloader: function() {
			this._setContent(this._preloaderTmpl());
			this.$el.addClass(loadingClass);
			this.$events.trigger('show');
		},

		_onModalLinkClick: function(event, target) {
			var url = (target || event.currentTarget).href;
			var additionalClass = (target || event.currentTarget).getAttribute('data-additional-content-class') || '';

			event.preventDefault();

			this._showPreloader();
			this.$events.trigger('addClass', additionalClass);

			this.$tools.data.get(url)
				.then(this._contentLoaded.bind(this, additionalClass))
				.catch(this._loadFailed.bind(this));
		},

		_contentLoaded: function(additionalClass, response) {
			this._setContent(response);
			this.$el.removeClass(loadingClass);
			this.$events.trigger('addClass', additionalClass);
		},

		_loadFailed: function() {
			this.$events.trigger('hide');
		}
	};


/***/ },

/***/ 509:
/***/ function(module, exports) {

	module.exports = "<div data-component=\"loader\" data-alias=\"spinner\" data-autostart=\"true\"></div>"

/***/ },

/***/ 510:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		overlay: 'modal-box--is-open',
		html: 'modal-box--is-open'
	};

	module.exports = {
		/**
		 desc: fix for prevent bouncing, when you scroll modalbox on position fixed
		 */
		attachEvents: function(overlay) {
			var startY = 0;
			var overlayStyle = window.getComputedStyle(overlay);

			overlay.addEventListener('touchmove', function(event) {
				// Get the current Y position of the touch
				var curY = event.touches ? event.touches[0].screenY : event.screenY;

				// Determine if the user is trying to scroll past the top or bottom
				// In this case, the window will bounce, so we have to prevent scrolling completely
				var isAtTop = (startY <= curY && overlay.scrollTop === 0);
				var isAtBottom = (startY >= curY && overlay.scrollHeight - overlay.scrollTop === overlayStyle.height);

				if (isAtTop || isAtBottom) {
					event.preventDefault();
				}
			});

			overlay.addEventListener('touchstart', function(event) {
				startY = event.touches ? event.touches[0].screenY : event.screenY;
			});
		},

		showOverlay: function(overlay) {
			overlay.classList.add(CLASSES.overlay);
			document.documentElement.classList.add(CLASSES.html);
		},

		hideOverlay: function(overlay) {
			overlay.classList.remove(CLASSES.overlay);
			document.documentElement.classList.remove(CLASSES.html);
		},

		overlayIsVisible: function(overlay) {
			return overlay.classList.contains(CLASSES.overlay);
		}
	};


/***/ },

/***/ 511:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var helper = __webpack_require__(510);

	/**
	name: Modal Box
	type: ui
	desc: >
		Shows component content in a Lightbox. Adds overlay around the content.
		Content will be centered horizontally and vertically. Can be closed by close icon or by click on overlay.

		Default classes for markup that could be changed by `data-` attributes.

		```
			overlayClass: 'modal-box__overlay',
			contentClass: 'modal-box__content',
			closeBtnClass: 'modal-box__close-btn',
			closeBtnIconsClass: 'icon icon-cross',
		```

	options:
		modalBoxTrigger: String. Specifies ID in HTML for trigger for current modal-box.
		overlayClose: Boolean. If `false` - click on overlay will not close modal-box. If `true`, but option `modal` is also `true` - it will not have any effect.
		modal: Boolean. If `true` - click on overlay will not close modal-box, close button will not be added. Default - `false`.
		additionalContentClass: String. Additional classes to be added to content element.
	events:
		onShow: Fires when modal-box was shown.
		onHide: Fires when modal-box was hidden.
	subscriptions:
		show: Opens modal-box.
		hide: Closes modal-box.
	 */
	module.exports = {
		defaults: {
			overlayClass: 'modal-box__overlay',
			contentClass: 'modal-box__content',
			additionalContentClass: '',
			closeBtnClass: 'modal-box__close-btn',
			closeBtnIconsClass: 'icon icon-cross',

			modal: false,
			overlayClose: true
		},

		events: {
			'click buttonClose': 'hide',
			'click $close': 'hide',
			'show $this': 'show',
			'hide $this': 'hide',
			'addClass $this': '_addClass'
		},

		initialize: function() {
			this.$options = this.$tools.util.extend(true, Object.create(this.defaults), this.$options);
		},

		ready: function() {
			var closeButtonTemplate = '<div class="' + this.$options.closeBtnClass + ' ' + this.$options.closeBtnIconsClass + '"></div>';
			var overlayTemplate = '<div class="' + this.$options.overlayClass + '"></div>';

			// creating clone
			this._clone = this.$el[0].cloneNode();
			this._clone.$component = this;
			this.$el[0].parentNode.replaceChild(this._clone, this.$el[0]);

			// set content class to popup content
			this.$el.addClass(this.$options.contentClass);

			// create overlay
			document.body.insertAdjacentHTML('beforeEnd', overlayTemplate);
			this._overlay = document.body.lastChild;
			this._overlay.appendChild(this.$el[0]);

			if (this.$options.overlayClose && !this.$options.modal) {
				this._overlay.addEventListener('click', this._onOverlayClick.bind(this));
			}

			// add trigger handler
			this._initTriggers();

			// add close button handler
			if (!this.$options.modal) {
				this.$el[0].insertAdjacentHTML('afterBegin', closeButtonTemplate);
				this._closeButton = this.$el[0].firstChild;
				this._closeButton.addEventListener('click', this.hide.bind(this));
			}

			helper.attachEvents(this._overlay);
		},

		/**
			desc: Opens modal-box.
		*/
		show: function() {
			helper.showOverlay(this._overlay);

			this._scrollToValue = window.document.body.scrollTop;

			this.$events.trigger('onShow');
		},

		/**
			desc: Closes modal-box.
		*/
		hide: function() {
			if (!helper.overlayIsVisible(this._overlay)) {
				return;
			}

			helper.hideOverlay(this._overlay);

			window.document.body.scrollTop = this._scrollToValue;
			this._scrollToValue = null;

			this.$events.trigger('onHide');
		},

		/**
		 desc: Cleans modal box HTML.
		 */
		destroy: function() {
			this._clone.$component = null;
			document.body.removeChild(this._overlay);
		},

		_onOverlayClick: function(event) {
			if (event.target !== this._overlay) {
				return;
			}

			this.hide();
		},

		_onShowClick: function(event) {
			event.preventDefault();
			this.show();
		},

		_addClass: function(event, classString) {
			if (this.$options.additionalContentClass) {
				this.$el[0].classList.remove(this.$options.additionalContentClass);
			}

			this.$options.additionalContentClass = classString;

			if (this.$options.additionalContentClass) {
				this.$el[0].classList.add(this.$options.additionalContentClass);
			}
		},

		_initTriggers: function() {
			var triggers;

			if (this.$options.modalBoxTrigger) {
				triggers = [].slice.call(document.querySelectorAll('[data-trigger-id="' + this.$options.modalBoxTrigger + '"]'));
				triggers.push(document.getElementById(this.$options.modalBoxTrigger));
				triggers.forEach(function(trigger) {
					if (trigger) {
						trigger.addEventListener('click', this._onShowClick.bind(this));
					}
				}.bind(this));
			}
		}
	};


/***/ },

/***/ 512:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	name: Number
	type: ui
	desc: Implementation of `<input type="number">`. Contains pretty buttons that change current value by specified `step`.
	options:
		min: Minimum value.
		max: Maximum value.
		step: Specifies step to increase/decrease current value by click on buttons.
		allow-decimal: if true then user is allowed to input decimal fractions
	events:
		change. Fires when value was decreased/increased.
	 */
	module.exports = {
		initialize: function() {
			var buttonsHtml = __webpack_require__(513);
			var newValue = this.$el.find('input').val();

			if (!newValue) {
				newValue = this.$tools.helper.isNumber(this.$options.min) ? this.$options.min : 1;
			}

			this.$el.append(buttonsHtml);
			this._setValue(newValue);
		},
		events: {
			'click button': '_clickHandler',
			'keypress input': '_keypressHandler',
			'change input': '_inputHandler'
		},
		/**
		 desc: Gets or sets current value.
		 args:
		    newValue: Number. Value to set as current.
		 */
		val: function(newValue) {
			if (typeof newValue === 'undefined') {
				return this.$el.find('input').val();
			}
			this._setValue(newValue);
			
			return this;
		},
		/**
		 desc: Disables all controls.
		 */
		disable: function() {
			this.$el.find('button,input').prop('disabled', true);
		},
		/**
		 desc: Enables all controls.
		 */
		enable: function() {
			this.$el.find('button,input').prop('disabled', false);
		},
		_setValue: function(newValue) {
			if (this.$tools.helper.isNumber(this.$options.max) && newValue > this.$options.max) {
				this.$events.trigger('max-limit-exceeded', newValue);
				newValue = this.$options.max; // eslint-disable-line no-param-reassign
			}

			if (this.$tools.helper.isNumber(this.$options.min) && newValue < this.$options.min) {
				this.$events.trigger('min-limit-exceeded', newValue); //TODO need to check
				newValue = this.$options.min; // eslint-disable-line no-param-reassign
			}

			this.$el.find('input').val(newValue);
			this.$events.trigger('change', newValue);
		},
		_clickHandler: function(event) {
			var $button = this.$el.find(event.target);
			var oldValue = this.$el.find('input').val();
			var newValue = parseFloat(oldValue) + ((($button.hasClass('number__control--increase')) ? 1 : -1) * (this.$options.step || 1));

			this._setValue(newValue);
			event.preventDefault();
		},
		_inputHandler: function() {
			var newValue = this.$el.find('input').val();

			this._setValue(newValue);
		},
		_keypressHandler: function(event) {
			var ignore = {min: 48, max: 57};
			// ignore non-numeric chars if no decimals fractions are allowed

			if (this.$options.allowDecimal !== true) {
				if (event.which < ignore.min || event.which > ignore.max) {
					event.preventDefault();
				}
			}
			// otherwise trust the type="number" browser validation for valid
			// numeric value like 3.5 or 3.44E-3
		}
	};


/***/ },

/***/ 513:
/***/ function(module, exports) {

	module.exports = "<button type=\"button\" class=\"number__control number__control--decrease\"></button>\r\n<button type=\"button\" class=\"number__control number__control--increase\"></button>\r\n"

/***/ },

/***/ 514:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tools = __webpack_require__(341);
	var pagerTemplate = tools.template.parse(__webpack_require__(515));
	var pageButtonTemplate = tools.template.parse(__webpack_require__(516));
	var ellipsisTemplate = tools.template.parse(__webpack_require__(517));

	var MODIFIERS = {
		activePage: 'current',
		navDisabled: 'disabled'
	};

	var ACTIVE_PAGES_LIMIT = 5;

	/**
	name: Pager
	type: ui
	desc: Implementation of component for pagination
	options:
		pageSize: Specifies numbers of items on one page
		totalCount: Specifies total number of items
	events:
		pageChanged: Fires when page was changed in any way (next, previous, click on specific page). Passes new page number as argument.
	*/
	module.exports = {
		events: {
			'click pageButton': '_onPageClick',
			'click pagePrevious': '_onPreviousPageClick',
			'click pageNext': '_onNextPageClick'
		},

		initialize: function() {
			var MAX_WINDOW_WIDTH = 767;
			var PAGES_LIMIT = 3;

			if (window.innerWidth < MAX_WINDOW_WIDTH) {
				ACTIVE_PAGES_LIMIT = PAGES_LIMIT;
			}

			this.updateSettings(this.$options.pageSize, this.$options.totalCount);
		},

		/**
	        desc: Updates component settings and resets component markup.
	        args:
	            pageSize: Specifies numbers of items on one page.
	            totalCount: Specifies total number of items.
	            pageNumber: Specifies selected page.
		 */
		updateSettings: function(pageSize, totalCount, pageNumber) {
			this.$options.pageSize = parseInt(pageSize, 10);
			this.$options.totalCount = parseInt(totalCount, 10);
			this.$options.pageNumber = parseInt(pageNumber || this.$options.pageNumber || 1, 10);

			if (this.isSinglePage()) {
				this.$el.hide();

				return;
			}

			this.$el.show();

			this.pagesCount = Math.ceil(this.$options.totalCount / this.$options.pageSize);

			this._resetMarkup(this.$options.pageNumber);
		},

		/**
			desc: Returns current page number.
		 */
		getCurrentPageNumber: function() {
			var $currentPageButton;

			if (!this.$elements.pageButton) {
				return this.$options.pageNumber;
			}

			$currentPageButton = this.$elements.pageButton.filter('.' + MODIFIERS.activePage);

			return $currentPageButton.length ? parseInt($currentPageButton.data('pageNumber'), 10) : 1;
		},

		/**
			desc: Returns true if pager has only one page.
		 */
		isSinglePage: function() {
			return !this.$options.pageSize
				|| !this.$options.totalCount
				|| Math.ceil(this.$options.totalCount / this.$options.pageSize) <= 1;
		},

		_resetMarkup: function(activePageNumber) {
			if (!this.$elements.pages || !this.$elements.pages.length) {
				return this.html(pagerTemplate())
					.then(this._initPagesMarkup.bind(this, activePageNumber));
			}

			return this._initPagesMarkup(activePageNumber);
		},

		_initPagesMarkup: function(activePageNumber) {
			var pagerProperties = this._calculatePagerProperties(activePageNumber);
			var pagesHtml = '';
			var index;

			this.$elements.pages.html('');

			if (pagerProperties.startEllipsis) {
				pagesHtml += pageButtonTemplate({
					pageNumber: 1
				});
				pagesHtml += ellipsisTemplate();
			}

			for (index = pagerProperties.startPage; index < pagerProperties.endPage; index++) {
				pagesHtml += pageButtonTemplate({
					pageNumber: index
				});
			}

			if (pagerProperties.endEllipsis) {
				pagesHtml += ellipsisTemplate();
				pagesHtml += pageButtonTemplate({
					pageNumber: this.pagesCount
				});
			}

			return this.html(pagesHtml, this.$elements.pages)
				.then(this._setButtonsActivityState.bind(this, activePageNumber));
		},

		_calculatePagerProperties: function(activePageNumber) { // eslint-disable-line max-statements
			var startPageIndex = 1;
			var endPageIndex = this.pagesCount + 1;
			var addEndEllipsis = false;
			var addStartEllipsis;

			activePageNumber = activePageNumber || 1; // eslint-disable-line no-param-reassign

			// default settings if total number of pages is less then pages limit

			addStartEllipsis = activePageNumber > ACTIVE_PAGES_LIMIT;

			if (this.pagesCount > ACTIVE_PAGES_LIMIT) {
				if (activePageNumber <= ACTIVE_PAGES_LIMIT || this.pagesCount === ACTIVE_PAGES_LIMIT + 1) {
					startPageIndex = 1;
				} else if (activePageNumber + ACTIVE_PAGES_LIMIT > this.pagesCount) {
					startPageIndex = this.pagesCount - ACTIVE_PAGES_LIMIT + 1;
				} else {
					startPageIndex = Math.ceil(activePageNumber - (ACTIVE_PAGES_LIMIT / 2));
				}

				endPageIndex = startPageIndex + ACTIVE_PAGES_LIMIT;

				if (startPageIndex + ACTIVE_PAGES_LIMIT > this.pagesCount) {
					endPageIndex = this.pagesCount + 1;
				}

				if (this.pagesCount === ACTIVE_PAGES_LIMIT + 1) {
					addStartEllipsis = false;
					addEndEllipsis = false;
					endPageIndex++;
				} else if (activePageNumber <= ACTIVE_PAGES_LIMIT) {
					addEndEllipsis = true;
				} else if (activePageNumber <= (this.pagesCount - ACTIVE_PAGES_LIMIT)) {
					addEndEllipsis = true;
				}
			}

			return {
				activePage: activePageNumber,
				startPage: startPageIndex,
				endPage: endPageIndex,
				startEllipsis: addStartEllipsis,
				endEllipsis: addEndEllipsis
			};
		},

		_onPageClick: function(event) {
			this.$elements.pageButton.removeClass(MODIFIERS.activePage);
			event.$el.addClass(MODIFIERS.activePage);
			this._goToPage(this.getCurrentPageNumber());
		},

		_onPreviousPageClick: function() {
			var currentPage = this.getCurrentPageNumber();

			if (currentPage > 1) {
				this._goToPage(currentPage - 1);
			}
		},

		_onNextPageClick: function() {
			var currentPage = this.getCurrentPageNumber();

			if (currentPage < this.pagesCount) {
				this._goToPage(currentPage + 1);
			}
		},

		_goToPage: function(pageNumber) {
			this._resetMarkup(pageNumber)
				.then(function() {
					this.$events.trigger('pageChanged', pageNumber);
				}.bind(this));
		},

		_setButtonsActivityState: function(activePageNumber) {
			this.$elements.pageButton.removeClass(MODIFIERS.activePage);
			this.$elements.pageButton.filter('[data-page-number="' + activePageNumber + '"]').addClass(MODIFIERS.activePage);
			this.$elements.pagePrevious.toggleClass(MODIFIERS.navDisabled, activePageNumber < 2);
			this.$elements.pageNext.toggleClass(MODIFIERS.navDisabled, activePageNumber >= this.pagesCount);
		}
	};


/***/ },

/***/ 515:
/***/ function(module, exports) {

	module.exports = "<a class=\"pager__button previous\" data-element=\"pagePrevious\">previous</a>\r\n<span data-element=\"pages\" class=\"pager__holder\"></span>\r\n<a class=\"pager__button next\" data-element=\"pageNext\">next</a>\r\n"

/***/ },

/***/ 516:
/***/ function(module, exports) {

	module.exports = "<a class=\"pager__button\" data-element=\"pageButton\" data-page-number=\"<%= pageNumber %>\"><%= pageNumber %></a>\r\n"

/***/ },

/***/ 517:
/***/ function(module, exports) {

	module.exports = "<span class=\"pager__elipsis\">…</span>\r\n"

/***/ },

/***/ 518:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		passedClass: 'passed-step',
		prevClass: 'prev-step',
		backwardClass: 'backward-step',
		noAnimationClass: 'passed-no-animation'
	};

	var CONSTANTS = {
		storageName: 'progressPreviousStep',
		prevDirection: 'prev',
		nextDirection: 'next',
		currentStep: 'current'
	};

	/**
	name: Progress Tracker
	type: ui
	desc: >
		Shows animation on Progress Tracker, considering direction (back,next buttons)
	options:
		passed-step: html class. Should have all passed steps.
		data-step="current": Data attribute which Should have current step.
	*/
	module.exports = {
		ready: function() {
			this._handle();
		},
		
		_handle: function() {
			var currentStep = this._getCurrentStep();
			var previousStep = this._getPreviousStep();
			var direction = this._getDirection(currentStep, previousStep);
			var item = this._getElementByStepNumber(currentStep);
			
			if (currentStep) {
				if (currentStep === previousStep) {
					this._setNoAnimationClass(item);
				}
				
				if (direction === CONSTANTS.nextDirection) {
					this._progressNext(item);
				} else {
					this._progressPrev(item);
				}
			}
			
			this._setStorageProp(currentStep);
		},
		
		_getDirection: function(currentStep, previousStep) {
			return currentStep < previousStep ? CONSTANTS.prevDirection : CONSTANTS.nextDirection;
		},
		
		_getCurrentStep: function() {
			var currentStep = 0;
			
			this.$elements.step.forEach(function(item, index) {
				if (item.dataset.step === CONSTANTS.currentStep) {
					currentStep = index;
				}
			});
			
			return currentStep;
		},
		
		_getElementByStepNumber: function(stepNumber) {
			return this.$elements.step[stepNumber];
		},

		_progressNext: function(item) {
			item.classList.add(CLASSES.passedClass);
		},
		
		_progressPrev: function(item) {
			var prevItem = this._getElementByStepNumber(this._getCurrentStep() + 1);
			
			prevItem.classList.add(CLASSES.prevClass);
			item.classList.add(CLASSES.prevClass);
			
			window.requestAnimationFrame(function() {
				prevItem.classList.add(CLASSES.backwardClass);
			});
		},
		
		_setNoAnimationClass: function(item) {
			item.classList.add(CLASSES.noAnimationClass);
		},
		
		_getPreviousStep: function() {
			var storageData = this._getStorageProp();

			return storageData[this.$options.flowId];
		},
		
		_setStorageProp: function(step) {
			var obj = this._getStorageProp();
			
			obj[this.$options.flowId] = step;
			
			sessionStorage.setItem(CONSTANTS.storageName, JSON.stringify(obj));
		},
		
		_getStorageProp: function() {
			var storageData = sessionStorage.getItem(CONSTANTS.storageName);
			
			return storageData ? JSON.parse(storageData) : {};
		}
	};


/***/ },

/***/ 519:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Form radio
	type: ui
	desc: Wrapper for native radios
	events:
		change: Fires when radio state changes
	*/
	module.exports = {
		events: {
			'change choice': '_onChange'
		},

		initialize: function() {
			this.$selection = this._getSelectedChoice();
		},

		/**
		 	desc: Public method for taking current value of radio group
		 */
		getValue: function() {
			return this.$selection.val();
		},

		/**
		 	desc: Public method for taking custom attribute value from selected radio
		 	args: String. Custom attribute name
		 */
		getCustomAttribute: function(attr) {
			return this.$selection[0].getAttribute(attr);
		},

		/**
		 	desc: Public method for taking current value of radio group
		 */
		getNameValuePair: function() {
			var result = [];

			result[this.$elements.choice.get(0).name] = this.getValue();

			return result;
		},

		_onChange: function(event) {
			this.$selection = event.$el;

			this.$events.trigger('change', this.getValue());
		},

		_getSelectedChoice: function() {
			return this.$elements.choice.filter(function(index, choice) {
				return choice.checked;
			});
		}
	};


/***/ },

/***/ 520:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Range slider
	type: ui
	desc: >
		Creates component for picking some data range.
	options:
		from: set start value for min point
		to: set start value for max point
		single: if true - creates single slider for picking only one value.
			Min point will be set as first value of min select.
		tooltip: set this property for each options inside selects to define tooltip text for each value.
			by default it will be just current value.
	*/

	module.exports = {
		ready: function() {
			this.$line = this.$el.find('.range-slider__points');

			this.from = this.$options.from ? this.$components.fromSelect.getIndex(this.$options.from) : 0;
			this.to = this.$options.to ?
				this.$components.toSelect.getIndex(this.$options.to) :
				this.$components.toSelect.getLength();

			this._setFrom(this.from);
			this._setTo(this.to);
		},

		events: {
			'move $from': '_moveFrom',
			'move $to': '_moveTo',
			'click .range-slider__line': '_containerClick',
			'change $fromSelect': '_fromSelectChanged',
			'change $toSelect': '_toSelectChanged'
		},

		_getTooltipText: function(value) {
			return this.$components.toSelect.getTooltip(value);
		},

		_getContainer: function() {
			return this.$el.find('.range-slider__container');
		},

		_moveFrom: function(event, coordX) {
			var container = this._getContainer();
			var containerX = container.offset().left;
			var width = container.width();
			var shift = coordX - containerX;
			var length;

			length = this.$components.fromSelect.getLength() - 1;

			this._setFrom(Math.round((shift * length) / width));
		},

		_moveTo: function(event, coordX) {
			var container = this._getContainer();
			var containerX = container.offset().left;
			var width = container.width();
			var shift = coordX - containerX;
			var length;

			length = this.$components.toSelect.getLength() - 1;

			this._setTo(Math.round((shift * length) / width));
		},

		_containerClick: function(event) {
			if (!this.$options.single) {
				return;
			}

			this._moveTo({}, event.pageX);
		},

		_prepareValue: function(value) {
			var max = this.$components.toSelect.getLength();

			if (value > max) {
				return max;
			}

			if (value < 0) {
				return 0;
			}

			return value;
		},
		/**
			desc: set value for "from" point
			args:
				value: set new Value
		*/
		setFrom: function(value) {
			this._setFrom(this.$components.fromSelect.getIndex(value));
		},

		_setFrom: function(value) {
			if (value >= this.to) {
				this._updateFromSelect();

				return;
			}

			value = this._prepareValue(value); // eslint-disable-line no-param-reassign

			this.from = value;

			this.$components.from.setTooltipText(this._getTooltipText(this.from));

			this._updateLineWidth();
			this._updateLinePosition();
			this._updateFromSelect();
			this._change();
		},

		/**
			desc: set value for "to" point
			args:
				value: set new Value
		*/
		setTo: function(value) {
			this._setTo(this.$components.toSelect.getIndex(value));
		},

		_setTo: function(value) {
			if (!this.$options.single && value <= this.from) {
				this._updateToSelect();

				return;
			}

			value = this._prepareValue(value); // eslint-disable-line no-param-reassign

			this.to = value;

			this.$components.to.setTooltipText(this._getTooltipText(this.to));

			this._updateLineWidth();
			this._updateToSelect();
			this._change();
		},

		_change: function() {
			this.$events.trigger('change', this.getRange());
		},

		_updateLineWidth: function() {
			var PERCENT = 100;
			var shift = this.to - this.from;
			var length = this.$components.toSelect.getLength() - 1;

			this.$line.width(((shift * PERCENT) / length) + '%');
		},

		_updateFromSelect: function() {
			this.$components.fromSelect.setValue(this.from);
		},

		_updateToSelect: function() {
			this.$components.toSelect.setValue(this.to);
		},

		_updateLinePosition: function() {
			var PERCENT = 100;
			var length = this.$components.toSelect.getLength() - 1;

			this.$line.css('left', ((this.from * PERCENT) / length) + '%');
		},

		/**
			desc: return current values of slider
		*/
		getRange: function() {
			return {
				from: this.$components.fromSelect.getValue(this.from),
				to: this.$components.toSelect.getValue(this.to)
			};
		},

		_fromSelectChanged: function() {
			this._setFrom(this.$components.fromSelect.value());
		},

		_toSelectChanged: function() {
			this._setTo(this.$components.toSelect.value());
		}
	};


/***/ },

/***/ 521:
/***/ function(module, exports) {

	'use strict';

	/**
		name: Range slider
		type: ui
		desc: Creates pointer for slider
		events:
			move: trigger when need to move pointer
			args:
			pageX: pageX where need to move pointer
	 */

	module.exports = {
		events: {
			'mousedown': '_mouseDown',
			'touchstart': '_mouseDown'
		},

		_mouseDown: function() {
			var mouseMoveHandler = this._mouseMove.bind(this);
			var mouseUpHandler = function() {
				document.body.removeEventListener('mousemove', mouseMoveHandler);
				document.body.removeEventListener('touchmove', mouseMoveHandler);
			};

			document.body.addEventListener('mousemove', mouseMoveHandler);
			document.body.addEventListener('touchmove', mouseMoveHandler);
			document.body.addEventListener('mouseup', mouseUpHandler);
			document.body.addEventListener('touchend', mouseUpHandler);
			document.body.addEventListener('mouseleave', mouseUpHandler);
		},

		_mouseMove: function(event) {
			this.$events.trigger('move', event.pageX);
		},

		/**
			desc: set tooltip text for pointer
			args:
				text: new tooltip text
		 */
		setTooltipText: function(text) {
			if (!this.$components.tooltip) {
				return;
			}

			this.$components.tooltip.text(text);
		},

		/**
			desc: Show pointer tooltip
		 */
		showTooltip: function() {
			if (!this.$components.tooltip) {
				return;
			}

			this.$components.tooltip.show();
		},

		/**
			desc: Hide pointer tooltip
		 */
		hideTooltip: function() {
			if (!this.$components.tooltip) {
				return;
			}

			this.$components.tooltip.hide();
		}
	};


/***/ },

/***/ 522:
/***/ function(module, exports) {

	'use strict';

	/**
		name: Range slider
		type: ui
		desc: Creates select for slider
	 */

	module.exports = {
		/**
			desc: return total count of options
		 */
		getLength: function() {
			return this.$el.find('option').length;
		},

		_getOption: function(index) {
			return this.$el.find('option').eq(index);
		},

		/**
			desc: return value of option by index
			args:
				index: index from which need get value
		 */
		getValue: function(index) {
			return this._getOption(index).val();
		},

		/**
			desc: return current selected value
		 */
		value: function() {
			return this.$el.find('option:selected').index();
		},

		/**
			desc: get index of option by value
			args:
				value: value of option
		 */
		getIndex: function(value) {
			return this.$el.find('option[value="' + value + '"]').index();
		},

		/**
			desc: return tooltip of option by index
			args:
				index: option index
		 */
		getTooltip: function(index) {
			return this._getOption(index).data('tooltip') || this.getValue();
		},

		/**
			desc: set value by option index
			args:
				index: option index
		 */
		setValue: function(index) {
			var option = this._getOption(index);

			if (option.prop('selected')) {
				return;
			}

			option.prop('selected', true);

			this.$el.find('select').trigger('change');
		}
	};


/***/ },

/***/ 523:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var	pubsub = __webpack_require__(23);
	var jqScrollTo = __webpack_require__(428);

	module.exports = {
		events: {
			'click': '_scrollTo'
		},

		_scrollTo: function(event) {

			var isMobile = this.$tools.browser.isMobile;
			var only = this.$options.only;
			var shouldScroll = !only || (isMobile && only === 'mobile') || (!isMobile && only === 'desktop');
			var SCROLL_TO = 200;

			event.preventDefault();

			if (shouldScroll) {
				this.scrollTo(this.$tools.dom.find(this.$options.target), this.$options.speed || SCROLL_TO);
			}
		},

		scrollTo: function($target, speed, offset) {
			pubsub.publish('header.height', function(headerHeight) {
				jqScrollTo($target, speed, { offset: (-offset || 0) - headerHeight });
			});
		}
	};


/***/ },

/***/ 524:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dropdown = __webpack_require__(493);
	var selectDropdown = Object.create(dropdown);

	selectDropdown.events = Object.assign({}, dropdown.events, {
		'change select': '_onSelectChange'
	});

	selectDropdown.initialize = function() {
		// init parent
		dropdown.initialize.call(this);

		this.$select = this.$el.find('select');
		this.$label = this.$el.find('[data-selector="label"]');
		this.initVal = this.getValue();
		// update currently displayed label
		this._updateSelected();
	};

	/**
		desc: Gets current value
	*/
	selectDropdown.getValue = function() {
		return this.$select.val();
	};

	/**
		desc: Gets text of selected option
	*/
	selectDropdown.getCurrentOption = function() {
		return this.$select.find(':selected');
	};

	/**
		desc: Gets text of selected option
	*/
	selectDropdown.getCurrentText = function() {
		return this.getCurrentOption().text();
	};

	/**
		desc: Gets HTML of selected option
	*/
	selectDropdown.getCurrentHtml = function() {
		var currentValue = this.getValue();
		var currentItem = this.$el.find('li[data-value="' + currentValue + '"] [data-selector="option-label"]');

		return currentItem.html();
	};

	// protected methods
	selectDropdown._updateSelected = function() {
		this.$label.html(this.getCurrentHtml());
	};

	selectDropdown._onSelectChange = function(event) {
		var value = event.$el.val();

		this._updateSelected();
		this.$events.trigger('change', value);
		this.close();
	};

	selectDropdown._onChooseOption = function(event) {
		var value = event.currentTarget.dataset.value || '';

		if (this.$options.preventDefault === true) {
			event.preventDefault();
		}
		
		if (value !== this.getValue()) {
			this.$select.val(value);
			this._updateSelected();
			this.$events.trigger('change', value);
		}

		this.toggle();
	};

	/**
		name: select-dropdown
		type: ui
		desc: select with html-enabled options
		events:
			change: fires when state is changed. Supplies value
			open: Fires when dropdown was shown.
			close: Fires when dropdown was hidden.

		options:
			preventDefault: prevent native browser event handling
	*/
	module.exports = selectDropdown;


/***/ },

/***/ 525:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		disabled: 'form-select--disabled',
		placeholderFix: 'form-select--not-selected',
		busy: 'form-select--busy'
	};

	/**
	name: Select
	type: ui
	desc: Pretty wrapper for `<select>` component.
	options:
		submit: Submits closest form if specified.
		ajax: Sends current data via AJAX-request by URL specified in this attribute.
	events:
		change: Fires when value was changed. Current value will be passed to event handler.
	*/
	module.exports = {
		initialize: function() {
			this.initVal = this._select().val();
		},

		events: {
			'change select': '_onChange'
		},

		/**
		 desc: Selects first value.
		 */
		selectFirst: function() {
			var first = this.$tools.dom.find('option:first', this.$el);

			if (first.is(':selected')) {
				return;
			}

			this.$tools.dom.find('option', this.$el).prop('selected', false);
			first.prop('selected', true);

			this._onChange();
		},

		/**
		 desc: Switches to `disabled` state.
		 */
		disable: function() {
			this.toggleState(true);
		},

		/**
		 desc: Switches to `enabled` state.
		 */
		enable: function() {
			this.toggleState(false);
		},

		/**
		 desc: Switches between 'enabled' and 'disabled' state
		 */
		toggleState: function(disabled) {
			this.$el.toggleClass(CLASSES.disabled, disabled === true);
			this._select().prop('disabled', disabled === true);
		},

		/**
		 desc: Resets value to default.
		 */
		resetSelect: function() {
			this._select().val(this.initVal);
		},

		/**
		 desc: Saves current value as a default. For future reset
		 */
		saveCurrentValue: function() {
			this.initVal = this._select().val();
			this.$el.find('option').removeAttr('selected');
			this.$el.find('option[value=' + this.initVal + ']')
				.attr('selected', 'selected')
				.prop('selected', true);
		},

		/**
		 desc: Gets current value.
		 */
		getValue: function() {
			return this._select().val();
		},

		/**
		 desc: Gets text of selected option.
		 */
		getCurrentText: function() {
			return this.getCurrentOption().text();
		},

		/**
		 desc: Gets current selected option.
		 */
		getCurrentOption: function() {
			return this._select().find(':selected');
		},

		/**
		 desc: Switches select to `loading` state. Returns Deferred that allows to stop loading.
		 */
		activityIndicator: function() {
			var dfd = this.$tools.q.defer();

			this.$el.addClass(CLASSES.busy);
			this.disable();

			dfd.finally(function() {
				this.$el.removeClass(CLASSES.busy);
				this.enable();
			}.bind(this));

			return dfd;
		},

		/**
		  desc: Add/substitute select options
		  arguments: >
		  	data: Array. Array of new options
		*/
		updateOptions: function(data) {
			this._select().html('');
			if (data.length) {
				this._select().html(data.map(function(item) {
					return '<option value="' + item.value + '">' + item.label + '</option>';
				}).join(''));
				this.selectFirst();
			}
		},

		/**
		  desc: Disable option with certain value
		  arguments: >
		  	value: String. Option value
		*/
		disableOption: function(value) {
			this.toggleOptionState(value, true);
		},

		/**
		  desc: Enables option with certain value
		  arguments: >
		  	value: String. Option value
		*/
		enableOption: function(value) {
			this.toggleOptionState(value, false);
		},

		/**
		  desc: Toggles state of the option with certain value
		  arguments: >
		  	value: String. Option value
		*/
		toggleOptionState: function(value, disabled) {
			this.$tools.dom.find('option[value="' + value + '"]', this.$el).prop('disabled', disabled);
		},

		/**
		  desc: Checks select for containing non-disabled options
		*/
		canChoose: function() {
			return this.$tools.dom.find('option:not(:disabled)').length !== 0;
		},

		/**
		 desc: Set select with choosen value
		 */
		setValue: function(value) {
			this._select().get(0).value = value;
		},

		_onChange: function() {
			var data;
			var url;

			this._select().removeClass(CLASSES.placeholderFix);

			this.$events.trigger('change', this._select().val());

			if (this.$options.submit) {
				this.$el.parents('form:first').submit();
			}

			if (this.$options.ajax) {
				data = this.$el.data();
				url = data.ajax;

				delete data.component;
				delete data.alias;
				delete data.group;
				delete data.ajax;

				data.value = this._select().val();

				this.$tools.data.ajax({
					type: data ? 'POST' : 'GET',
					async: true,
					contentType: 'application/json',
					url: url,
					data: data ? JSON.stringify(data) : ''
				});
			}
		},

		_select: function() {
			return this.$elements.select || this.$el.find('select');
		}
	};


/***/ },

/***/ 526:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		events: {
			'click button.speech-bubble__close': 'close'
		},

		initialize: function() {
			// move bubble to the root level to prevent wrong positioning with relatively positioned container
			this.$tools.dom.find('body').append(this.$el);

			this.isOpen = true;
			this.format = false;

			this.clickedToggleClass = 'toggle--clicked';

			this.$closeButton = this.$el.find('button.speech-bubble__close');

			this.$toggleButton = this._getToggleButton();
			this.$toggleButton.on('click', this.onToggleBubble.bind(this));
			this.$toggleButton.on('focusin', this.onFocusIn.bind(this));
			this.$toggleButton.on('focusout', this.onFocusOut.bind(this));

			this.win = this.$tools.dom.find(window);
			this.win.on('load resize orientationchange', this._checkState.bind(this));

			this.$tools.data.pubsub.subscribe('speech.bubble.open', this._onOpen.bind(this));
			this.$tools.data.pubsub.subscribe('speech.bubble.close', this._onClose.bind(this));

			this.close();

			this.$tools.dom.find(window).on('scroll', this._adjustPosition.bind(this));
		},

		ready: function() {
			this.$el.addClass('is-loaded');
		},

		onToggleBubble: function(event) {
			var $toggle;

			if (this.isOpen) {
				this.close();
				clearTimeout(this.focusOpenDelay);
			} else {
				if (event && event.currentTarget) {
					$toggle = this.$tools.dom.find(event.currentTarget);
					$toggle.addClass(this.clickedToggleClass);
					event.preventDefault();
				}

				setTimeout(this.open.bind(this), 0);
			}
		},

		onFocusIn: function() {
			var TIMEOUT_OPEN = 150;

			this.focusOpenDelay = setTimeout((function() {
				if (!this.isOpen) {
					setTimeout(this.open.bind(this), 0);
				}
			}).bind(this), TIMEOUT_OPEN);
		},

		onFocusOut: function() {
		},

		onGlobalClick: function(event) {
			if (!this.isOpen ||
				this.$tools.dom.find(event.target).closest('.speech-bubble').length ||
				this.$toggleButton.find(event.target).length) {
				return;
			}

			this.close();
		},

		open: function() {
			if (this.isOpen) {
				return;
			}

			this.isOpen = true;

			this._adjustPosition();

			this.$el.addClass('is-open');
			this.$toggleButton.addClass('is-active');

			this.$tools.dom.find('body').on('click', this.onGlobalClick.bind(this));

			this.$events.trigger('open');
		},

		close: function() {
			if (!this.isOpen) {
				return;
			}

			this.isOpen = false;

			this.$el.removeClass('is-open');
			this.$toggleButton.removeClass(this.clickedToggleClass);
			this.$toggleButton.removeClass('is-active').trigger('blur');

			this.$tools.dom.find('body').off('click');

			this.$events.trigger('close');
		},

		setFormat: function(format) {
			this.format = format;

			this._adjustPosition();
		},

		_getToggleButton: function() {
			// search toggle button by specified JQuery selector
			var $toggle = this.$tools.dom.find(this.$options.toggleTarget);

			if (!$toggle.length) {
				// if not found - try to find by ID
				$toggle = this.$tools.dom.find('#' + this.$options.toggleTarget);
			}
			
			return $toggle;
		},

		_checkState: function() {
			if (this.isOpen) {
				this._adjustPosition();
			}
		},

		_adjustPosition: function() {
			var $toggle = this.$toggleButton;
			var xPosition;
			var winWidth;
			var MARGIN_TOP = 4;

			if ($toggle.length > 1) {
				$toggle = $toggle.filter('.' + this.clickedToggleClass);
			}

			if (this.format) {
				this.$el.css({
					top: $toggle.outerHeight() + $toggle.position().top + MARGIN_TOP + this.format.top,
					left: $toggle.position().left + this.format.left,
					width: this.format.width,
					height: this.format.height
				});
			} else {
				xPosition = $toggle.offset().left;
				winWidth = this.win.width();

				this.$el.css({top: $toggle.outerHeight() + $toggle.offset().top + MARGIN_TOP});

				// check horizontal fit
				if (xPosition + this.$el.outerWidth() > winWidth || this.$options.position === 'right') {
					xPosition = winWidth - $toggle.outerWidth() - xPosition;
					this.$el.css({
						left: 'auto',
						right: xPosition
					}).addClass('reverce');

				} else {
					this.$el.css({
						left: xPosition,
						right: 'auto'
					}).removeClass('reverce');
				}
			}
		},

		_onOpen: function(event, bubbleToOpen) {
			if (bubbleToOpen && bubbleToOpen === this.$options.toggleTarget) {
				this.open();
			}
		},

		_onClose: function(event, bubbleToOpen) {
			if (bubbleToOpen && bubbleToOpen === this.$options.toggleTarget) {
				this.close();
			}
		}
	};


/***/ },

/***/ 527:
/***/ function(module, exports) {

	'use strict';

	var SELECTORS = {
		firstOption: '[data-selector="first-option"]',
		secondOption: '[data-selector="second-option"]',
		checked: 'input:checked'
	};

	var ATTRIBUTES = {
		loading: 'data-loading',
		checked: 'checked',
		disabled: 'disabled'
	};

	/**
		name: Switcher
		type: ui
		desc: Implementation of toggle component with two states.
		options:
			loading: Adds activity indication.
		events:
			change: Fires when current state was changed. Passes new value as argument.
	*/
	module.exports = {
		events: {
			'change': '_onValueChange'
		},

		initialize: function() {
			this._first = this.$el.find(SELECTORS.firstOption)[0];
			this._second = this.$el.find(SELECTORS.secondOption)[0];
			this._checked = this.$el.find(SELECTORS.checked);
		},

		/**
			desc: Enables loading state and returns promise to resolve activity process.
		*/
		activityIndicator: function() {
			var dfd = this.$tools.q.defer();

			this.setLoading();

			dfd.finally(this.resetLoading.bind(this));

			return dfd;
		},

		/**
			desc: Sets component to loading state.
		*/
		setLoading: function() {
			this.$el.attr(ATTRIBUTES.loading, true);
		},

		/**
			desc: Resets component to default state.
		*/
		resetLoading: function() {
			this.$el.removeAttr(ATTRIBUTES.loading);
		},

		/**
			desc: Gets value of currently selected option.
		*/
		getValue: function() {
			return this._checked.val();
		},

		/**
			desc: Return true if switcher is checked, false - in other case.
			*/
		isChecked: function() {
			return this._first.checked;
		},

		/**
			desc: Sets new value.
			args:
				value: Boolean. Value to set. Pass `true` to select first option and `false` for second.
		*/
		setValue: function(value) {
			this._first.checked = value;
			this._second.checked = !value;

			this._onValueChange();
		},

		/**
			desc: return name of the inputs
		*/
		getName: function() {
			return this._first.name;
		},

		/**
			desc: Set switcher as enabled
		*/
		enable: function() {
			this._checked[0].disabled = false;
		},

		/**
			desc: Set switcher as disabled
		*/
		disable: function() {
			this._checked[0].disabled = true;
		},

		/**
			desc: Check switcher is enabled or disabled
		*/
		isEnabled: function() {
			return !this._checked[0].disabled;
		},

		_onValueChange: function() {
			this._checked = this.$el.find(SELECTORS.checked);
			this.$events.trigger('change', this.getValue());
		}
	};


/***/ },

/***/ 528:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CLASSES = {
		activeClass: 'is-active',
		openClass: 'is-open'
	};

	/**
	name: Tab Panel
	type: ui
	desc: >
		Implementation of tab panel component. Renders tabs (or other variants of triggers) with only one active content.
		Content will be switched by click on tab (link, select).
	options:
	 	active: specific tab can be opened on page loading by adding 'active' data attribute with value of any tab ID.
	 	moreText: text you want to be displayed on flexNav tab.
	*/
	module.exports = {

		events: {
			'click tabLink': '_onTabChange',
			'change tabSelect': '_onTabChange',
			'click flexnavTrigger': '_toggleFlexnav'
		},

		initialize: function() {
			var _checkActiveValue = this._checkActiveClass();
			var _setActiveTabValue = this.$elements.tab[0].dataset.id;

			if (_checkActiveValue) {
				_setActiveTabValue = _checkActiveValue.dataset.id;
			} else if (this.$options.active) {
				_setActiveTabValue = this.$options.active;
			}
			this.setActiveTab(_setActiveTabValue);
		},

		ready: function() {
			if (this.$components.tabSelect) {
				this._initializeSelect();
			}

			this._createFlexnav();
		},

		/**
		 desc: Return active tab ID.
		 */
		getActiveTabId: function() {
			return this._activeTab.dataset.id;
		},
		/**
		 desc: Takes ID and sets tab with that ID active.
		 args:
		 tabId: String - tab ID.
		 */
		setActiveTab: function(tabId) {
			if (this._activeTab) {
				this._activeTab.classList.remove(CLASSES.activeClass);
				if (this._activePanel) {
					this._activePanel.classList.remove(CLASSES.activeClass);
				}
			}

			this._activeTab = this._getTabById(tabId);
			this._activePanel = this._getPanelById(tabId);
			this._activeTab.classList.add(CLASSES.activeClass);

			if (this._activePanel) {
				this._activePanel.classList.add(CLASSES.activeClass);
			}
		},

		_onTabChange: function(event) {
			event.preventDefault();

			this.setActiveTab(event.$el[0].parentNode.dataset.id || event.$el[0].value);

			if (this.$components.tabSelect) {
				this._setActiveSelectOption();
			}
		},

		_onGlobalClick: function(event) {
			if (this.$elements.flexnavTrigger[0].contains(event.target)) {
				return;
			}

			if (this.$elements.flexnavMain[0].classList.contains(CLASSES.openClass)) {
				this._toggleFlexnav();
			}
		},

		_toggleFlexnav: function() {
			this.$elements.flexnavMain.toggleClass(CLASSES.openClass);
		},

		_getTabById: function(tabId) {
			return this.$elements.tab.get().filter(function(tab) {
				return tab.dataset.id === tabId;
			})[0];
		},

		_checkActiveClass: function() {
			return this.$elements.tab.get().filter(function(tab) {
				return tab.classList.contains(CLASSES.activeClass);
			})[0];
		},

		_getPanelById: function(panelId) {
			return this.$elements.panel.get().filter(function(panel) {
				return panel.dataset.id === panelId;
			})[0];
		},

		_setActiveSelectOption: function() {
			this.$components.tabSelect.setValue(this._activeTab.dataset.id);
		},

		// Flex nav

		_createFlexnav: function() {
			// Calculate width and figure out how many links will be in a flexnav drop
			var widthSum = 0;
			var listWidth = this.$elements.list.width();
			var flexnavDefaultTemplate;
			var flexnavTemplate;
			var flexnavItems;

			this.$elements.tab.get().some(function(item, index) {
				widthSum += item.clientWidth;

				if (widthSum > listWidth) {
					flexnavDefaultTemplate = this.$tools.template.parse(__webpack_require__(529));

					if (!this.$options.moreText) {
						this.$options.moreText = 'More';
						this.$tools.logger.error('Error. The attribute data-more-text should be added');
					}

					if (!this.$elements.flexnavDrop) {
						flexnavTemplate = flexnavDefaultTemplate({
							moreText: this.$options.moreText
						});

						flexnavItems = this.$elements.tab.get().slice(index - 1);

						this.html(flexnavTemplate, this.$elements.list, 'beforeend')
							.then(function() {

								flexnavItems.forEach(function(item) {
									this.$elements.flexnavDrop[0].appendChild(item);
								}.bind(this));
							}.bind(this));
					}

					document.body.addEventListener('click', this._onGlobalClick.bind(this));

					return true;
				}

				return false;
			}.bind(this));
		},

		// should be removed when select initial options will be configured on BE

		_initializeSelect: function() {
			var options = this.$elements.tab.get().map(function(tab) {
				return {
					value: tab.dataset.id,
					label: tab.firstElementChild.textContent
				};
			});

			this.$components.tabSelect.updateOptions(options);

			this._setActiveSelectOption();
		}
	};


/***/ },

/***/ 529:
/***/ function(module, exports) {

	module.exports = "<li data-element=\"flexnavMain\" class=\"flexnav\">\r\n\t<a href=\"#\" data-element=\"flexnavTrigger\" class=\"flexnav__toggler\"><%= moreText %></a>\r\n\t<ul data-element=\"flexnavDrop\" class=\"flexnav__subnav\"></ul>\r\n</li>\r\n"

/***/ },

/***/ 530:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		expanded: 'is-expanded',
		rowExpanded: 'datatable__expanded',
		tableVisible: 'datatable__visible'
	};

	/**
	name: Tables body
	type: ui
	desc: >
		Row of table content. Includes
			1. row with displayed data
			2. dependant row for displaying data in responsive state
			3. dependant row for loading nesting content

		Handles expanding of dependant rows.
	events:
		selectRow: fires when user clicked on row. Used for Linkable extension.
		deleteRow: fires when user clicks on component with 'removeTrigger' alias. Initiator component is provided as data
		switcherChanged: fires when switcher change
	*/
	module.exports = {
		events: {
			'click rowExpander': '_onToggleChild',
			'click row': '_onRowClick',
			'change $$switchers': '_switcherChanged',
			'click $removeTrigger': '_onRemoveClick'
		},

		/**
		 desc: Expand/collapse dependant rows.
		 */
		toggle: function(condition) {
			this.$options.expandState = arguments.length ? !!condition : !this.$options.expandState;
			this.$elements.rowExpander.toggleClass(CLASSES.expanded, this.$options.expandState);
			this.$el.toggleClass(CLASSES.rowExpanded, this.$options.expandState);
			this.$elements.rowChild.toggle(this.$options.expandState);
			this._showNestable();
			this.$events.trigger('toggle', {
				rowValue: this.$options.value,
				state: this.$options.expandState
			});
		},

		/**
		 desc: Sets state of expand column (desktop hidden/hidden).
		 */
		checkExpandCol: function(condition) {
			if (!this.$options.cachedExpand && !this.$options.fetchUrl) {
				return;
			}

			this.$elements.rowExpander.toggleClass(CLASSES.tableVisible, condition);
			this._disableNestable = !condition;
			this.$elements.nestableChild.toggle(condition && this.$options.expandState);
		},

		_switcherChanged: function(event) {
			this.$events.trigger('switcherChanged', {event: event, row: this});
		},

		_onToggleChild: function(event) {
			this.toggle();

			event.stopPropagation();
		},

		_showNestable: function() {
			if (this._disableNestable) {
				return;
			}

			if (!this.$options.cachedExpand && !this.$options.fetchUrl) {
				return;
			}

			this.$elements.nestableChild.toggle(this.$options.expandState);

			if (this.$options.loaded || !this.$options.expandState) {
				return;
			}

			if (this.$options.cachedExpand) {
				this._loadNestable(this.$options.value[this.$options.cachedExpand]);
			} else {
				this._loadNestable();
			}

		},

		_loadNestable: function(html) {
			if (html) {
				this.html(html, this.$elements.fetchHolder)
					.then(function() {
						this.$options.loaded = true;
						this.$elements.fetchHolder.show();
					}.bind(this));

				return;
			}

			this._showLoader();

			this.$tools.data.get(this.$options.value[this.$options.fetchUrl])
				.then(function(responseData) {
					if (!responseData.data[0] && responseData.data[0].html) {
						return;
					}

					this.html(responseData.data[0].html, this.$elements.fetchHolder);
					this.$options.loaded = true;
					this.$elements.fetchHolder.show();
					this.$elements.nestingLoader.hide();
				}.bind(this))
				.catch(function() {
					this.$elements.nestingNoData.show();
					this.$elements.nestingLoader.hide();
				}.bind(this));
		},

		_onRowClick: function(event) {
			this.$events.trigger('selectRow', {
				rowValue: this.$options.value,
				event: event
			});
		},

		_showLoader: function() {
			this.$elements.nestingLoader.show();
			this.$elements.fetchHolder.hide();
			this.$elements.nestingNoData.hide();
		},

		/**
		desc: trigger deleteRow event with component which was clicked
		*/
		_onRemoveClick: function(event) {
			this.$events.trigger('deleteRow', event.component);
		}
	};


/***/ },

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	/**
	name: Tables checkbox filter
	type: ui
	desc: >
		Filters table based on checked value
	options:
		column: Name of the filter.
	events:
		filterChanged: fires when user changed filter state.
	*/
	module.exports = Object.assign({}, baseControl, {
		events: {
			'change $this': '_changed'
		},

		ready: function() {
			baseControl.init.call(this);
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			return [{
				type: 'equal',
				name: this.$options.column,
				value: this.$extensions.checkbox.isChecked()
			}];
		},

		_changed: function() {
			this.$events.trigger('filterChanged');
		}
	});


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

/***/ 533:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	/**
		name: Tables dataset filter
		type: ui
		desc: >
			Filters table based on set data
		options:
			column: Name of the filter.
			initialValue: Default value.
		events:
			filterChanged: fires when user set data.
	*/
	module.exports = Object.assign({}, baseControl, {
		/**
		 desc: Sets filters value.
		 */
		setData: function(data) {
			this._data = data;

			this.$events.trigger('filterChanged');
		},

		ready: function() {
			baseControl.init.call(this);
		},

		filters: function() {
			return [{
				name: this.$options.column,
				value: this._data || this.$options.initialValue
			}];
		}
	});


/***/ },

/***/ 534:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	var FORMAT_MAX_NUMBER = 9;

	/**
	name: Tables date range filter
	type: ui
	desc: >
		Filters table based on date range
	options:
		column: Name of the filter.
	events:
		filterChanged: fires when user changed filter state.
	*/
	module.exports = Object.assign({}, baseControl, {
		events: {
			'change $this': '_filter'
		},

		ready: function() {
			baseControl.init.call(this);

			this.dates = this.$extensions.datepicker.getDates();
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			if (!this.dates.startDate && !this.dates.endDate) {
				return [];
			}

			return [{
				type: 'date',
				name: this.$options.column,
				value: this._formatDate(new Date(this.dates.startDate)) + ' - ' + this._formatDate(new Date(this.dates.endDate))
			}];
		},

		reset: function() {
			this.$extensions.datepicker.reset();
		},

		_filter: function(event, dates) {
			this.dates = dates;

			this.$events.trigger('filterChanged');
		},

		_formatNum: function(num) {
			return num > FORMAT_MAX_NUMBER ? num : '0' + num;
		},

		_formatDate: function(date) {
			return String(date.getFullYear()) + this._formatNum(date.getMonth() + 1) + this._formatNum(date.getDate()) +
				this._formatNum(date.getHours()) + this._formatNum(date.getMinutes()) + this._formatNum(date.getSeconds());
		}
	});


/***/ },

/***/ 535:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables filters form
	type: ui
	desc: >
		Gathers filters value for our tables
	options:
		changeIgnore: boolean. If true, disables firing 'updateTable' for table reloading after filter controls changing.
	*/

	module.exports = {
		events: {
			'filterChanged $$filters': '_change',
			'click mobileFilterToggler': '_toggleFilters'
		},

		initialize: function() {
			this._lastFilter = null;
			this._blockingPromises = [];
		},

		ready: function() {
			this._blockingPromises = this._getBlockingPromises();
		},

		/**
		 desc: Returns name of last filter which was changed
		 */
		getLast: function() {
			return this._lastFilter;
		},

		/**
		 desc: Returns filter values
		 */
		values: function() {
			var result = [];

			this.$components.filters.forEach(function(filter) {
				var filterValue = filter.filters();

				if (!filterValue) {
					return;
				}

				result.push.apply(result, filterValue);
			});

			return result;
		},

		/**
		 desc: Returns if filter inputs is valid
		 */
		isValid: function() {
			return this.$extensions.form.valid();
		},

		/**
			desc: Returns promise that is resolved when all filters are ready
		*/
		blockFiltersAndWait: function() {
			var dfd = this.$tools.q.defer();

			if (!this._blockingPromises.length) {
				dfd.resolve();

				return dfd.promise();
			}

			this._disableAll();

			this.$tools.q.all(this._blockingPromises)
				.then(function() {
					this._enableAll();
					dfd.resolve();
				}.bind(this));

			return dfd.promise();
		},

		_change: function(event) {
			var filter;

			if (this.$options.changeIgnore) {
				return;
			}

			filter = event.component;
			this._lastFilter = filter.$options.column;
			this.$events.trigger('updateTable');
		},

		_toggleFilters: function() {
			this.$elements.mobileFiltersContainer.toggleClass(this.$options.mobileClass);
		},

		_getBlockingPromises: function() {
			return this.$components.filters.map(function(component) {
				return component.getBlockingPromise();
			});
		},

		_disableAll: function() {
			this.$components.filters.forEach(function(component) {
				component.disable();
			});
		},

		_enableAll: function() {
			this.$components.filters.forEach(function(component) {
				if (component.isReady()) {
					component.enable();
				}
			});
		}
	};


/***/ },

/***/ 536:
/***/ function(module, exports) {

	'use strict';

	var CLASSES = {
		expand: 'expanded'
	};

	/**
	name: Tables multi filter group
	type: ui
	desc: >
		Group of filters in multi selection
	*/
	module.exports = {
		events: {
			'change $groupCheckbox': '_groupChanged',
			'change $$subCheckboxes': '_subCheckboxesChanged',
			'click groupOpener': '_toggleGroup'
		},

		initialize: function() {
			this._state = false;
		},

		_toggleGroup: function() {
			this._state = !this._state;
			this.$el.toggleClass(CLASSES.expand, this._state);
			this.$elements.groupHolder.toggle(this._state);
		},

		_groupChanged: function(event) {
			var _groupCheckbox = event.component;
			var _isGroupChecked = _groupCheckbox.isChecked();

			if (!this.$components.subCheckboxes) {
				return;
			}

			this.$components.subCheckboxes.forEach(function(subCheckbox) {
				subCheckbox.$el.prop('checked', _isGroupChecked);
			});
		},

		_subCheckboxesChanged: function() {
			var _isChecked = this.$components.subCheckboxes.every(function(checkbox) {
				return checkbox.isChecked();
			});

			this.$components.groupCheckbox.$el.prop('checked', _isChecked);
		}
	};


/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	/**
	name: Tables multi filter
	type: ui
	desc: >
		Filters table based on multi selection
	options:
		column: Name of the filter.
	events:
		filterChanged: fires when user changed filter state.
	*/
	module.exports = Object.assign({}, baseControl, {
		events: {
			'click $apply': '_filterChanged'
		},

		ready: function() {
			baseControl.init.call(this);
			
			this._updateOpener();
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			return [{
				type: 'multi',
				name: this.$options.column,
				value: this._getCheckedInputs().map(function(checkbox) {
					return checkbox.value();
				})
			}];
		},

		disable: function() {
			this.$components.apply.disable();
		},

		enable: function() {
			this.$components.apply.enable();
		},

		_filterChanged: function() {
			this._updateOpener();
			this.$events.trigger('filterChanged');
			this.$extensions.dropdown.close();
		},

		_updateOpener: function() {
			var checkedCheckboxes = this._getCheckedInputs();
			var text;
			var allCheckboxes = this._getInputs();

			if (!checkedCheckboxes.length) {
				this.$elements.opener.text(this.$options.noItemsText);

				return;
			}

			if (checkedCheckboxes.length === allCheckboxes.length) {
				this.$elements.opener.text(this.$options.allText);

				return;
			}

			text = checkedCheckboxes.map(function(checkbox) {
				return checkbox.name();
			}).join(', ');

			this.$elements.opener.text(text);
		},

		_getCheckedInputs: function() {
			return this._getInputs().filter(function(checkbox) {
				return checkbox.isChecked();
			});
		},

		_getInputs: function() {
			var checkboxes = [];

			this.$components.groups.forEach(function(group) {
				checkboxes.push(group.$components.groupCheckbox);

				if (!group.$components.subCheckboxes) {
					return;
				}

				group.$components.subCheckboxes.forEach(function() {
					checkboxes.push.apply(checkboxes, group.$components.subCheckboxes);
				});
			});

			return checkboxes;
		}
	});


/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	/**
	name: Tables search filter
	type: ui
	desc: >
		Filters table based on input value
	options:
		column: Name of the filter.
	events:
		filterChanged: fires when user changed filter state.
	 */
	module.exports = Object.assign({}, baseControl, {
		events: {
			'search $this': '_search'
		},

		ready: function() {
			baseControl.init.call(this);
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			if (!this.term) {
				return false;
			}

			return [{
				type: 'contains',
				name: this.$options.column,
				value: this.term
			}];
		},

		/* calls form/search submitValue method because tables/filters/search directly depends on form/search and can't be use separately */
		reset: function() {
			this.$extensions['form/search'].submitValue('');
		},

		_search: function(event, term) {
			this.term = term;
			this.$events.trigger('filterChanged');
		}
	});


/***/ },

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseControl = __webpack_require__(532);

	/**
	name: Tables select filter
	type: ui
	desc: >
		Filters table based on select value
	options:
		column: Name of the filter.
		contentUrl: String. Is used for loading external content for the select control.
	events:
		filterChanged: fires when user changed filter state.
	*/
	module.exports = Object.assign({}, baseControl, {
		events: {
			'change $filterSelect': '_change'
		},

		ready: function() {
			baseControl.init.call(this);
		},

		disable: function() {
			this.$components.filterSelect.disable();
		},

		enable: function() {
			this.$components.filterSelect.enable();
		},

		getValue: function() {
			return this.$components.filterSelect.getValue();
		},

		setValue: function(period) {
			this.$components.filterSelect.setValue(period);
		},
		
		reset: function() {
			this.$components.filterSelect.selectFirst();
		},

		/**
		 desc: Standard method for getting filter value.
		 */
		filters: function() {
			return [{
				type: 'equal',
				name: this.$options.column,
				value: this.$components.filterSelect.getValue()
			}];
		},

		_change: function() {
			this.$events.trigger('filterChanged');
		},

		_postpone: function() {
			this.$components.filterSelect.activityIndicator();

			return this.load(this.$options.contentUrl);
		}
	});


/***/ },

/***/ 540:
/***/ function(module, exports) {

	'use strict';

	var RESPONSIVE_STATES = {
		'mobile-hidden': {
			expandClass: 'mobile-visible',
			priority: 1
		},
		'tablet-hidden': {
			expandClass: 'tablet-visible',
			priority: 2
		}
	};
	var CLASSES = {
		sorting: 'sorting',
		asc: 'sorting__asc',
		desc: 'sorting__desc'
	};
	var DIRECTIONS = {
		asc: 'asc',
		desc: 'desc'
	};

	/**
		name: Tables cell
		type: ui
		desc: >
			Handles current sorting functionality and collects data of each columns for table's body generating.
		events: >
			click: fires when user wants change sorting.
			updateTable: triggers to change sorting.
		options: >
			initialSort: boolean. set flag for use this column as initial sorted
			sortDirection: string. set sort direction for initial sorting
	*/
	module.exports = {
		initialize: function() {
			this._direction = null;
			
			if (this.$options.initialSort) {
				this.setSorting(this.$options.sortDirection);
			}
		},

		events: {
			click: '_onClick'
		},

		/**
		 desc: Gets sorting options.
		 */
		getSorting: function() {
			return [{
				name: this.$options.key,
				direction: this._direction
			}];
		},

		/**
		 desc: Gets options for table's body generating.
		 */
		getOptions: function() {
			return {
				key: this.$options.key,
				class: this.$options.class,
				isExpand: !!this.$options.isExpand,
				label: this.$options.label || this.$options.key,
				responsive: this.$options.responsive || '',
				responsiveExpand: RESPONSIVE_STATES[this.$options.responsive] ? RESPONSIVE_STATES[this.$options.responsive].expandClass : '',
				responsivePriority: RESPONSIVE_STATES[this.$options.responsive] ? RESPONSIVE_STATES[this.$options.responsive].priority : ''
			};
		},

		/**
		 desc: Gets current sorting active state.
		 */
		isSortingApplied: function() {
			if (!this.$options.sortable) {
				return false;
			}

			return this._direction !== null;
		},

		/**
		 desc: Sets sorting state.
		 */
		setSorting: function(direction) {
			this._direction = direction ||
				(!this._direction || this._direction === DIRECTIONS.desc ? DIRECTIONS.asc : DIRECTIONS.desc);

			this.$el.removeClass(this._getSortingClasses());
			this.$el.addClass(CLASSES[this._direction]);
		},

		/**
		 desc: Resets sorting in column.
		 */
		resetSorting: function() {
			if (!this.$options.sortable) {
				return;
			}

			this._direction = null;
			this.$el.removeClass(this._getSortingClasses());
		},

		/**
		 desc: Enable/disable sorting depending of amount of rows.
		 */
		toggleSorting: function(isEnabled) {
			if (!this.$options.sortable) {
				return;
			}

			this.$el.toggleClass(CLASSES.sorting, isEnabled);
			this._isDisabled = !isEnabled;

			if (!isEnabled) {
				this.$el.removeClass(this._getSortingClasses());

				return;
			}

			if (this._direction) {
				this.$el.addClass(CLASSES[this._direction]);
			}
		},

		_onClick: function(event) {
			if (!this.$options.sortable || this._isDisabled) {
				return;
			}

			this.setSorting();
			this.$events.trigger('sortingChanged');
			event.preventDefault();
		},

		_getSortingClasses: function() {
			return [CLASSES.asc, CLASSES.desc].join(' ');
		}
	};


/***/ },

/***/ 541:
/***/ function(module, exports) {

	'use strict';

	/**
		name: Tables header
		type: ui
		desc: >
			Handles sorting functionality and collects data for table's body generating.
		events:
			sortingChanged: fires when sorting was changed.
			updateTable: triggers when sorting was changed.
	*/
	module.exports = {
		events: {
			'sortingChanged $$headerCells': '_updateSorting'
		},

		/**
		 desc: Gets current sorting state.
		 */
		getSorting: function() {
			var activeSortItem = this.$components.headerCells.filter(function(cell) {
				return cell.isSortingApplied();
			});

			if (!activeSortItem.length) {
				return [];
			}

			return activeSortItem[0].getSorting();
		},

		/**
		 desc: Sets initial sorting state.
		 */
		setSorting: function(columnNumber, direction) {
			this.$components.headerCells[columnNumber].setSorting(direction);
		},

		/**
		 desc: Gets options for table's body generating.
		 */
		getOptions: function() {
			return this.$components.headerCells.map(function(headerCell) {
				return headerCell.getOptions();
			});
		},

		/**
		 desc: Gets options with responsive class for expand button.
		 */
		getExpandOptions: function(settings) {
			return settings.reduce(function(expandOptions, colSettings) {
				if (colSettings.responsivePriority && colSettings.responsivePriority > expandOptions.responsivePriority) {
					return {
						expandClass: colSettings.responsiveExpand,
						responsivePriority: colSettings.responsivePriority
					};
				}

				return expandOptions;
			}, {responsivePriority: -1});
		},

		/**
		 desc: Enable/disable sorting possibility.
		 */
		toggleSorting: function(isEnabled) {
			this.$components.headerCells.forEach(function(headerCell) {
				headerCell.toggleSorting(isEnabled);
			});
		},

		_updateSorting: function(event) {
			var component = event.component;
			var sortableColumns = this.$components.headerCells.filter(function(headerCell) {
				return headerCell.$options._ref !== component.$options._ref;
			});

			sortableColumns.forEach(function(sortableCell) {
				sortableCell.resetSorting();
			});

			this.$events.trigger('updateTable', {keepPage: true});
		}
	};


/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var rowTemplate = __webpack_require__(543);
	var DEFAULT_OPTIONS = {
		pageSize: 10,
		pageNumber: 1,
		sort: [],
		filters: []
	};

	var STATES = {
		startLoading: 'startLoading',
		loaded: 'loaded',
		drawed: 'drawed',
		failed: 'failed'
	};

	var CLASSES = {
		hidden: 'hidden'
	};

	/**
	name: Tables
	type: ui
	desc: >
		Advanced interaction controls to HTML tables.

		Request example:

			{
				"pageSize": 10,
				"pageNumber": 1, //starts from 1
				"sort": [ //optional parameters
					{
						"name": "column name",
						"direction": "ASC" //possible values are ASC or DESC
					}
				],
				"filters": [ //optional parameters
					{
						"type": "filter type", //possible values: containce, greater, lower
						"name": "column name",
						"value": "filter value" //could be {}, [] or ""
					}
				]
			}

		Response example:

			{
				"success": "true",
				"errorMessages": [], // could be null
				"data": {
					"rows": [
						{
							"customerId": "1",
							"customerName": "A",
							"customerStatus": "Active",
							"customerLegalAddress": "Mansfield Reformatory",
							"customerRegistered": "tomorrow"
						},
						{
							"customerId": "2",
							"customerName": "B",
							"customerStatus": "Suspended",
							"customerLegalAddress": "Mansfield Reformatory",
							"customerRegistered": "today"
						}
					],
					"totalCount": 2,
					"pageSize": 2,
					"pageNumber": 1,
				}
			}

		$$rows group triggers following events:
		'deleteRow' with component that triggered row delete as payload. To emit this event there must be
			component with alias 'removeTrigger'
		'selectRow' which is emitted on row click
		'switcherChanged' with object with event field that carries original event. To emit this event there must be
			component within group 'switchers' that emits change event

		For more details please check tables/body/index.js

	options:
		url: server endpoint address
		method: HTTP method
		noDataText: no data label
		cachedExpand: sets key for loading row's nesting content from html string
		rowExtensions: extensions for rows
		skipInitialLoad: skip table loading in ready state
		expandChild: expand row's content if table has only one row
	events:
		updateTable: Fires when filters were changed to reload table.
		toggleSelection: Triggers when table content was changed. Sends state of table's rows presence.
		startLoading: Fires when table starts loading
		loaded: fires when data has been loaded
		drawed: fires when table render completed
	 */
	module.exports = {
		events: {
			'updateTable $$filterList': 'loadTable'
		},

		ready: function() {
			if (this.$options.skipInitialLoad) {
				return;
			}

			this.toggleLoading(true);

			if (this.$components.filter) {
				this._filtersAreReady()
					.then(this.loadTable.bind(this, null, null));
			} else {
				this.loadTable();
			}

		},

		/**
		 desc: Sends data request and generate table.
		 */
		loadTable: function(event, appendData) {
			this._appendData = appendData || {};

			if (!this.$options.url) {
				return;
			}

			if (this._state === STATES.startLoading) {
				this._resetRequest();
			}

			if (this._state === STATES.loaded) {
				this._isWaiting = true;

				return;
			}

			this._sendRequest();
		},

		isLoaded: function() {
			return this._state === STATES.loaded;
		},

		_sendRequest: function() {
			var _queryMethod = this.$options.method || 'post';
			var _appendData = this._appendData;

			this._isWaiting = null;
			this.toggleLoading(true);
			this._request = this.$tools.data[_queryMethod](this.$options.url, this._getRequestData(_appendData));
			this._state = STATES.startLoading;
			this.$events.trigger(this._state);

			this._request
				.then(function(responseData) {
					this._state = STATES.loaded;
					this.$events.trigger(this._state, responseData);
					this._totalCount = responseData.data && responseData.data.totalCount;

					if (!(responseData.data && responseData.data.rows && responseData.data.rows.length)) {
						this._onFailedLoad();

						return;
					}

					this._createStructure(responseData.data.rows, _appendData);
					this._updatePager(responseData);
					this._updateMore(responseData);
				}.bind(this))

				.catch(function(errorData) {
					if (errorData.statusText === 'abort') {

						this._state = STATES.failed;
						this._checkRequest();

						return;
					}

					this._onFailedLoad();
				}.bind(this));
		},

		/**
		 desc: Returns data request promise.
		 */
		getRequest: function() {
			return this._request;
		},

		/**
		 desc: Remove row. Parameter `components` is a row component for removing.
		 */
		removeRow: function(component) {
			this.destroyChild(component);

			if (!this.$components.rows) {
				this._checkTableState();
			}
		},

		/**
		 desc: Removes all table's rows.
		 */
		clearTable: function() {
			if (!this.$components.rows) {
				return;
			}

			this.$components.rows.forEach(this.removeRow.bind(this));
		},

		/**
		 desc: Sets ability to load and display nesting content.
		 */
		toggleNesting: function(condition) {
			if (!this.$components.rows) {
				return;
			}

			this.$components.rows.forEach(function(row) {
				row.checkExpandCol(condition);
			});
		},

		/**
		 desc: Shows/hides loader.
		 */
		toggleLoading: function(condition) {
			if (condition === true) {
				this.$components.tableLoader.turnOn();
			} else {
				this.$components.tableLoader.turnOff();
			}
		},

		_onFailedLoad: function() {
			this.clearTable();
			this.toggleLoading(false);
			this._state = STATES.failed;
			this._checkRequest();
			this._checkTableState();
		},

		_checkRequest: function() {
			if (this._isWaiting) {
				this._sendRequest();
			}
		},

		_resetRequest: function() {
			if (this._request && this._request.abort) {
				this._request.abort();
			}
			this._state = null;
			this._request = null;
		},

		_updateMore: function(responseData) {
			if (!this.$components.insertMore) {
				return;
			}

			this.$components.insertMore
				.updateSettings(responseData.data.pageSize, responseData.data.totalCount, responseData.data.pageNumber);
		},

		_updatePager: function(responseData) {
			if (!this.$components.pager) {
				return;
			}

			this.$components.pager
				.updateSettings(responseData.data.pageSize, responseData.data.totalCount, responseData.data.pageNumber);
		},

		_getRequestData: function(appendData) {
			var filters = this.$components.filter ? this.$components.filter.values() : [];
			var sort = this.$components.header.getSorting();
			var method = (this.$options.method || 'post').toLowerCase();
			var lastFilter = this.$components.filter && this.$components.filter.getLast();
			var pageSize = this.$components.lengthMenu && this.$components.lengthMenu.getSize();
			var pageNumber = appendData.keepPage ? this._getPageNumber() : DEFAULT_OPTIONS.pageNumber;
			var ajaxOptions = this.$tools.util.extend({}, DEFAULT_OPTIONS, {
				sort: sort,
				filters: filters,
				pageNumber: pageNumber,
				pageSize: pageSize,
				lastFilter: lastFilter
			});

			return method === 'post' ? JSON.stringify(ajaxOptions) : ajaxOptions;
		},

		_getPageNumber: function() {
			if (this.$components.pager) {
				return this.$components.pager.getPage();
			}

			if (this.$components.insertMore) {
				return this.$components.insertMore.getPage();
			}

			return DEFAULT_OPTIONS.pageNumber;
		},

		_createStructure: function(responseData, appendData) {
			var _expandOptions;

			this.headerSettings = this.$components.header.getOptions();
			this.tableData = responseData || [];

			_expandOptions = this.$components.header.getExpandOptions(this.headerSettings);

			this.renderOptions = {
				colSpanLength: this.headerSettings.length,
				noDataText: this.$options.noDataText || '',
				expandClass: _expandOptions.expandClass || CLASSES.hidden,
				extensions: this.$options.rowExtensions || ''
			};

			if (!appendData.append) {
				this.clearTable();
			}

			this._renderBody();
		},

		_renderBody: function() {
			return this.html(this._createTemplate(), this.$elements.table, 'beforeend')
				.then(function() {
					this._checkTableState();
					this.toggleLoading(false);
					this._checkData();
					this._expandChild();
					this._state = STATES.drawed;
					this.$events.trigger(this._state);
					this._checkRequest();
				}.bind(this));
		},

		_createTemplate: function() {
			var expanderOptions = this.$components.header.$components.expander.$options;
			var template = this.$tools.template.parse(rowTemplate);
			var headerSettings = this.headerSettings;
			var renderOptions = this.renderOptions;
			var cachedExpand = this.$options.cachedExpand;

			return this.tableData.reduce(function(tmp, row) {
				return tmp + template({
					row: row,
					headerSettings: headerSettings,
					options: renderOptions,
					rowOptions: {
						fetchUrl: (expanderOptions.key && row[expanderOptions.key]) ? expanderOptions.key : '',
						cachedExpand: (cachedExpand && row[cachedExpand]) ? cachedExpand : ''
					}
				});
			}, '');
		},

		_checkTableState: function() {
			var hasRows = Boolean(this.$components.rows);
			var hasBottomFilters = this.$components.lengthMenu ||
				(this.$components.insertMore && this.$components.insertMore.isEnabled) ||
				(this.$components.pager && !this.$components.pager.isSinglePage());

			this.$elements.emptyRow.toggle(!hasRows);
			this.$events.trigger('toggleSelection', {toggle: hasRows});
			this.$components.header.toggleSorting(hasRows);
			if (!this.$options.visible || !this._totalCount) {
				this.$elements.bottomFilters.toggle(hasRows && hasBottomFilters);
			}
		},

		_checkData: function() {
			this.headerSettings.forEach(function(colSettings) {
				this.tableData.forEach(function(rowData) {
					if (colSettings.key && rowData[colSettings.key] === undefined) {
						this.$tools.logger.error('Missed data for key: ' + colSettings.key);
					}
				}.bind(this));
			}.bind(this));
		},

		_filtersAreReady: function() {
			if (!this.$components.filter) {
				return this.$tools.q.resolve();
			}

			return this.$components.filter.blockFiltersAndWait();
		},

		_expandChild: function() {
			if (!this.$options.expandChild || this.$components.rows.length > 1) {
				return;
			}

			this.$components.rows[0].toggle(true);
		}
	};


/***/ },

/***/ 543:
/***/ function(module, exports) {

	module.exports = "<tbody\r\n\tclass=\"<%- row.RowOptions && row.RowOptions.RowClass ? row.RowOptions.RowClass : '' %>\"\r\n\tdata-component=\"tables/body\"\r\n\tdata-group=\"rows\"\r\n\tdata-extensions=\"<%- options.extensions %>\"\r\n\tdata-expand-state=\"false\"\r\n\tdata-value=\"<%- JSON.stringify(row) %>\"\r\n\tdata-cached-expand=\"<%- rowOptions.cachedExpand %>\"\r\n\tdata-fetch-url=\"<%- rowOptions.fetchUrl %>\">\r\n\r\n\t<tr class=\"datatable__row\" data-element=\"row\">\r\n\t\t<%\r\n\t\t\tvar expandableClass = options.expandClass ? ' datatable__' + options.expandClass : '';\r\n\t\t\tvar expandableBorderClass = options.expandClass ? ' datatable__border-' + options.expandClass : '';\r\n\t\t\tvar hiddenBorderClass = rowOptions.cachedExpand || rowOptions.fetchUrl ? ' datatable__border-hidden' : '';\r\n\t\t\tvar hasNestableClass = rowOptions.cachedExpand || rowOptions.fetchUrl ? ' datatable__visible' : '';\r\n\t\t\tvar nestableBorderClass = rowOptions.cachedExpand || rowOptions.fetchUrl ? '' : ' datatable__border-nestable';\r\n\t\t%>\r\n\r\n\t\t<% headerSettings.forEach(function(colSettings, ind) { %>\r\n\t\t\t<%\r\n\t\t\t\tvar responsiveClass = colSettings.responsive ? ' datatable__' + colSettings.responsive : '';\r\n\t\t\t\tvar checkboxClass = colSettings.key === 'Checkbox' ? ' form-checkbox form-checkbox--single' : '';\r\n\t\t\t%>\r\n\r\n\t\t\t<% if(colSettings.isExpand) { %>\r\n\t\t\t\t<td class=\"datatable__expand <%- expandableBorderClass %><%- hiddenBorderClass %>\">\r\n\t\t\t\t\t<button type=\"button\" class=\"filter-toggle filter-toggle--large toleft toright--small <%- expandableClass %><%- hasNestableClass %>\" data-element=\"rowExpander\">\r\n\t\t\t\t\t\t<span class=\"filter-toggle__label icon-left\"></span>\r\n\t\t\t\t\t</button>\r\n\t\t\t\t</td>\r\n\t\t\t<% } else { %>\r\n\t\t\t\t<td class=\"<%- colSettings.class %><%- expandableBorderClass %><%- responsiveClass %><%- hiddenBorderClass %><%- checkboxClass %>\"\r\n\t\t\t\t\tdata-value=\"<%- row[colSettings.key] %>\"><%= row[colSettings.key] %>\r\n\t\t\t\t</td>\r\n\t\t\t<% } %>\r\n\t\t<% }) %>\r\n\t</tr>\r\n\t<tr class=\"datatable__responsive-row js-hidden\"\r\n\t\tdata-element=\"rowChild\">\r\n\r\n\t\t<td class=\"padding-whole--none <%- nestableBorderClass %>\"></td>\r\n\t\t<td class=\"padding-whole--none <%- nestableBorderClass %>\" colspan=\"<%- options.colSpanLength-1 %>\">\r\n\t\t\t<ul class=\"border--top padding-toleft--small padding-toright padding-leader--small padding-trailer--small <%- expandableClass %>\">\r\n\t\t\t\t<% headerSettings.forEach(function(colSettings) { %>\r\n\t\t\t\t\t<% var responsiveExpandClass = colSettings.responsiveExpand ? ' datatable__'+colSettings.responsiveExpand : ''; %>\r\n\r\n\t\t\t\t\t<% if(colSettings.responsive) { %>\r\n\t\t\t\t\t\t<li class=\"grid-row <%- responsiveExpandClass %>\" data-value=\"<%- row[colSettings.key] %>\">\r\n\t\t\t\t\t\t\t<div class=\"col-xs text--left\"><%= colSettings.label %>:</div>\r\n\t\t\t\t\t\t\t<div class=\"col-xs-auto\"><%= row[colSettings.key] %></div>\r\n\t\t\t\t\t\t</li>\r\n\t\t\t\t\t<% } %>\r\n\t\t\t\t<% }) %>\r\n\t\t\t</ul>\r\n\t\t</td>\r\n\t</tr>\r\n\t<tr class=\"datatable__nestable-row js-hidden\" data-element=\"nestableChild\">\r\n\t\t<td colspan=\"<%- options.colSpanLength %>\">\r\n\t\t\t<div class=\"datatable__nestable-holder js-hidden\" data-element=\"fetchHolder\" data-element-firewall></div>\r\n\t\t\t<div class=\"text-size--13 text-italic text--center padding-leader--xxlarge padding-trailer--xxlarge js-hidden\" data-element=\"nestingNoData\"><%- options.noDataText %></div>\r\n\t\t\t<div class=\"leader trailer text--center js-hidden\" data-element=\"nestingLoader\">\r\n\t\t\t\t<span class=\"spinner--large\"></span>\r\n\t\t\t</div>\r\n\t\t</td>\r\n\t</tr>\r\n</tbody>\r\n"

/***/ },

/***/ 544:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables insertable
	type: ui
	desc: >
		Allows loading and append rows in current page. Increases page number by 1 each click.
	events:
		click: fires when user wants to add some rows.
		updateTable: triggers to load more rows.
	*/
	module.exports = {
		initialize: function() {
			this._pageNumber = 1;
			this._totalCount = 1;
			this.isEnabled = true;
		},

		events: {
			'click': '_change'
		},

		/**
		 desc: Sets updated values to the component.
		 */
		updateSettings: function(pageSize, totalCount, pageNumber) {
			this._totalCount = totalCount || 1;
			this._pageSize = pageSize || this._totalCount;
			this._pageNumber = pageNumber || 1;
			this._checkCount();
		},

		/**
		 desc: Gets current page number.
		 */
		getPage: function() {
			return this._pageNumber;
		},

		_change: function() {
			this._pageNumber++;
			this.$events.trigger('updateTable', {append: true, keepPage: true});
		},

		_checkCount: function() {
			var _totalPagesCount = this._totalCount / this._pageSize;
			
			if (this._pageNumber >= _totalPagesCount) {
				this._disable();
			} else {
				this._enable();
			}
		},

		_enable: function() {
			this.isEnabled = true;
			this.$extensions.button.enable();
		},

		_disable: function() {
			this.isEnabled = false;
			this.$extensions.button.disable();
		}
	};


/***/ },

/***/ 545:
/***/ function(module, exports) {

	'use strict';

	/**
		name: Tables lengthable
		type: ui
		desc: >
			Allows changing amount of viewable rows per page.
		events:
			change: fires when select extension was changed.
			updateTable: triggers when amount of viewable rows per page was changed.
	*/
	module.exports = {
		events: {
			'change': '_change'
		},

		/**
		 desc: Gets current page size.
		 */
		getSize: function() {
			return this.$components.lengthSelect.getValue();
		},

		_change: function() {
			this.$events.trigger('updateTable');
		}
	};


/***/ },

/***/ 546:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables linkable
	type: ui
	desc: >
		Table extension. Translate row selection to parent component. Can redirect page to action url.
	options:
		rowSelectionAction: key to define action data in every row.
		preventLinkable: boolean flag to prevent redirecting.
	events:
		rowSelected: triggers to translate row selection.
	 */
	module.exports = {
		events: {
			'selectRow $$rows': '_onRowClick'
		},

		_onRowClick: function(event, rowData) {
			var action = rowData.rowValue[this.$options.rowSelectionAction];

			if (!action) {
				return;
			}

			this.$events.trigger('rowSelected', {
				action: action,
				rowValue: rowData.rowValue
			});
		}
	};


/***/ },

/***/ 547:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables linkable redirect
	type: ui
	desc: >
		Extension for tables that aims to redirect to url on tables/linkable item click. Example usage:
		<div data-component="tables" data-extensions="tables/linkable, tables/linkable/redirect">
	*/
	module.exports = {
		events: {
			'rowSelected $this': '_onRowSelect'
		},

		_onRowSelect: function(undefined, data) {
			this.$tools.util.redirect(data.action);
		}
	};


/***/ },

/***/ 548:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables pagable
	type: ui
	desc: >
		This is a wrapper for component pager
	events:
		pageChanged: fires when component pager changed page number.
		updateTable: triggers when current page was changed.
	 */
	module.exports = {
		events: {
			'pageChanged $pagination': '_change'
		},

		/**
		 desc: Gets current page number from pager component.
		 */
		getPage: function() {
			return this.$components.pagination.getCurrentPageNumber();
		},

		/**
			desc: Returns true if pager has only one page.
		 */
		isSinglePage: function() {
			return this.$components.pagination.isSinglePage();
		},

		/**
		 desc: Sets updated values to pager component (page size, total count, page number).
		 */
		updateSettings: function() {
			this.$components.pagination.updateSettings.apply(this.$components.pagination, arguments);
		},

		_change: function() {
			this.$events.trigger('updateTable', {keepPage: true});
		}
	};


/***/ },

/***/ 549:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tables selectable
	type: ui
	desc: >
		Table extension. Allows use checkboxes in every row to make some selections.

	examples:
	 - name: Table with ability to select row(s)
	   tmpl:
	    include: ../[docs]/table-selectable.html
	events:
		toggleSelection: fires from tables controller to disable/enable ability to check/uncheck selectAll checkbox.
		checked: fires when any selectable checkbox was checked.
		unchecked: fires when any selectable checkbox was unchecked.
		selectionChanged: triggers when selection was changed. Send array of checked checkboxes' values.
	*/
	module.exports = {
		events: {
			'change $header $$headerCells $selectAll': '_toggleRows',
			'change $$rows $$selectRows': '_onSelectRow',
			'toggleSelection $this': 'toggleSelection',
			'startLoading $this': '_toggleSelectAll'
		},

		/**
		 desc: Disable/enable ability to check/uncheck selectAll checkbox.
		 */
		toggleSelection: function(event, data) {
			var selectAllComponent = this._getSelectAllComponent();

			if (!selectAllComponent) {
				return;
			}

			if (data.toggle) {
				selectAllComponent.enable();
			} else {
				selectAllComponent.$el[0].checked = false;
				selectAllComponent.disable();
			}
		},

		_toggleRows: function(event) {
			var isChecked = event.component.isChecked();
			var selectableRows = this.$components.rows.map(function(row) {
				return row.$components.selectRow;
			});
			var length = selectableRows.length;

			this.$el.addClass('js-hidden');
			while (length--) {
				selectableRows[length].$el[0].checked = isChecked;
			}
			this.$el.removeClass('js-hidden');

			this._triggerChange();
		},

		_getSelectedRows: function() {
			var selectableRows = this._getSelectableRows();

			return selectableRows.filter(function(row) {
				return row.$components.selectRow.isChecked();
			});
		},

		_getSelectableRows: function() {
			return this.$components.rows.filter(function(row) {
				return row.$components.selectRow;
			});
		},

		_triggerChange: function() {
			this.$events.trigger('selectionChanged', this._getSelectedRows());
		},

		_onSelectRow: function() {
			var selectableRows = this._getSelectableRows();
			var selectedRows = this._getSelectedRows();

			this._toggleSelectAll(null, selectableRows.length === selectedRows.length);
			this._triggerChange();
		},

		_getSelectAllComponent: function() {
			var selectCells = this.$components.header.$components.headerCells.filter(function(headerCell) {
				return !!headerCell.$components.selectAll;
			});

			if (!selectCells.length) {
				return null;
			}

			return selectCells[0].$components.selectAll;
		},

		_toggleSelectAll: function(event, condition) {
			var _selectAllComponent = this._getSelectAllComponent();
			var _selectAllCondition = condition !== undefined ? condition : false;

			if (!_selectAllComponent) {
				return;
			}

			_selectAllComponent.$el[0].checked = _selectAllCondition;
		}
	};


/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validationMessage = __webpack_require__(502);
	var positionService = __webpack_require__(551);

	/**
	name: Tooltip
	type: ui
	desc: >
		Shows information in a tooltip.
		Uses Framework::loader to show spinner
	 */
	module.exports = Object.assign({}, validationMessage, {
		events: {
			'mouseover': '_show',
			'mouseout': '_hide',
			'touchstart': '_toggle'
		},

		initialize: function() {
			this.show = this.hide = function() {
				this.$tools.logger.error('Methods "show/hide" are removed.');
			}.bind(this);

			this._isActive = false;
		},

		/**
		 desc: Public method for showing validation message
		 args:
		 	message. String. text for tooltip
		*/
		showValidationMessage: function(message) {
			this.text(message);
		},

		/**
		 desc: Public method for hiding validation message
		 */
		hideValidationMessage: function() {
			this.text('');
		},

		/**
		 desc: Sets text value for tooltip content.
		 args:
		 	text. String. text for tooltip
		 */
		text: function(text) {
			this.$elements.tooltipText.text(text);
			this._rearrange();
		},

		/**
		 desc: Show loading spinner
		 */
		setLoading: function() {
			this.$components.loader.turnOn();
			this._rearrange();
		},

		/**
		 desc: Hide loading spinner
		 */
		resetLoading: function() {
			this.$components.loader.turnOff();
			this._rearrange();
		},

		_show: function() {
			document.body.appendChild(this.$elements.tooltip.get(0));
			this._isActive = true;
			this.$events.trigger('tooltipShow');
			this._rearrange();
		},

		_hide: function() {
			this._isActive = false;
			this.$el.append(this.$elements.tooltip);
			this.$events.trigger('tooltipHide');
		},

		_toggle: function() {
			if (this._isActive) {
				this._hide();
			} else {
				this._show();
			}
		},

		_rearrange: function() {
			var position;

			if (!this._isActive) {
				return;
			}

			position = positionService.getElementPosition(this.$el.get(0), this.$elements.tooltip.get(0));

			this.$elements.tooltip.css(position);
		}
	});


/***/ },

/***/ 551:
/***/ function(module, exports) {

	'use strict';

	/**
	name: Tooltip
	type: ui
	desc: >
		Shows information in a tooltip.
		Can contains blocks with classes '.tooltip\_\_content' and '.tooltip\_\_spinner' for showing loading. Attribute 'data-loading="true"' shows '.tooltip\_\_spinner' and hides '.tooltip\_\_content' block.
		Methods 'setLoading' and 'resetLoading' add/remove attribute 'data-loading="true"' in component to show loading process.
	 */
	module.exports = {
		/**
		 desc: Calculate element offset.
		 args:
		    el: HTML DOM Element Object.
		 */
		getElementPosition: function(hostElem, targetElem) {
			var viewportOffset = this._getViewportOffset(hostElem);
			var adjustedSize = { width: targetElem.offsetWidth, height: targetElem.offsetHeight };
			var placement = ['top', 'justify'];
			var targetElemPos = { left: 0, top: 0 };
			var hostElemPos = this._offset(hostElem);
			var extraOffset = { left: 10, top: 3 };

			if (adjustedSize.height + extraOffset.top > viewportOffset.top) {
				placement[0] = 'bottom';
			}

			if ((adjustedSize.width / 2 <= viewportOffset.left + (hostElemPos.width / 2))
				&& (adjustedSize.width / 2 <= viewportOffset.right + (hostElemPos.width / 2))) {
				placement[1] = 'center';
			} else if (adjustedSize.width <= viewportOffset.left - extraOffset.left) {
				placement[1] = 'right';
			} else if (adjustedSize.width <= viewportOffset.right - extraOffset.left) {
				placement[1] = 'left';
			}

			switch (placement[0]) {
				case 'top':
					targetElemPos.top = hostElemPos.top - adjustedSize.height - extraOffset.top;
					break;
				case 'bottom':
					targetElemPos.top = hostElemPos.top + hostElemPos.height + extraOffset.top;
					break;
				// no default
			}

			switch (placement[1]) {
				case 'left':
					targetElemPos.left = hostElemPos.left - extraOffset.left;
					break;
				case 'right':
					targetElemPos.left = hostElemPos.left - adjustedSize.width + hostElemPos.width + extraOffset.left;
					break;
				case 'center':
					targetElemPos.left = hostElemPos.left - (adjustedSize.width / 2) + (hostElemPos.width / 2);
					break;
				case 'justify':
					targetElemPos.left = (window.innerWidth / 2) - (adjustedSize.width / 2);
					break;
				// no default
			}

			return targetElemPos;
		},
		_offset: function(el) {
			var elBCR = el.getBoundingClientRect();

			return {
				width: Math.round(elBCR.width),
				height: Math.round(elBCR.height),
				top: Math.round(elBCR.top + (window.pageYOffset || document.documentElement.scrollTop)),
				left: Math.round(elBCR.left + (window.pageXOffset || document.documentElement.scrollLeft))
			};
		},
		_getViewportOffset: function(el) {
			var elBCR = el.getBoundingClientRect();
			var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};
			var offsetParent = document.documentElement;
			var offsetParentBCR = offsetParent.getBoundingClientRect();

			offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop + window.pageYOffset;
			offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft + window.pageXOffset;

			offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
			offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

			return {
				top: Math.round(elBCR.top - offsetBCR.top),
				bottom: Math.round(offsetBCR.bottom - elBCR.bottom),
				left: Math.round(elBCR.left - offsetBCR.left),
				right: Math.round(offsetBCR.right - elBCR.right)
			};
		}
	};


/***/ },

/***/ 552:
/***/ function(module, exports) {

	'use strict';

	var defaults = {
		captureLength: 1,
		delay: 500
	};

	/**
	name: Typewatch
	type: ui
	desc: Watch the user input and emit typeWatch event on type
	events:
		typeWatch: fires when user type
	*/
	module.exports = {
		events: {
			'input': '_onInput'
		},

		initialize: function() {
			this.$options = this.$tools.helper.extend({}, defaults, this.$options);
			this.debouncedInputHandler = this.$tools.helper.debounce(function(value) {
				this.$events.trigger('typeWatch', value);
			}.bind(this), this.$options.delay);
		},

		_onInput: function() {
			var value = this._getValue();

			if (value.length >= this.$options.captureLength) {
				this.debouncedInputHandler(value);
			}
		},

		_getValue: function() {
			return this.$el.val() || '';
		}
	};


/***/ },

/***/ 553:
/***/ function(module, exports) {

	'use strict';

	var _apiReadyDfd = null;
	var _apiReady = false;

	var SELECTORS = {
		playerHolder: '[data-selector="playerHolder"]'
	};

	var CLASSES = {
		active: 'ytplayer-active',
		flex: 'ytplayer-video--flex'
	};

	window.onYouTubeIframeAPIReady = function() {
		_apiReadyDfd.resolve();
		_apiReady = true;
	};

	/**
	name: video
	type: ui
	desc: |
	 Component for video (Youtube player) control with/without clickable cover image.

	 If cover image is populated player will be initialized on first click on the cover
	    otherwise player will be initialized on API loading.
	    Player hase the same size as the cover image.
	    USE width and height option to override size.

	options:
	    youtubeId: String. Identifier of the youtube video
	    width: player width
	    height: player height

	*/
	module.exports = {
		events: {
			'click $cover': 'onCoverClick',
			'click $closeBtn': 'onClose'
		},

		initialize: function() {
			this.player = null;
			this.$playerHolder = this.$el.find(SELECTORS.playerHolder);

			if (!this.$options.hasCover && !Number(this.$options.width) && !Number(this.$options.height)) {
				this.$playerHolder.addClass(CLASSES.flex);
			}

			if (!_apiReadyDfd) {
				_apiReadyDfd = this.$tools.q.defer();
			}
		},

		ready: function() {
			_apiReadyDfd.then(this.onApiReady.bind(this));
		},

		_initPlayer: function() {
			var _width = this.$options.width || this.$el.width();
			var _height = this.$options.height || this.$el.height();

			this.player = new YT.Player(this.$options.youtubeId, {
				width: _width,
				height: _height,
				videoId: this.$options.youtubeId,
				playerVars: {
					modestbranding: 1,
					showinfo: 0,
					controls: 1
				},
				events: {
					onReady: this.onPlayerReady.bind(this)
				}
			});
		},

		_play: function() {

			if (!_apiReady) {
				return;
			}

			if (this.player) {
				this.$el.addClass(CLASSES.active);
				this.player.playVideo();
			} else {
				this._initPlayer();
			}
		},

		onPlayerReady: function() {
			if (this.$options.hasCover) {
				this._play();
			}

			this.$events.trigger('playerReady', this.player);
		},

		onApiReady: function() {
			if (!this.$options.hasCover) {
				this._initPlayer();
			}
		},

		onCoverClick: function() {
			this._play();
		},

		onClose: function(event) {
			event.preventDefault();

			this.$el.removeClass(CLASSES.active);
			this.player.pauseVideo();
		}
	};


/***/ }

});