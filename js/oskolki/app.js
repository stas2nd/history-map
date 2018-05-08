'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

webpackJsonp([0], [
/* 0 */
/***/function (module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var styles = __webpack_require__(4);

	var Router = __webpack_require__(5);

	var $ = __webpack_require__(3);

	$.fn.setAttrIf = function (cond, attr, val) {
		if (cond) return this.attr(attr, val);else return this.removeAttr(attr);
	};

	window.app = {
		settings: {}
	};

	var mobileDetect = new MobileDetect(window.navigator.userAgent);
	var phone = mobileDetect.phone();
	var tablet = mobileDetect.tablet();

	SVGElement.prototype.hasClass = function (className) {
		return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
	};

	SVGElement.prototype.addClass = function (className) {
		if (!this.hasClass(className)) {
			this.setAttribute('class', this.getAttribute('class') + ' ' + className);
		}
	};

	SVGElement.prototype.removeClass = function (className) {
		var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
		if (this.hasClass(className)) {
			this.setAttribute('class', removedClass);
		}
	};

	SVGElement.prototype.toggleClass = function (className) {
		if (this.hasClass(className)) {
			this.removeClass(className);
		} else {
			this.addClass(className);
		}
	};

	window.app.isPhoneLayout = function () {
		return window.innerWidth < 768;
	};

	window.app.queryUrlGetParam = function (variable, url) {
		if (!url) {
			return '';
		}

		try {
			var queryParts = url.split('?');
			var query = queryParts[queryParts.length - 1];

			if (!query) {
				return '';
			}
			var v = query.split('&');
			for (var i = 0; i < v.length; i++) {
				var p = v[i].split('=');
				if (p[0] == variable) {
					if (p.length > 1) {
						return decodeURIComponent(p[1]);
					} else {
						return ''; //if variable for empty param, without value
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	window.app.waitForTransitionEnd = function ($obj, property, cb, safeTimeout) {

		var transEndEventNames = {
			'transition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd'
		};

		var getTransitionEndName = function getTransitionEndName() {
			if (!window.getComputedStyle || !document.documentElement) {
				return 'transitionend';
			}

			var styles = window.getComputedStyle(document.documentElement, '');

			for (var i in transEndEventNames) {
				if (styles[i] != undefined) {
					return transEndEventNames[i];
				}
			}

			return 'transitionend';
		};

		var transEndEventName = getTransitionEndName();

		var transitionEndCallback = function transitionEndCallback(e) {

			if (e) {
				var prop = e.originalEvent.propertyName.toLowerCase();
				if (!$(e.target).is($obj)) return;
				if (prop.indexOf(property) == -1) return;
			}

			$obj.off(transEndEventName, transitionEndCallback);

			clearTimeout(transitionSafeTimeout);

			cb();
		};

		var resetAllHandlers = function resetAllHandlers() {
			$obj.off(transEndEventName, transitionEndCallback);

			clearTimeout(transitionSafeTimeout);
		};

		$obj.on(transEndEventName, transitionEndCallback);

		var transitionSafeTimeout = setTimeout(transitionEndCallback, safeTimeout == undefined ? this.getTransitionDuration($obj[0], property) + 100 : safeTimeout);

		return resetAllHandlers;
	};

	// Присваивает элементу класс на заданное время,
	// затем убирает
	$.fn.flashClass = function (className, delay) {
		var self = this,
		    timeout;
		this.addClass(className);
		clearTimeout(this.data('timeout'));
		timeout = setTimeout(function () {
			if ((typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self.length) {
				self.removeClass(className);
				self.data('timeout', null);
			}
		}, delay);
		this.data('timeout', timeout);
		return this;
	};

	window.app.easingFunctions = function (st, ed, per, easing) {
		var functions = {
			//simple linear tweening - no easing, no acceleration
			linearTween: function linearTween(t, b, c, d) {
				return c * t / d + b;
			},

			// quadratic easing in - accelerating from zero velocity
			easeInQuad: function easeInQuad(t, b, c, d) {
				t /= d;
				return c * t * t + b;
			},

			// quadratic easing out - decelerating to zero velocity
			easeOutQuad: function easeOutQuad(t, b, c, d) {
				t /= d;
				return -c * t * (t - 2) + b;
			},

			// quadratic easing in/out - acceleration until halfway, then deceleration
			easeInOutQuad: function easeInOutQuad(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t + b;
				t--;
				return -c / 2 * (t * (t - 2) - 1) + b;
			},

			// cubic easing in - accelerating from zero velocity
			easeInCubic: function easeInCubic(t, b, c, d) {
				t /= d;
				return c * t * t * t + b;
			},

			// cubic easing out - decelerating to zero velocity
			easeOutCubic: function easeOutCubic(t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t + 1) + b;
			},

			// cubic easing in/out - acceleration until halfway, then deceleration
			easeInOutCubic: function easeInOutCubic(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t + 2) + b;
			},

			// quartic easing in - accelerating from zero velocity
			easeInQuart: function easeInQuart(t, b, c, d) {
				t /= d;
				return c * t * t * t * t + b;
			},

			// quartic easing out - decelerating to zero velocity
			easeOutQuart: function easeOutQuart(t, b, c, d) {
				t /= d;
				t--;
				return -c * (t * t * t * t - 1) + b;
			},

			// quartic easing in/out - acceleration until halfway, then deceleration
			easeInOutQuart: function easeInOutQuart(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t + b;
				t -= 2;
				return -c / 2 * (t * t * t * t - 2) + b;
			},

			// quintic easing in - accelerating from zero velocity
			easeInQuint: function easeInQuint(t, b, c, d) {
				t /= d;
				return c * t * t * t * t * t + b;
			},

			// quintic easing out - decelerating to zero velocity
			easeOutQuint: function easeOutQuint(t, b, c, d) {
				t /= d;
				t--;
				return c * (t * t * t * t * t + 1) + b;
			},

			// quintic easing in/out - acceleration until halfway, then deceleration
			easeInOutQuint: function easeInOutQuint(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * t * t * t * t * t + b;
				t -= 2;
				return c / 2 * (t * t * t * t * t + 2) + b;
			},

			// sinusoidal easing in - accelerating from zero velocity
			easeInSine: function easeInSine(t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},

			// sinusoidal easing out - decelerating to zero velocity
			easeOutSine: function easeOutSine(t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},

			// sinusoidal easing in/out - accelerating until halfway, then decelerating
			easeInOutSine: function easeInOutSine(t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			},

			// exponential easing in - accelerating from zero velocity
			easeInExpo: function easeInExpo(t, b, c, d) {
				return c * Math.pow(2, 10 * (t / d - 1)) + b;
			},

			// exponential easing out - decelerating to zero velocity
			easeOutExpo: function easeOutExpo(t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},

			// exponential easing in/out - accelerating until halfway, then decelerating
			easeInOutExpo: function easeInOutExpo(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				t--;
				return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
			},

			// circular easing in - accelerating from zero velocity
			easeInCirc: function easeInCirc(t, b, c, d) {
				t /= d;
				return -c * (Math.sqrt(1 - t * t) - 1) + b;
			},

			// circular easing out - decelerating to zero velocity
			easeOutCirc: function easeOutCirc(t, b, c, d) {
				t /= d;
				t--;
				return c * Math.sqrt(1 - t * t) + b;
			},

			// circular easing in/out - acceleration until halfway, then deceleration
			easeInOutCirc: function easeInOutCirc(t, b, c, d) {
				t /= d / 2;
				if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				t -= 2;
				return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
			}
		};

		return functions[easing](per, st, ed - st, 1);
	};

	Modernizr.addTest('safari', function () {
		return navigator.userAgent.indexOf('Safari') != -1 && (navigator.userAgent.indexOf('Mac') != -1 || navigator.userAgent.indexOf('Windows')) && navigator.userAgent.indexOf('Chrome') == -1;
	});

	Modernizr.addTest('firefox', function () {
		return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	});

	Modernizr.addTest('ieAny', function () {
		var ieLTE10 = !!window.ActiveXObject && +/msie\s(\d+)/i.exec(navigator.userAgent)[1] || NaN;
		var ie11 = navigator.userAgent.indexOf('Trident/') != -1 && (navigator.userAgent.indexOf('rv:') != -1 || navigator.appName.indexOf('Netscape') != -1);

		return ieLTE10 || ie11;
	});

	Modernizr.addTest('ieOld', function () {
		var ieVersion = !!window.ActiveXObject && +/msie\s(\d+)/i.exec(navigator.userAgent)[1] || NaN;

		return ieVersion - 0 <= 8;
	});

	Modernizr.addTest('ie9', function () {
		var ieVersion = !!window.ActiveXObject && +/msie\s(\d+)/i.exec(navigator.userAgent)[1] || NaN;

		return ieVersion - 0 == 9;
	});

	Modernizr.addTest('ie10', function () {
		var ieVersion = !!window.ActiveXObject && +/msie\s(\d+)/i.exec(navigator.userAgent)[1] || NaN;

		return ieVersion - 0 == 10;
	});

	Modernizr.addTest('ie11', function () {
		return navigator.userAgent.indexOf('Trident/') != -1 && (navigator.userAgent.indexOf('rv:') != -1 || navigator.appName.indexOf('Netscape') != -1);
	});

	Modernizr.addTest('edge', function () {
		return (/Edge\/\d./i.test(navigator.userAgent)
		);
	});

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

	// MIT license

	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	})();

	app.settings.isDesktop = !phone && !tablet;
	app.settings.isTablet = !!tablet;
	app.settings.isPhone = !!phone;

	$('html').addClass(app.settings.isDesktop ? "isDesktop" : "isNotDesktop").addClass(app.settings.isTablet ? "isTablet" : "isNotTablet").addClass(app.settings.isPhone ? "isPhone" : "isNotPhone");

	Modernizr.addTest('macos', function () {
		return window.navigator.userAgent.indexOf('Mac') != -1;
	});

	window.app.vent = _.extend({}, Backbone.Events);

	window.app.els = {
		$window: $(window),
		$body: $('body')
	};

	app.router = new Router();

	app.router.start();

	/***/
},,,,
/* 1 */
/* 2 */
/* 3 */
/* 4 */
/***/function (module, exports) {

	// removed by extract-text-webpack-plugin

	/***/},
/* 5 */
/***/function (module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var PageIndex = __webpack_require__(6);

	module.exports = Backbone.Router.extend({
		routes: {
			'': 'index',
			'?*queryString': 'index'
		},

		initialize: function initialize() {
			this.pageIndex = new PageIndex({
				router: this
			});
		},

		index: function index(queryString) {
			var period = window.app.queryUrlGetParam('activeState', queryString) || undefined;
			var territory = window.app.queryUrlGetParam('country', queryString) || undefined;

			this.pageIndex.trigger('url-changed', { period: period, territory: territory });
		},

		start: function start() {
			var pushStateSupported = history && _.isFunction(history.pushState);

			Backbone.history.start({
				pushState: pushStateSupported,
				root: '/1-neyedinaya-rossiya/ig-oskolki/',
				silent: false
			});
		}
	});

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);
		var Page = __webpack_require__(7);

		__webpack_require__(9);

		var Timeline = __webpack_require__(10);
		var Intro = __webpack_require__(12);
		var Regions = __webpack_require__(14);
		var Legend = __webpack_require__(15);
		var Sources = __webpack_require__(17);

		module.exports = Page.extend({

			events: {
				'click .PageIndex-scrolltop': 'onScrollTopClick'
			},

			//принадлежность территории одному из 4х регионов
			TERRITORIES_MAPPING: {
				1: 2,
				2: 1,
				3: 1,
				4: 1,
				5: 2,
				6: 2,
				7: 2,
				8: 3,
				9: 3,
				10: 3,
				11: 3,
				12: 4,
				13: 4,
				14: 3,
				15: 4,
				16: 4,
				17: 3,
				18: 3
			},

			initialize: function initialize(options) {

				_.extend(this, options);

				_.bindAll(this, 'onResize', 'onScroll');

				this.state = {
					period: 3,
					region: undefined,
					territory: undefined,
					minPeriod: 3,
					maxPeriod: 9
				};

				this.intro = new Intro({ state: this.state });
				this.regions = new Regions({ state: this.state });
				this.timeline = new Timeline({ state: this.state });
				this.legend = new Legend({ state: this.state });
				this.sources = new Sources({ state: this.state });

				if (window.app.isPhoneLayout()) {
					this.regions.sidebar.$el.insertAfter(this.timeline.$el);
				}

				this.intro.on('hide', function () {
					$('html').removeClass('hide-scroll');
					$('body').removeClass('intro-opened');
				});

				this.timeline.on('change-period', function (period) {
					this.state.period = period;

					this.goToStateUrl();
				}.bind(this));

				this.regions.on('select-territory', function (params) {
					this.state.region = params.region;
					this.state.territory = params.territory;

					this.goToStateUrl();
				}.bind(this));

				this.on('url-changed', function (params) {
					params.period = params.period - 0;
					params.territory = params.territory - 0;

					if (!params.period || params.period < this.state.minPeriod || params.period > this.state.maxPeriod) {
						this.state.period = this.state.minPeriod;
					} else {
						this.state.period = params.period;
					}

					if (params.territory && this.TERRITORIES_MAPPING[params.territory]) {
						this.state.region = this.TERRITORIES_MAPPING[params.territory];
						this.state.territory = params.territory;
					} else {
						this.state.region = undefined;
						this.state.territory = undefined;
					}

					this.updateState();
				});

				app.page = this;

				this.isPhoneLayout = window.app.isPhoneLayout();

				$(window).on('resize', this.onResize).on('scroll', function () {
					this.onScroll();
				}.bind(this));

				this.onResize();

				this.onScroll();

				this.scrollTopVisible = false;
			},

			goToStateUrl: function goToStateUrl() {
				var url = '/?activeState=' + this.state.period;

				if (this.state.territory) {
					url += '&country=' + this.state.territory;
				}

				this.router.navigate(url, { trigger: true, replace: false });
			},

			onResize: function onResize() {
				this.windowHeight = window.innerHeight;

				//при переключении лейаута инициируем пересчет состояний которые зависят от лейаута
				if (this.isPhoneLayout != window.app.isPhoneLayout()) {
					this.updateState();
					this.isPhoneLayout = window.app.isPhoneLayout();

					if (window.app.isPhoneLayout()) {
						this.regions.sidebar.$el.insertAfter(this.timeline.$el);
					} else {
						this.regions.sidebar.$el.appendTo(this.regions.$el);
					}
				}
			},

			onScroll: function onScroll() {
				var scrollTop = $(window).scrollTop();
				var scrollTopVisible = scrollTop > this.windowHeight;

				if (this.scrollTopVisible != scrollTopVisible) {
					this.$('.PageIndex-scrolltop').toggleClass('PageIndex-scrolltop--visible', scrollTop > this.windowHeight);
					this.scrollTopVisible = scrollTopVisible;
				}
			},

			onScrollTopClick: function onScrollTopClick() {
				$('body,html').animate({ scrollTop: 0 }, 500);
			},

			updateState: function updateState() {
				this.regions.trigger('update-state', this.state);
				this.timeline.trigger('update-state', this.state);
				this.sources.trigger('update-state', this.state);

				var extendedState = _.clone(this.state);
				extendedState.territories = this.regions.getCurrentTerritories();
				this.legend.trigger('update-state', extendedState);
			}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(2);

	__webpack_require__(8);

	// For Modernizr detects html-class
	Modernizr.touchevents;

	module.exports = Backbone.View.extend({

		el: 'body',

		events: {},

		initialize: function initialize(options) {}
	});

	/***/
},
/* 8 */
4,
/* 9 */
4,
/* 10 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);

		__webpack_require__(11);

		var Page = __webpack_require__(7);

		module.exports = Page.extend({

			el: '.Timeline',

			events: {
				'click .Timeline-year': 'onYearClick',
				'click .Timeline-arrow-left': 'onPrevClick',
				'click .Timeline-arrow-right': 'onNextClick'
			},

			initialize: function initialize(options) {
				_.bindAll(this, 'onUpdateState');

				this.state = _.extend({}, options.state);

				this.on('update-state', this.onUpdateState);

				Page.prototype.initialize.apply(this, arguments);
			},

			onUpdateState: function onUpdateState(state) {
				_.extend(this.state, state);

				this.$('.Timeline-year').removeClass('Timeline-year--active');

				this.$('.Timeline-year[data-period="' + this.state.period + '"]').addClass('Timeline-year--active');

				this.$('.Timeline-progress-bar').attr('data-period', this.state.period);

				var index = 3 - this.state.period;

				this.$('.Timeline-year').each(function (ind, item) {
					$(item).attr('data-index', index);
					index++;
				});

				this.$('.Timeline-period').removeClass('Timeline-period--active');
				this.$('.Timeline-period[data-period="' + state.period + '"]').addClass('Timeline-period--active');

				this.$('.Timeline-arrow-left').toggleClass('Timeline-arrow-left--disabled', this.state.period == this.state.minPeriod);
				this.$('.Timeline-arrow-right').toggleClass('Timeline-arrow-right--disabled', this.state.period == this.state.maxPeriod);
			},

			onPrevClick: function onPrevClick() {
				if (this.state.period == this.state.minPeriod) return;

				this.trigger('change-period', this.state.period - 1);
			},

			onNextClick: function onNextClick() {
				if (this.state.period == this.state.maxPeriod) return;

				this.trigger('change-period', this.state.period + 1);
			},

			onYearClick: function onYearClick(e) {
				this.trigger('change-period', $(e.currentTarget).attr('data-period') - 0);
			}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 11 */
4,
/* 12 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);

		__webpack_require__(13);

		var Page = __webpack_require__(7);

		module.exports = Page.extend({

			el: '.Intro',

			events: {
				'click': 'close'
			},

			initialize: function initialize(options) {
				_.extend(this, options);

				_.bindAll(this, 'onKeyDown');

				$(window).on('keydown', this.onKeyDown);

				Page.prototype.initialize.apply(this, arguments);
			},

			onKeyDown: function onKeyDown(e) {
				if (e.keyCode == 27) {
					//esc
					this.close();
				}
			},

			close: function close() {
				this.$el.addClass('Intro--hidden');

				setTimeout(function () {
					this.trigger('hide');
				}.bind(this), 400);
			}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 13 */
4,
/* 14 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);

		__webpack_require__(19);

		var Page = __webpack_require__(7);

		var Sidebar = __webpack_require__(20);

		module.exports = Page.extend({

			el: '.Regions',

			MAP_ASPECT: 960 / 690,
			REGION_ASPECT: 290 / 180,

			//положение контейнера в котором мы разместим плашки с регионами относительно карты-подложки (по дизайну)
			REGIONS_CONTAINER_POSITION: {
				top: 0.11,
				right: 0.18,
				bottom: 0.20,
				left: 0.10
			},

			//минимальные отступы контейнера с регионами от границ основного элемента
			REGIONS_CONTAINER_MIN_PADDINGS: {
				vert: 0.16,
				horz: 0.05
			},

			//отступы между самими регионами
			REGION_PADDINGS: {
				vert: 0.042,
				horz: 0.16
			},

			//для тултипов
			TERRITORIES_CAPTIONS: {
				1: 'Финляндия',
				2: 'Польша',
				3: 'Украина',
				4: 'Белоруссия',
				5: 'Литва',
				6: 'Латвия',
				7: 'Эстония',
				8: 'Закавказская республика',
				9: 'Грузия',
				10: 'Армения',
				11: 'Азербайджан',
				12: 'Бухара',
				13: 'Хива',
				14: 'Дагестан',
				15: 'Туркестан',
				16: 'Урянхайский край',
				17: 'Крымская народная республика',
				18: 'Всевеликое Войско Донское'
			},

			events: {
				'mouseenter .Regions-regionPeriod': 'onRegionMouseEnter',
				'mouseleave .Regions-regionPeriod': 'onRegionMouseLeave',
				'click .Regions-regionPeriod': 'onRegionClick',
				'click .Regions-overlay': 'onOverlayClick',

				'click .Regions-mobile-caption': 'onRegionMobileCaptionClick',

				'mouseenter .Regions-pin': 'onTerritoryMouseEnter',
				'mouseleave .Regions-pin': 'onTerritoryMouseLeave',
				'click .Regions-pin': 'onTerritoryClick',

				'mouseenter .Regions-area': 'onTerritoryMouseEnter',
				'mouseleave .Regions-area': 'onTerritoryMouseLeave',
				'click .Regions-area': 'onTerritoryClick'
			},

			initialize: function initialize(options) {
				_.bindAll(this, 'onKeyDown', 'onResize', 'onUpdateState', 'onBodyClick', 'onTerritoryMouseMove');

				$(window).on('keydown', this.onKeyDown);

				this.state = _.extend({}, options.state);

				this.on('update-state', this.onUpdateState);

				this.onResize();

				$(window).on('resize', this.onResize);

				this.$('.Regions-regions').show();

				this.$tooltip = this.$('.Regions-tooltip');

				this.sidebar = new Sidebar({ state: this.state });

				this.sidebar.on('close', function () {
					this.trigger('select-territory', { region: undefined, territory: undefined });
				}.bind(this));

				this.prevItems = {};

				if (app.settings.isPhone) {
					this.$el.swipe({
						allowPageScroll: 'auto',
						threshold: 50,
						excludedElements: "button, input, select, textarea, .noSwipe",
						swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
							if (direction == 'left' || direction == 'right') this.swipeTerritories(direction);
						}.bind(this)
					});
				}

				this.calcTransformMethod();

				Page.prototype.initialize.apply(this, arguments);
			},

			//в сафари и наверное в некоторых других кейсах точка ресайза элементов свг отсчитывается от самого элемента
			//а в хроме и фф от самой свг (что странно) поэтому нам надо для ресайза пина на карте знать как идет расчет точки ресайза
			calcTransformMethod: function calcTransformMethod() {

				var originalBB = this.$('.Regions-test-svg-rect-original')[0].getBoundingClientRect();
				var scaledBB = this.$('.Regions-test-svg-rect-scaled')[0].getBoundingClientRect();

				this.isSvgItemScaledFromItself = Math.round(originalBB.left) == Math.round(scaledBB.left);
			},

			onKeyDown: function onKeyDown(e) {
				if (e.keyCode == 27 && this.state.region) {
					//esc
					this.trigger('select-territory', { region: undefined, territory: undefined });
				}
			},

			//pageIndex запрашивает списко текущих видимых территорий
			getCurrentTerritories: function getCurrentTerritories() {
				var res = {};

				this.$('.Regions-regionPeriod[data-period="' + this.state.period + '"] svg .Regions-area').each(function (ind, item) {
					var item = $(item);
					var color = $(item).css('fill');

					//не фиксируем регион присутствующим на карте если у него серый неактивный цвет
					if (color != '#bababa' && color != 'rgb(186, 186, 186)') {
						res[$(item).attr('data-territory')] = 1;
					}
				});

				return res;
			},

			//запоминаем элемент которому в последний раз назначали такой класс
			//и когда назначаем такой же класс другому элементу, то с прежнего снимаем его
			//нужно чтобы быстро переключать активный элемент внутри свг (чтобы не передирать все, их много) а активный может быть только один
			setClass: function setClass($item, className, val) {
				if (!$item || !$item.length) return;

				if (val) {
					if (this.prevItems[className] && this.prevItems[className] != $item) {
						this.prevItems[className][0].removeClass(className);
					}
					$item[0].addClass(className);
					this.prevItems[className] = $item;
				} else {
					$item[0].removeClass(className);
					delete this.prevItems[className];
				}
			},

			onUpdateState: function onUpdateState(state) {
				var animatePinsAndAreas = this.state.period == state.period;

				_.extend(this.state, state);

				if (window.app.isPhoneLayout()) {
					//костыль, что всегда должна быть выделен регион/территория
					if (this.state.region == undefined) {
						var region = 1;
						var territory = this.findFirstTerritoryForPeriod(region, this.state.period);
						this.trigger('select-territory', { region: region, territory: territory });
						return;
					}
				}

				this.$('.Regions-region').removeClass('Regions-region--active');
				this.$('.Regions-regionPeriod').removeClass('Regions-regionPeriod--active');

				this.$('.Regions-mobile-caption').removeClass('Regions-mobile-caption--active');

				if (this.state.region) {
					this.$('.Regions-region[data-region="' + this.state.region + '"]').addClass('Regions-region--active');
					this.$('.Regions-mobile-caption[data-region="' + this.state.region + '"]').addClass('Regions-mobile-caption--active');
					this.$('.Regions-mobile-captions').attr('data-active', this.state.region);
				}

				this.$('.Regions-regionPeriod[data-period="' + this.state.period + '"]').addClass('Regions-regionPeriod--active');

				this.$el.toggleClass('Regions--active', !!this.state.region);

				this.sidebar.trigger('update-state', this.state);

				var items = this.getPinAndArea({
					region: this.state.region,
					period: this.state.period,
					territory: this.state.territory
				});

				this.createSwipePoints();

				//анимация сняти я активного класса происходит несколько иначе чем анимация снятия ховер класса
				var $prevActive = this.prevItems['Regions-area-hover--active'];
				if ($prevActive && (!items || $prevActive != items.$areaHover)) {
					$prevActive[0].addClass('Regions-area-hover--unactive');
				}

				if (items) {
					//при переходах между периодами когда не меняется выделенная территория
					//нам не нужна анимация пинов и территорий (ни обратная анимация у предыдущих, ни прямая у новых)
					//иначе это выглядит дерьмово
					if (!animatePinsAndAreas) {
						this.disableTransitions(items.$area, items.$areaHover, items.$pin, this.prevItems['Regions-area--active'], this.prevItems['Regions-area-hover--active'], this.prevItems['Regions-pin--active']);
					}

					this.setPinTransformOrigin(items.$svg, items.$pin);

					this.setClass(items.$area, 'Regions-area--active', true);
					this.setClass(items.$areaHover, 'Regions-area-hover--active', true);
					this.setClass(items.$pin, 'Regions-pin--active', true);
				} else {
					//при закрытии сайдбара выключаем последнюю активную территорию
					//или если на текущей карте нет никого для включения, предыдущее все равно надо выключить
					this.setClass(this.prevItems['Regions-area--active'], 'Regions-area--active', false);
					this.setClass(this.prevItems['Regions-area-hover--active'], 'Regions-area-hover--active', false);
					this.setClass(this.prevItems['Regions-pin--active'], 'Regions-pin--active', false);

					if (window.app.isPhoneLayout()) {
						var territory = this.findFirstTerritoryForPeriod(this.state.region, this.state.period);

						this.trigger('select-territory', { region: this.state.region, territory: territory });
					}
				}
			},

			swipeTerritories: function swipeTerritories(direction) {
				var $point = this.$('.Regions-region[data-region="' + this.state.region + '"] .Regions-region-swipe-point--active');

				if (!$point.length) return;

				var $points = this.$('.Regions-region[data-region="' + this.state.region + '"] .Regions-region-swipe-point');

				if (direction == 'right') {
					$point = $point.prev();

					if (!$point.length) {
						$point = $points.last();
					}
				} else {
					$point = $point.next();

					if (!$point.length) {
						$point = $points.first();
					}
				}

				this.trigger('select-territory', { region: this.state.region, territory: $point.attr('data-territory') });
			},

			createSwipePoints: function createSwipePoints() {
				if (!app.settings.isPhone) return;

				var $region = this.$('.Regions-region[data-region="' + this.state.region + '"]');
				var $regionPeriod = this.$('.Regions-regionPeriod[data-region="' + this.state.region + '"][data-period="' + this.state.period + '"]');

				$('.Regions-region-swipe-points', $region).empty();

				//ищем пины в нужном регионе/периоде
				$('.Regions-pin', $regionPeriod).each(function (ind, item) {
					var $pin = $(item);
					var territory = $pin.attr('data-territory');
					var $point = $('<div class="Regions-region-swipe-point" data-territory="' + territory + '">');

					$('.Regions-region-swipe-points', $region).append($point);

					$point.toggleClass('Regions-region-swipe-point--active', territory == this.state.territory);
				}.bind(this));

				//одна точка не нужна
				if ($('.Regions-region-swipe-point', $region).length == 1) {
					$('.Regions-region-swipe-points', $region).empty();
				}
			},

			disableTransitions: function disableTransitions($area, $areaHover, $pin, $areaPrev, $areaHoverPrev, $pinPrev) {
				$area && $area[0].addClass('Regions-area--notransitions');
				$areaHover && $areaHover[0].addClass('Regions-area-hover--notransitions');
				$pin && $pin[0].addClass('Regions-pin--notransitions');
				$areaPrev && $areaPrev[0].addClass('Regions-area--delayedtransitions');
				$areaHoverPrev && $areaHoverPrev[0].addClass('Regions-area-hover--delayedtransitions');
				$pinPrev && $pinPrev[0].addClass('Regions-pin--delayedtransitions');

				setTimeout(function () {
					$area && $area[0].removeClass('Regions-area--notransitions');
					$areaHover && $areaHover[0].removeClass('Regions-area-hover--notransitions');
					$pin && $pin[0].removeClass('Regions-pin--notransitions');
					$areaPrev && $areaPrev[0].removeClass('Regions-area--delayedtransitions');
					$areaHoverPrev && $areaHoverPrev[0].removeClass('Regions-area-hover--delayedtransitions');
					$pinPrev && $pinPrev[0].removeClass('Regions-pin--delayedtransitions');
				}, 17);
			},

			setPinTransformOrigin: function setPinTransformOrigin($svg, $pin) {
				if ($pin[0].hasClass('Regions-pin--positioned')) return;

				var svgBB = $svg[0].getBoundingClientRect();
				var pinBB = $pin[0].getBoundingClientRect();

				var territory = $pin.attr('data-territory') - 0;
				var period = $pin.attr('data-period') - 0;
				var rotatedPins = { 10: 1, 9: 1, 17: 1, 5: 1, 2: 1, 16: 1, 7: 1 };
				var rightCorner = rotatedPins[territory];

				//костыль для исключительного случая Украины в 1919 году
				if (territory == 3 && period == 6) {
					rightCorner = true;
				}

				var px = 100 * (pinBB.left - svgBB.left + (rightCorner ? pinBB.width : 0)) / svgBB.width;
				var py = 100 * (pinBB.top - svgBB.top + pinBB.height) / svgBB.height;

				//в сафари точка трансформа отсчитывается не от родительской свг (как во всех остальных браузерах)
				//а от самого элемента (что вполне логично и правильно)
				// if (Modernizr.safari) {
				if (this.isSvgItemScaledFromItself) {
					var px = rightCorner ? 100 : 0;
					var py = 100;
				}

				$pin.css('transform-origin', px + '% ' + py + '%');

				$pin[0].addClass('Regions-pin--positioned');
			},

			//клик по заголовку региона в мобильной версии
			//надо выбрать первую подходящую территорию в текущем периоде и сделать ее активной
			onRegionMobileCaptionClick: function onRegionMobileCaptionClick(e) {
				var $caption = $(e.currentTarget);
				var region = $caption.attr('data-region');
				var period = this.state.period;
				var territory = this.findFirstTerritoryForPeriod(region, period);

				this.trigger('select-territory', { region: region, territory: territory });
			},

			findFirstTerritoryForPeriod: function findFirstTerritoryForPeriod(region, period) {
				var pins = [];
				var territory;

				//ищем пины в нужном регионе/периоде
				this.$('.Regions-regionPeriod[data-region="' + region + '"][data-period="' + period + '"] .Regions-pin').each(function (ind, item) {
					var $pin = $(item);
					var territory = $pin.attr('data-territory');
					pins.push(territory);
				});

				//если не нашли ни одного, тогда ищем все территории в нужном регионе/периоде
				//но берем не первую попавшуюся, а только ту, у которой хоть где-то есть пины в других периодах данного региона
				//иначе в северной европе 22 года например мы можем выбрать Польшу, которая там показана просто что она есть,
				//описание и пины для нее идут в Восточной европе
				if (!pins.length) {
					var allPins = {};
					//ищем все пины в нужном регионе (не смотря на период)
					this.$('.Regions-regionPeriod[data-region="' + region + '"] .Regions-pin').each(function (ind, item) {
						var $pin = $(item);
						var territory = $pin.attr('data-territory');
						allPins[territory] = 1;
					});

					//ищем области в нужном регионе/периоде
					var areas = [];
					this.$('.Regions-regionPeriod[data-region="' + region + '"][data-period="' + period + '"] .Regions-area').each(function (ind, item) {
						var $area = $(item);
						var territory = $area.attr('data-territory');

						//но выбираем только те которые имееют отношение к текущему региону (хоть в каком-то периоде у них есть пины)
						if (allPins[territory]) {
							areas.push(territory);
						}
					});

					if (areas.length) {
						territory = areas[0];
					}
				} else {
					territory = pins[0];
				}

				//в азии в 1917 такое есть
				//вернем просто какую-то территорию с региона (пусть и из другого периода)
				//ничего страшного не случиться, сайдбар не появится (инфы то нет) и на карте ничего не отметится (нечему)
				//зато регион будет активен и вообще общая логика не нарушится
				//эти костыли происходят из-за непробуманности дизайна мобилки и всплыли эти вопросы уже при реализации
				//по дизайну на мобилке всегда какой-то регион активен
				if (!territory) {
					territory = _.keys(allPins)[0];
				}

				return territory;
			},

			onRegionMouseEnter: function onRegionMouseEnter(e) {
				if (!app.settings.isDesktop) return;

				var $region = $(e.currentTarget).closest('.Regions-region');

				this.$('.Regions-region').removeClass('Regions-region--hovered');

				$region.addClass('Regions-region--hovered');
			},

			onRegionMouseLeave: function onRegionMouseLeave(e) {
				if (!app.settings.isDesktop) return;

				var $region = $(e.currentTarget).closest('.Regions-region');

				$region.removeClass('Regions-region--hovered');
			},

			onRegionClick: function onRegionClick(e) {
				if (!app.settings.isTablet) return;

				var $region = $(e.currentTarget).closest('.Regions-region');

				//если уже активен и нажимаем на территорию внутри
				if ($region.hasClass('Regions-region--hovered')) return;

				this.$('.Regions-region').removeClass('Regions-region--hovered');

				$region.addClass('Regions-region--hovered');

				$('body').off('click', this.onBodyClick).on('click', this.onBodyClick);
			},

			onBodyClick: function onBodyClick(e) {
				var $region = $(e.target).closest('.Regions-region');

				if ($region.length) return;

				this.$('.Regions-region').removeClass('Regions-region--hovered');
			},

			getPinAndArea: function getPinAndArea(params) {
				var region = params.region;
				var period = params.period;
				var territory = params.territory;

				var $svg = this.$('.Regions-regionPeriod[data-region="' + region + '"][data-period="' + period + '"] svg');
				var $area = $svg.find('.Regions-area[data-period="' + period + '"][data-territory="' + territory + '"]');
				var $areaHover = $svg.find('.Regions-area-hover[data-period="' + period + '"][data-territory="' + territory + '"]');
				var $pin = $svg.find('.Regions-pin[data-period="' + period + '"][data-territory="' + territory + '"]');

				if ($pin.length) {
					return {
						$area: $area.length ? $area : undefined,
						$areaHover: $areaHover.length ? $areaHover : undefined,
						$pin: $pin,
						$svg: $svg
					};
				} else {
					return;
				}
			},

			onTerritoryMouseEnter: function onTerritoryMouseEnter(e) {
				if (!app.settings.isDesktop) return;

				var territory = $(e.currentTarget).attr('data-territory');

				var items = this.getPinAndArea({
					region: $(e.currentTarget).closest('.Regions-regionPeriod').attr('data-region'),
					period: $(e.currentTarget).attr('data-period'),
					territory: territory
				});

				if (!items) {
					e.currentTarget.addClass('Regions-area--nopin');

					//это может быть только ситуация, когда территория есть, а пина нет
					//покажем тултип
					this.$tooltip.text(this.TERRITORIES_CAPTIONS[territory]).show();

					this.$tooltip.css('margin-left', -Math.round(this.$tooltip.outerWidth() / 2));

					this.tooltipShown = true;

					$(window).on('mousemove', this.onTerritoryMouseMove);
				} else {
					items.$areaHover && items.$areaHover.removeClass('Regions-area-hover--unactive');

					this.setClass(items.$area, 'Regions-area--hovered', true);
					this.setClass(items.$areaHover, 'Regions-area-hover--hovered', true);
					this.setClass(items.$pin, 'Regions-pin--hovered', true);
				}
			},

			onTerritoryMouseMove: function onTerritoryMouseMove(e) {
				this.$tooltip.css({
					'transform': 'translate(' + e.pageX + 'px, ' + (e.pageY - $(window).scrollTop()) + 'px)'
				});
			},

			onTerritoryMouseLeave: function onTerritoryMouseLeave(e) {
				if (!app.settings.isDesktop) return;

				var items = this.getPinAndArea({
					region: $(e.currentTarget).closest('.Regions-regionPeriod').attr('data-region'),
					period: $(e.currentTarget).attr('data-period'),
					territory: $(e.currentTarget).attr('data-territory')
				});

				if (this.tooltipShown) {
					this.tooltipShown = false;

					$(window).off('mousemove', this.onTerritoryMouseMove);

					this.$tooltip.hide();
				}

				if (!items) {
					return;
				}

				this.setClass(items.$area, 'Regions-area--hovered', false);
				this.setClass(items.$areaHover, 'Regions-area-hover--hovered', false);
				this.setClass(items.$pin, 'Regions-pin--hovered', false);
			},

			onTerritoryClick: function onTerritoryClick(e) {
				var $region = $(e.target).closest('.Regions-regionPeriod');
				var $territory = $(e.currentTarget);
				var region = $region.attr('data-region') - 0;
				var territory = $territory.attr('data-territory') - 0;
				var period = $region.attr('data-period');

				var items = this.getPinAndArea({
					region: region,
					period: period,
					territory: territory
				});

				if (!items) {
					return;
				}

				if (window.app.isPhoneLayout()) {
					$('body,html').animate({ scrollTop: this.sidebar.$el.offset().top }, 500);
				}

				this.trigger('select-territory', { region: $region.attr('data-region') - 0, territory: $territory.attr('data-territory') - 0 });
			},

			onOverlayClick: function onOverlayClick() {
				this.trigger('select-territory', { region: undefined, territory: undefined });
			},

			onResize: function onResize() {
				//размеры самого элемента
				var ew = this.$el.width();
				var eh = this.$el.height();

				if (window.app.isPhoneLayout()) {
					var h = Math.round(ew * 196 / 320);

					this.$('.Regions-regions').css({
						height: h
					});

					this.$('.Regions-mobile-caption').css({
						'transform': 'translateY(' + -h + 'px)'
					}).flashClass('Regions-mobile-caption--notransitions', 17);
				} else {
					//размеры свг с картой
					var mh = this.$('.Regions-map').height();
					var mw = this.MAP_ASPECT * mh;

					//положение свг с картой относительно родителя
					var mx = (ew - mw) / 2;
					var my = (eh - mh) / 2;

					//расчитываем границы контейнера с регионами
					var ct = my + mh * this.REGIONS_CONTAINER_POSITION.top;
					var cr = mx + mw * this.REGIONS_CONTAINER_POSITION.right;
					var cb = my + mh * this.REGIONS_CONTAINER_POSITION.bottom;
					var cl = mx + mw * this.REGIONS_CONTAINER_POSITION.left;

					//смотрим минимальные отступы по горизонтали и вертикали, для текущего размера окна
					var minVertPadding = this.REGIONS_CONTAINER_MIN_PADDINGS.vert * eh;
					var minHorzPadding = this.REGIONS_CONTAINER_MIN_PADDINGS.horz * ew;

					ct = Math.round(Math.max(ct, minVertPadding));
					cr = Math.round(Math.max(cr, minHorzPadding));
					cb = Math.round(Math.max(cb, minVertPadding));
					cl = Math.round(Math.max(cl, minHorzPadding));

					this.$('.Regions-regions').css({
						top: ct,
						right: cr,
						bottom: cb,
						left: cl
					});

					//размеры контейнера для регионов
					var cw = ew - cr - cl;
					var ch = eh - ct - cb;

					//расчитываем размеры региона исзодя из того что регионы идут по два в строке и в столбце и мы знаем между ними отступ
					var rw = (cw - cw * this.REGION_PADDINGS.horz) / 2;
					var rh = (ch - ch * this.REGION_PADDINGS.vert) / 2;

					//теперь приводим размер региона к нужному аспекту (contain)
					if (rw / rh > this.REGION_ASPECT) {
						rw = rh * this.REGION_ASPECT;
					} else {
						rh = rw / this.REGION_ASPECT;
					}

					rw = Math.round(rw);
					rh = Math.round(rh);

					this.$('.Regions-region[data-region="2"], .Regions-region[data-region="4"]').css('transform', 'translateX(-' + Math.round(cw - rw) + 'px)').flashClass('Regions-region--notransitions', 17);

					this.$('.Regions-region').css({
						width: rw,
						height: rh
					});
				}
			}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 15 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);

		__webpack_require__(16);

		var Page = __webpack_require__(7);

		module.exports = Page.extend({

			el: '.Legend',

			events: {},

			initialize: function initialize(options) {
				_.bindAll(this, 'onUpdateState');

				this.state = _.extend({}, options.state);

				this.on('update-state', this.onUpdateState);

				Page.prototype.initialize.apply(this, arguments);
			},

			onUpdateState: function onUpdateState(state) {
				_.extend(this.state, state);

				var duration = app.settings.isPhone ? 0 : 300;

				this.$('.Legend-marker:not(.Legend-marker--fixed)').each(function (ind, item) {
					var $item = $(item);
					var territory = $item.attr('data-territory');
					if (state.territories[territory]) {
						$item.slideDown(duration);
					} else {
						$item.slideUp(duration);
					}
				});
			}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 16 */
4,
/* 17 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(2);

	__webpack_require__(18);

	var Page = __webpack_require__(7);

	module.exports = Page.extend({

		el: '.Sources',

		events: {},

		initialize: function initialize(options) {
			_.bindAll(this, 'onUpdateState');

			this.state = _.extend({}, options.state);

			this.on('update-state', this.onUpdateState);

			Page.prototype.initialize.apply(this, arguments);
		},

		onUpdateState: function onUpdateState(state) {
			_.extend(this.state, state);
		}
	});

	/***/
},
/* 18 */
4,
/* 19 */
4,
/* 20 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function ($) {
		'use strict';

		var Backbone = __webpack_require__(1);
		var _ = __webpack_require__(2);

		__webpack_require__(21);

		var Page = __webpack_require__(7);

		module.exports = Page.extend({

			el: '.Sidebar',

			events: {
				'click .Sidebar-close': 'onCloseClick'
			},

			initialize: function initialize(options) {
				_.bindAll(this, 'onResize', 'onUpdateState');

				this.state = _.extend({}, options.state);

				this.on('update-state', this.onUpdateState);

				this.onResize();

				$(window).on('resize', this.onResize);

				Page.prototype.initialize.apply(this, arguments);
			},

			onUpdateState: function onUpdateState(state) {
				//с анимацией если не в первый раз и если уже было выбрана территория до этого и сейчас тоже выбрана територия
				var withAnimation = this.state && this.state.territory !== undefined && state.territory !== undefined;

				//проскроливаем с анимацией если та же самая территория (поменялся только период)
				var scrollWithAnimation = this.state && this.state.territory !== undefined && this.state.territory == state.territory && this.state.period != state.period;

				_.extend(this.state, state);

				var hasInfo = !!this.state.territory;

				//на телефоне сайдбар показываем только если есть данные за период
				//там нет текстов за все периоды, а только один текст на один период
				if (window.app.isPhoneLayout()) {
					this.$('.Sidebar-text[data-territory="' + state.territory + '"] p').removeClass('Sidebar-text-period--active');
					var $textPeriod = this.$('.Sidebar-text[data-territory="' + state.territory + '"] p[data-period="' + state.period + '"]');
					$textPeriod.addClass('Sidebar-text-period--active');
					hasInfo = !!$textPeriod.length;
				}

				this.$el.toggleClass('Sidebar--visible', hasInfo);

				//если не закрываем сайдбар, а открываем или меняем в нем период/территорию
				if (hasInfo) {
					this.$('.Sidebar-period').removeClass('Sidebar-period--active');
					this.$('.Sidebar-period[data-period="' + state.period + '"]').addClass('Sidebar-period--active');

					this.$('.Sidebar-caption').removeClass('Sidebar-caption--active');
					this.$('.Sidebar-caption[data-territory="' + state.territory + '"]').addClass('Sidebar-caption--active');

					this.$('.Sidebar-text').removeClass('Sidebar-text--active');
					this.$('.Sidebar-text[data-territory="' + state.territory + '"]').addClass('Sidebar-text--active');

					if (!window.app.isPhoneLayout()) {
						if (!withAnimation) {
							this.$('.Sidebar-captions').flashClass('Sidebar-captions--notransitions');
							this.$('.Sidebar-content').flashClass('Sidebar-content--notransitions');
						}

						var $text = this.$('.Sidebar-text[data-territory="' + state.territory + '"] p').eq(0);

						while ($text.attr('data-period') - 0 < state.period) {
							var $prevText = $text;
							$text = $text.next();

							if (!$text.length) {
								$text = $prevText;
								break;
							}
						}

						var scrollTop = $text.position().top + this.$('.Sidebar-scrollbox').scrollTop();

						if (scrollWithAnimation) {
							this.$('.Sidebar-scrollbox').stop().animate({ scrollTop: scrollTop }, 500);
						} else {

							//если тексты меняются с анимацией, надо проскролить до нужного места через определенное время, когда новый текст будет показан
							if (withAnimation) {
								window.app.waitForTransitionEnd(this.$('.Sidebar-text[data-territory="' + state.territory + '"]'), 'max-height', function () {
									var scrollTop = $text.position().top + this.$('.Sidebar-scrollbox').scrollTop();
									this.$('.Sidebar-scrollbox').scrollTop(scrollTop);
								}.bind(this), 500);
							} else {
								this.$('.Sidebar-scrollbox').scrollTop(scrollTop);
							}
						}
					}
				}
			},

			onCloseClick: function onCloseClick() {
				this.trigger('close');
			},

			onResize: function onResize() {}
		});

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3));

	/***/
},
/* 21 */
4]);
//# sourceMappingURL=app.js.map