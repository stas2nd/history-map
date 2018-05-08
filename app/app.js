'use strict';

function sleep(ms) {
  return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}

var preloadImages = function (objects) {
    var rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
    var content = objects.map(function (x) { return x.body; }).join('');
    var m;
    while (m = rex.exec( content ) ) {
        var image = new Image();
        image.src = m[1];
    }
};

var checkVideoLoad = function (video, resolve, retry) {
    if ( retry === void 0 ) retry=0;

    if (video.readyState === 4 || retry > 30) { resolve(); } 
    else { setTimeout(function () { return checkVideoLoad(video, resolve, retry+1); }, 100); }
};

var styles = {
    el: {
        position: 'relative',
        width: '100%',
        'background-color': '#000',
        // 'overflow': 'hidden'
    },
    content: {
        transition: 'opacity',
        opacity: 1,
        // unknown stuff
        // 'top': '-100vh',
        'width': '100%',
        'z-index': 0,
        'background-color': '#F5F1F1'
    }
};
var isActive = 'is-active';


$.fn.loader = function (options) {
    var this$1 = this;
    if ( options === void 0 ) options={};

    var that = this;
    this.url = '/api/text';
    this.objects = [];
    this.obj = null;
    this.end = {};
    this.finished = false;
    this.start = 0;
    this.header = $('header.header');
    this.session_switcher = $('div.popup');
    this.header_height = this.header.length === 0 ? 0 : this.header.outerHeight();
    this.pseudo = document.head.appendChild(document.createElement("style"));
    this.total = 1;
    this.locked = false;
    this.empty = true;
    this.options = {};
    this.next_auto = false;
    this.skip_intro = false;
    this.triggered = null;
    this.path = window.location.pathname;
    this.body = $('body');
    // this.online = true;

    var chapter = options.chapter; if ( chapter === void 0 ) chapter = 0;
    var name = options.name; if ( name === void 0 ) name = '';
    var photo = options.photo; if ( photo === void 0 ) photo = '';

    // ajax error handler
    this.ajax = function (options, retry, force) {
        if ( retry === void 0 ) retry=3;
        if ( force === void 0 ) force=false;

        if (typeof options === 'undefined') { options = that.options; }
        if (typeof retry === 'undefined') { that.options = options; }
        if (!force && that.locked) { return; }
        if (retry <= 0) {
            that.locked = false;
            that.body.removeClass('locked');
            that.body.addClass('offline');
            return;
        }

        that.locked = true;
        that.body.addClass('locked');

        var success = options.success;
        var error = options.error;
        var data = options.data;
        var opts = Object.assign({}, options);
        data.timestamp = new Date().getTime();
        Object.assign(opts, {
            timeout: 10000,
            data: data,
            success: function(e) {
                that.locked = false;
                that.body.removeClass('locked');
                if (typeof success === 'function') { success(e); }
            },
            error: function(e) {
                // in case of error 500 - sleep
                sleep(2000).then(function () {
                    console.log('retry');
                    that.ajax(options, retry-1, true);
                    if (typeof error === 'function') { error(e); }
                });
            }
        });
        $.ajax(opts);
    };

    this.body.on('click', '.b-question-block__check button', function(){
        that.body.removeClass('offline');
        that.ajax();
    });

    // header
    this.set_progressbar = function (id) {
        var ww = $( window ).outerWidth();
        var w = Math.max(Math.round(ww * Math.min((id - 1) / that.total), 1), 0);
        that.pseudo.innerHTML = ".header__menu:after {width: " + w + "px;}";
        if (id > 1) {
            $('a.profile__again', that.header).css('display', 'flex');
            $('div.profile .profile__score', that.header).show();
        }
    };

    that.set_title = function (el) {
        var block = $('.js-title', el);
        var h2 = $('h2, .page__head-title', block).clone();
        if (!(h2.length > 0)) { return; }

        var target = $('.header__page-name', that.header);
        $('.header__page-date', target).text($('span, .page__head-date', block).text());
        $( "*", h2 ).each(function() {
           $( this ).append(' ');
        });

        $('.header__page-title', target).text(h2.text());
    };

    this.addScore = function (h, p) {
        if ( h === void 0 ) h=0;
        if ( p === void 0 ) p=0;

        if (that.header.length === 0) { return; }
        if (that.start === 0) { return; }

        var ref = that.header.data();
        var health = ref.health; if ( health === void 0 ) health = 0;
        var power = ref.power; if ( power === void 0 ) power = 0;
        power = power + p;
        health = health + h;
        that.header.data({
            health: health,
            power: power
        });

        var score = $('.header__login-score', that.header);
        $('.header__score-red', score).text(power * 10);
        $('.header__score-blue', score).text(health * 10);
        $('.header__score-red').show();
        $('.header__score-blue').show();

        var score2 = $('div.profile .profile__score', that.header);
        $('.profile__score-red .profile__score-num', score2).text(power * 10);
        $('.profile__score-blue .profile__score-num', score2).text(health * 10);
    };

    this.add_header = function (health, power, user) {
        if (that.header === 0) { return; }
        that.addScore(health, power);
        var red = $('.header__score-red');
        var blue = $('.header__score-blue');
        var avatar = user.avatar;
        var is_authenticated = user.is_authenticated;
        var profile = $('div.profile', that.header);
        var avatar_block = $('.header__avatar-list', that.header);
        var name_block = $('.profile__name-text', profile);
        var auth_block = $('.profile__auth', profile);
        var again = $('a.profile__again', profile);
        var close = $('a.profile__close', profile);
        var logout = $('a.profile__exit', profile);
		var blockSure = $('.profile__sure', profile);
		var blockSureWrap = $('.profile__sure-wrapper', profile);
		var flagMobile = $('.profile__sure-mobile', profile);
		var blockName = $('.profile__name', profile);
		var blockScore = $('.profile__score', profile);
		var blockAuth = $('.profile__auth', profile);

        if (red.html() !== '&nbsp;') {
            red.show();
        }
        if (blue.html() !== '&nbsp;') {
            blue.show();
        }
        if (avatar) {
            $('img.header__avatar-user', avatar_block).attr('src',avatar).show();
            $('img.profile__avatar-img', profile).attr('src', x).show();
        }
        if (photo) {
            $('img.header__avatar-hero', avatar_block).attr('src', photo);
        }

        $('.header__avatar-list', that.header).on('click', function(e){
            e.preventDefault();
            profile.fadeIn();
            if ($('div.profile .profile__score', that.header).is(':visible')) { again.css('display', 'flex'); }
        });

        // close popup button
        close.on('click', function(e) {
            e.preventDefault();
            profile.fadeOut();
        });

        // set title
        name_block.html($.merge(['вы —'], name.split(' ')).join('<br/>'));

        // hide auth if we have user data
        if (is_authenticated) {
            auth_block.hide();
            logout.attr('href', ("/logout?next=" + (window.location.href))).css('display', 'flex');
        }
        else {
            logout.hide();
            $('a.profile__social-icon-fb', auth_block).attr('href', ("/login/facebook?next=" + (window.location.href)));
            $('a.profile__social-icon-vk', auth_block).attr('href', ("/login/vk-oauth2?next=" + (window.location.href)));
        }


        // confirm reset
        $('.profile__sure-close, .profile__btn-list .profile__sure-btn--cancel', profile).on('click', function(e){
            e.preventDefault();
	        blockSure.classList.remove('is-active');
	        blockSureWrap.classList.remove('is-active');
        });
        $('.profile__btn-list .profile__sure-btn--yes', profile).on('click', function(e){
            e.preventDefault();
            that.ajax({
                url: '/api/progress/reset',
                data: {
                    chapter: chapter
                },
                success: function success() {
                    that.body.fadeOut(function () {
                        window.scrollTo(0,0);
                        window.location.reload();
                    });
                }
            });
        });

		var heightYES = function(element){
			if (element) {
				if (element.is(':visible')) {
					return element.outerHeight(true);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		};

        again.on('click', function(e) {
	        var sureHeight = again.outerHeight(true) + logout.outerHeight(true);
	        e.preventDefault();
	        blockSure.addClass('is-active');
	        blockSureWrap.addClass('is-active');
            if (flagMobile.is(':hidden')) {
	            blockSure.css('height', sureHeight);
            } else {
	            blockSureWrap.css('height', heightYES(again) + heightYES(logout) + heightYES(blockName) + heightYES(blockScore) + heightYES(blockAuth));
            }
        });
    };

    // get progress
    this.switch_session = function(r) {
        if ( r === void 0 ) r=false;

        that.session_switcher.hide();
        that.ajax({
            url: '/api/progress/switch',
            data: {
                chapter: chapter,
                action: r ? 'restore' : 'update'
            },
            success: function success() {
                that.go();
            }
        });
    };

    this.go = function() {
        that.ajax({
            url: '/api/progress/my',
            data: {
                chapter: chapter
            },
            dataType: 'json',
            success: function (r) {
                var health = r.health;
                var power = r.power;
                var current = r.current;
                var user = r.user;
                var sw = r.sw;
                var total = r.total;
                var exists = r.exists;
                if (exists && current === 0) { that.skip_intro = true; }
                that.start = current ? current + 1 : 0;
                that.total = total;
                that.add_header(health, power, user);
                that.set_progressbar(that.start);
                if (that.start > 0) {
                    that.header.removeClass('header--intro');
                    that.body.css('overflow', 'unset');
                }

                if (sw) {
                    that.session_switcher.css('visibility', 'unset').show().fadeIn();
                    if (that.session_switcher.length > 0) {
                        // restore old session
                        $('.popup__btn--resume', that.session_switcher).on('click', function(e) {
                            e.preventDefault();
                            that.switch_session(true);
                        });
                        // continue current
                        $('.popup__btn--restart', that.session_switcher).on('click', function(e) {
                            e.preventDefault();
                            that.switch_session();
                        });
                    }
                    else {
                        that.switch_session();
                    }
                } else {
                    $(that).trigger('next');
                }
            }
        });
    };
    this.go();

    // get slides, rendering

    this.get_slide = function(html, id) {
        return $(("<div class=\"slide_wrapper\" id=\"wrapper-" + id + "\" data-id=\"" + id + "\" />")).css(styles.el).append(
            $('<div/>').css(styles.content).append(html)
        )
    };

    this.fetch = function (callback, desc) {
        if ( desc === void 0 ) desc=false;

        // backward is deprecated and has no maintain
        var objects = that.objects; if ( objects === void 0 ) objects = [];
        var latest = (objects.length === 0) ? objects[0] : objects[objects.length-1];
        var first = objects[0];
        var key = desc ? 'id__lt' : 'id__gte';
        var query = {};

        if (this$1.end[desc ? 'desc' : 'asc']) {
            return new Promise(function (resolve) {resolve();});
        } else if (typeof that.current_id === 'undefined') {
            query[key] = parseInt(chapter)*10000 + parseInt(that.start);
        } else if (desc && first && that.current_id === first.id) {
            query[key] = parseInt(chapter)*10000 + first.id;
        } else if (!desc && latest && that.current_id === latest.id) {
            query[key] = parseInt(chapter)*10000 + latest.id;
        } else {
            return new Promise(function (resolve) {resolve();});
        }

        that.ajax({
                url: that.url,
                data: query,
                dataType: 'json',
                success: function (result) {
                    result = result.filter(function (ref) {
                        var id = ref.id;

                        var a = objects.find(function (el) {
                            return id === el.id
                        });
                        return typeof a === 'undefined';
                    }).map(function (el, i) { return ({
                        id: el.id,
                        el: that.get_slide(el.body, el.id)

                        // el: $('<div/>').css(styles.el).append(el.body)
                        // el: $('<div/>').append(el.body)
                    }); });
                    preloadImages(that.objects.length > 0 ? result : result.slice(1));
                    that.end[desc ? 'desc' : 'asc'] = result.length === 0;
                    that.objects = desc ? result.reverse().concat(objects) : objects.concat(result);
                    that.first = that.objects.length > 0 ? that.objects[0].id : null;
                    that.start = desc && !that.start ? that.current_id : null;
                    callback();
                }
            }
        );
    };

    this.get_index = function (current_id) {
        if ( current_id === void 0 ) current_id=that.current_id;

        return that.objects.findIndex(function (el) {
            return current_id === el.id
        });
    };
    this.get_obj = function (desc, index) {
        if ( desc === void 0 ) desc=false;
        if ( index === void 0 ) index=null;

        index = index || this$1.get_index();

        var obj = that.objects[desc ? index - 1 : index + 1];
        if (obj) {
            obj.el.css('z-index', obj.id);
            that.current_id = obj.id;
        }
        return obj;
    };
    this.get_prev = function () {
        var prev = this$1.get_index() - 1;
        if (prev >= 0)
            { return that.get_obj(false, prev); }
        return null;
    };

    function testScroll(){
        // const forward = window.pageYOffset > that.ps;
        // const direction = forward ? 'forward' : 'reverse';
        that.ps = window.pageYOffset;

        for (var i = that.objects.length; i > 0; i--) {
            var obj = that.objects[i-1];
            var el = obj.el;
            var prev = obj.prev;
            // if first object - do nothing;
            if (!prev) { return; }

            var wh = $( window ).outerHeight();
            var h = prev.el.outerHeight();
            if (!prev.pin) { return; }

            if (window.pageYOffset >= prev.pin.pos - that.header_height) {
                if (that.triggered !== obj.el ) {
                    that.set_title(obj.el);
                    that.triggered = obj.el;
                }
            }
            else if (window.pageYOffset < prev.pin.pos - wh) {
                if (that.triggered !== prev.el) {
                    that.set_title(prev.el);
                    that.triggered = prev.el;
                }
            }

            if (!(window.pageYOffset < prev.pin.pos - wh || prev.pin.pos < window.pageYOffset)) {
                that.header.removeClass('header--intro');
                // shadow
                var top = el[0].getBoundingClientRect().top;
                var k = Math.abs(Math.round(top / Math.min(wh, h) * 100) / 100);
                $('>div', prev.el).css({
                    'opacity': Math.max(k, 0.1),
                    'position': 'fixed'
                });
                if (prev.el.hasClass("wrapper-result")) { return; }
                if (h > wh) { $('>div', prev.el).css({'bottom': 0}); }
                return;
            } else if (window.pageYOffset < prev.pin.pos - wh) {
                prev.el.css({top: "unset"});
                $('>div', prev.el).css({
                    'opacity': 1,
                    'position': 'relative',
                    'bottom': 'unset'
                });
            }
        }
    }
    $(window).on('scroll', testScroll);

    function setPin(obj, cb) {
        var wh = $( window ).outerHeight();
        var height = Math.max(
            obj.el.actual( 'outerHeight', { includeMargin : true } ),
            wh
        );
        AOS.refresh();
        var pos = cb(height, wh);
        obj.pin =  {
            trigger: null,
            pos: pos
        };
        if (!obj.is_result) { obj.el.css('height', height); }
        $('>div', obj.el).css('height', height);
    }

    this.clean = function (obj, els, index) {
        var current_scroll = $(document).scrollTop();
        var elh = els.actual('outerHeight');
        var offset = current_scroll-elh;

        // lock scroll
        obj.prev.el.css('top', offset);
        els.css('position', 'fixed');

        // remove DOM nodes first
        els.remove();

        // release scroll
        obj.prev.el.css({
            top: 'unset',
            position: 'relative'
        });

        // console.log(current_scroll, elh,  obj.prev.el.actual('outerHeight'), s)
        window.scrollTo(0, offset);

        // then remove em from array;
        that.objects = that.objects.slice(index);
    };

    this.render = function (obj) {
        if (!obj) {
            return;
        }
        var index = that.get_index(obj.id);
        obj.prev = that.objects[that.get_index(obj.id)-1];
        obj.flat = $('.b-question-block button', obj.el).length === 0;

        //remove previous elements if we scroll forward
        if (obj.prev && !obj.prev.flat) {
            var els = obj.prev.el.prevAll('.slide_wrapper');
            if (els.length > 0) {
                that.clean(obj, els, index);
            }
        }

        obj.el.appendTo(that);
        try {
            var pth = "" + (that.path) + (obj.is_result ? 'final' : obj.id);
            ga('send', 'pageview', pth);
            console.log(("GA send: " + pth));
        } catch (e) {
            console.log('missed GA');
        }

        if (!that.start && obj.id === 0 && that.skip_intro) {
            $('.l-intro', obj.el).hide();
	        $('.header').css({display:'flex'});
            that.body.css('overflow-y', 'unset');
        }

        if (!obj.flat && that.empty) {
            window.scrollTo(0,0);
            that.set_title(obj.el);
            that.empty = false;
        } else if (obj.result_slider) {
            $(window).scrollTo(obj.el, {
                duration: 800
            });
            setTimeout(function () {
                obj.el.prevAll('.slide_wrapper').remove();
            }, 850);

            // obj.el.css('height', '100vh');
            var storySlider = $('.story__slider', obj.el).bxSlider({
                infiniteLoop: false,
                speed: 300,
                hideControlOnEnd: false,
                pagerSelector: '.story__pager',
                stopAutoOnClick: true,
                preventDefaultSwipeY: true,
                oneToOneTouch: true,
                swipeThreshold: 100,
                onSliderLoad: function (currentIndex) {
                    $((".bx-pager-link[data-slide-index=\"" + currentIndex + "\"]")).closest('.bx-pager-item').addClass('active');
                    $((".bx-pager-link[data-slide-index=\"" + (currentIndex+1) + "\"]")).closest('.bx-pager-item').addClass('in-progress');
                    $('.bx-controls .bx-prev').addClass('disabled');
                },
                onSlidePrev: function ($slideElement, oldIndex, newIndex) {
                    $((".bx-pager-link[data-slide-index=\"" + oldIndex + "\"]")).closest('.bx-pager-item').removeClass('active');
                    $((".bx-pager-link[data-slide-index=\"" + newIndex + "\"]")).closest('.bx-pager-item').addClass('active');
                    if (newIndex === 0) { $('.bx-controls .bx-prev').addClass('disabled'); }
                    $('.bx-controls .bx-next').removeClass('js-next');
                },
                onSlideNext: function ($slideElement, oldIndex, newIndex) {
                    $((".bx-pager-link[data-slide-index=\"" + oldIndex + "\"]")).closest('.bx-pager-item').removeClass('active');
                    $((".bx-pager-link[data-slide-index=\"" + newIndex + "\"]")).closest('.bx-pager-item').addClass('active');
                    $('.bx-controls .bx-prev').removeClass('disabled');
                    if (newIndex === 3) { setTimeout(
                        function() {
                            $('.bx-controls .bx-next').addClass('js-next');
                        }, 400
                    ); }
                }
            });

            storySlider._startAutoSlide = setInterval(function () {
                if (storySlider.getCurrentSlide() === 3) {
                    storySlider._stopAutoSlide();
                    if (that.obj.el.next().length === 0) { that.trigger('next'); }
                } else {
                    $((".bx-pager-link[data-slide-index=\"" + ((storySlider.getCurrentSlide()+1)) + "\"]")).closest('.bx-pager-item').removeClass('in-progress');
                    $((".bx-pager-link[data-slide-index=\"" + ((storySlider.getCurrentSlide()+2)) + "\"]")).closest('.bx-pager-item').addClass('in-progress');
                    storySlider.goToNextSlide();
                }
            }, 1000);
            storySlider._stopAutoSlide = function () {
                clearInterval(storySlider._startAutoSlide);
                $('.bx-pager-item').each(function () {
                    $(this).removeClass('in-progress');
                });
                console.log('autoslide stopped');
            };

            that.body.on('click', '.bx-next.js-next', function () {
                if (obj.el.next().length === 0) { that.trigger('next'); }
                else { $(window).scrollTo(obj.el.next(), {duration: 800}); }
            });
            that.body.on('mousedown', '.bx-next, .bx-prev, .story__slider-item', function () {
                storySlider._stopAutoSlide();
            });
            that.body.on('touchstart', '.bx-wrapper', function () {
                storySlider._stopAutoSlide();
            });
        } else if (obj.is_result) {
            // show footer
            $(window).scrollTo(obj.el, {
                duration: 800
            });
            setTimeout(function () {
                obj.el.prevAll('.slide_wrapper').remove();
                $(window).scrollTop(0);
            }, 1000);
            that.nextAll('div').show();
        }

        // const rellaxElement = el.find('.rellax');
        // if (rellaxElement.length > 0) {
        //     new Rellax(`#wrapper-${obj.id} .rellax`);
        // }

        var answer = obj.el.find('.b-question-block__answers');
        if (answer.length > 0) {
            var block = answer.find('.b-question-block__result');
            $('.b-question-block__answer-block', answer).each(function() {
                var answerHeight = answer.actual( 'outerHeight', { includeMargin : true } );
                var ref = $('button', this).data();
                var ans = ref.ans;
                var descr = ref.descr;
                $('.js-answer', block).text(ans);
                $('.js-descr', block).text(descr);
                var answerResultHeight = block.actual( 'outerHeight', { includeMargin : true } );
                answer.css('height', Math.max(answerResultHeight, answerHeight));
            });
        }

        that.obj = obj;
        obj.el.imagesLoaded().then(function() {
            var promises = [];
            
            $('video', obj.el).each(function(video) {
                promises.push(new Promise(function (resolve, reject) {
                  checkVideoLoad(video, resolve);
                })); 
            });
            
            Promise.all(promises).then(function () {
                if (obj.flat && !obj.result_slider) {
                    setPin(obj, function (h, wh) { return obj.prev && obj.prev.pin ? h + obj.prev.pin.pos : h; });
                    $(that).trigger('next');
                } else { setPin(obj, function (h, wh) { return h; }); }
            });
            
        });

        that.set_progressbar(obj.id);
    };

    this.set_share = function(ref, template){
        var share_title = ref.share_title;
        var share_text = ref.share_text;
        var share = ref.share;

        var block = $('button.result__share-item', template || '#app');
        block.attr('data-link', window.location.href);
        block.attr('data-title', share_title);
        block.attr('data-desc', share_text);
        $('.result__share-icon--vk', block).parent().attr('data-img', (share + "_vk.png"));
        $('.result__share-icon--fb', block).parent().attr('data-img', (share + "_fb.png"));

        // $('meta[property="og:title"]').attr('content', title);
        // $('meta[property="og:description"]').attr('content', desc);
        // $('meta[property="og:image"]').attr('content', `${image}_fb.png`);
    };

    // set result to card
    this.set_result = function(template, data, id) {
        template.attr('id', ("wrapper-" + id));
        template.addClass("wrapper-result");
        $('>div', template).css({
            'top': 0,
            'height': '100vh'
        });

        $.each(data, function(i, ref) {
            var icon = ref.icon;
            var image = ref.image;
            var percent = ref.percent;
            var texts = ref.texts;

            var slide = $((".story__slider-item:eq(" + i + ")"), template);
            $('.story__video, .story__video-mobile', slide).attr('src', image);
            $('.story__emoji img', slide).attr('src', icon);
            $('.story__text', slide).text(texts.join('<br/>'));
            $('.story__caption span', slide).html((percent + "%&nbsp;"));
        });

        return template;
    };
    this.set_finish = function(template, ref, id) {
        var texts = ref.texts;
        var image = ref.image;
        var video = ref.video;

        if (texts.length > 1) {
            var title = texts[0];
            var desc = texts.slice(1).join('<br/>');
            $('.result__image-title', template).text(title);
            $('.result__text p', template).html(desc);


        } else if (texts.length > 0) {
            $('.result__text p', template).html(texts[0]);
        }

        // if (data.percent) $('.result__caption span', template).html(`&nbsp;${data.percent}%&nbsp;`)
        // else $('.result__caption', template).hide();
        $('.result__image-container > img', template).first().attr('src', image);
        $('.result__image-container > video', template).first().attr('src', video);
        var ava = $('.header__avatar-user', that.header).first().attr('src');
        if (ava) { $('.result__avatar', template).attr('src', ava); }
        var score = $('.result__score', template);
        var result = {
            'health': parseInt($('.header__score-blue', that.header).text()),
            'influence': parseInt($('.header__score-red', that.header).text())
        };

        var health = $('.result__score-health', score);
        $('.result__score-num', health).text(result.health);
        $('img', health).attr('src', ("/images/episodes/0/final/result_" + (result.health>0?'plus':'minus') + ".svg"));

        var influence = $('.result__score-influence', score);
        $('.result__score-num', influence).text(result.influence);
        $('img', influence).attr('src', ("/images/episodes/0/final/result_" + (result.influence>0?'plus':'minus') + ".svg"));


        template.attr('id', ("wrapper-" + id));
        template.addClass("wrapper-result");
        $('>div', template).css('top', 0);

        return template;
    };

    this.scroll_further = function (desc) {
        if ( desc === void 0 ) desc=false;

        var obj = that.get_obj(desc);
        if (typeof obj === 'undefined' && !that.finished) {
            var callback = function () {
                obj = that.get_obj(desc);

                if (typeof obj === 'undefined') {
                    that.finished = true;
                    that.ajax({
                        url: '/api/progress/result',
                        data: {chapter: chapter},
                        dataType: 'json',
                        success: function success(r) {
                            var shortcuts = r.shortcuts;
                            var result = r.result;
                            var template = r.template;
                            var template_shortcuts = r.template_shortcuts;
                            var tmpl_f = that.get_slide(template, null);
                            var tmpl_r = that.get_slide(template_shortcuts, null);
                            var incement = that.objects.length > 0 ? that.objects[that.objects.length-1].id + 1 : 99;
                            if (shortcuts) { that.objects.push({
                                id: incement,
                                el: that.set_result(tmpl_r, shortcuts, incement),
                                result_slider: true
                            }); }
                            that.objects.push({
                                id: incement + 1,
                                el: that.set_finish(tmpl_f, result, incement + 1),
                                is_result: true
                            });
                            // render result
                            that.render(that.get_obj(desc));
                            // hide header
                            that.header.addClass('header__result');
                            // setup shares
                            that.set_share(result);
                        }
                    });
                } else { that.render(obj); }
            };
            that.fetch(callback, desc);
        } else { that.render(obj); }
    };

    $(this).on('next', function () {that.scroll_further();});
    //.trigger('next')

 //   processing answers

    $(this).on('click', '.b-question-block button', function() {
        var el = $(this);
        var block = el.closest('.b-question-block');
        var wrapper = el.parents('.slide_wrapper').first();
        var card = $('>div>div', wrapper);

	    var whichAnswer = el.closest('.b-question-block__answer-block');
        var power_block = $('.js-power', block);
        var health_block = $('.js-health', block);
        var ref = el.data();
        var ans = ref.ans;
        var descr = ref.descr;
        var answer = el.parents('.b-question-block').first().find('button').first().is(el) ? 0 : 1;
        var end = $('.ep-end', card);

        that.ajax({
            url: "/api/progress/add_answer",
            method: 'post',
            data: {
                'chapter': chapter,
                'answer': answer,
                'question': el.parents('.slide_wrapper').first().attr('data-id'),
            },
            dataType: 'json',
            success: function (r) {
                var power = r.power;
                var health = r.health;
                that.addScore(health, power);

                $('.js-answer', block).text(ans);
                $('.js-descr', block).text(descr);
	            if (health > 0) {
		            health_block.addClass('b-stat_health');
		            health_block.addClass('b-stat_plus').text('+10');
	            } else if (health < 0) {
		            health_block.addClass('b-stat_health');
		            health_block.addClass('b-stat_minus').text('-10');
	            }

	            if(power > 0) {
		            power_block.addClass('b-stat_power');
		            power_block.addClass('b-stat_plus').text('+10');
	            } else if(power < 0) {
		            power_block.addClass('b-stat_power');
		            power_block.addClass('b-stat_minus').text('-10');
	            }
                block.toggleClass(isActive);
	            whichAnswer.addClass('js-button-active');
                if (end.length > 0) {
                    card.addClass('b-card_21--complete page--complete');
                } else
                    { that.trigger('next'); }
            }
        });
    });

    $(this).on('click', '.l-intro a.intro__button', function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/progress/add_answer",
            method: 'post',
            data: {
                'chapter': chapter
            },
            dataType: 'json',
            async: true
        });
    });

    $(this).on('click', '.ep-end button:not(.js-finished)', function(e) {
        e.preventDefault();
        $(this).addClass('js-finished');
        that.trigger('next');
    });

    $(this).on('click', 'a.result__restart', function(e) {
        e.preventDefault();
        $('.profile .profile__btn-list .profile__sure-btn--yes', that.header).trigger('click');
    });

};


window.addEventListener('load', function () {
  var videoFrames = document.querySelectorAll('video');

  Array.prototype.map.call(videoFrames, function (video) {
    if (video && video.paused) {
      video.play();
    }
  });
});
