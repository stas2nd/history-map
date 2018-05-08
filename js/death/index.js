'use strict';

var currentCount = 0;
var counterTimer;
var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.mobile() || false;

if (!isMobile) {
    var setCounter = function setCounter(newCount, duration) {
        if (typeof newCount !== 'number') return;
        if (!duration) duration = 100;
        var step = Math.ceil((currentCount - newCount) / duration);
        if (step < 0) step = step * -1;
        var prevCount = currentCount;
        currentCount = newCount;
        if (counterTimer) {
            clearTimeout(counterTimer);
        }
        animate(prevCount, currentCount, step, prevCount);
    };

    var animate = function animate(prev, next, step, current) {
        if (current !== next) {
            counterTimer = setTimeout(function () {
                if (next < prev) {
                    current = current - step;
                    if (current < next) current = next;
                } else {
                    current = current + step;
                    if (current > next) current = next;
                }
                $('.phantom-header__count').text(current.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1_"));
                animate(prev, next, step, current);
            });
        }
    };

    var setNavPoint = function setNavPoint(index) {
        $('.navigation__dot_active_yes').removeClass('navigation__dot_active_yes');
        $('.navigation__dot_num_' + index).addClass('navigation__dot_active_yes');
    };

    $('body').removeClass('slider-first-slide');

    $(document).ready(function () {

        var storiesHeight = $('.stories__collection').outerHeight();
        var screenHeight = $(window).outerHeight();
        var storiesMaxTranslate = (storiesHeight - screenHeight) * -1;
        var map = $('.map');
        var storiesFirstSeen = true;
        $(window).on('resize', function () {
            $('.pin_visible_yes').removeClass('pin_visible_yes');
            $('.stories__scroller').trigger('scroll');
        });
        $('.box .stories__scroller').on('scroll', function (event, data) {
            if (!(data && data.phantom)) {
                if (storiesFirstSeen && $('.stories').offset().top > $(document).scrollTop() - 200) {
                    $('html, body').animate({ scrollTop: $('.stories').offset().top });
                    storiesFirstSeen = false;
                }
            }

            var scrollTop = $('.stories__scroller').scrollTop();
            $('.story-arrow').css('top', (scrollTop / storiesMaxTranslate * -100).toFixed(2) + '%');
            var viewportTop = scrollTop - 300;
            var viewportBottom = scrollTop + $(window).outerHeight() + 100;

            var mapOH = $('.map').outerHeight();
            var mapOW = $('.map').outerWidth();
            var hCorrection = mapOW * 0.1;
            var vCorrection = mapOH * 0.15;
            var resizeCoefficient = map.find('svg').outerWidth() / 1610;

            $('.box .story').each(function (index, el) {
                var storyTop = $(el).position().top;
                var storyBottom = $(el).position().top + $(el).outerHeight();
                var $pin = $('.pin-' + $(el).data('pin')).eq(0);
                var svgPinDomElem = $('.map svg #' + $pin.data('svgpin')).eq(0)[0];
                if (storyTop >= viewportTop && storyBottom <= viewportBottom) {
                    var svgPinBBox = svgPinDomElem && svgPinDomElem.getBBox();

                    if (svgPinBBox) {
                        var newLeft = svgPinBBox.x * resizeCoefficient - hCorrection;
                        var newTop = svgPinBBox.y * resizeCoefficient - 18 - vCorrection;
                        $pin.css({ left: newLeft, top: newTop });
                    }

                    if (!$pin.hasClass('pin_visible_yes')) {
                        $pin.addClass('pin_visible_yes');
                    }
                } else {
                    $pin.removeClass('pin_visible_yes');
                }
            });
        }).trigger('scroll', { phantom: true });

        var s = skrollr.init({
            smoothScrolling: false,
            forceHeight: false,
            render: function render(data) {

                var currentTop = data.curTop;

                if (currentTop < 280) {
                    $('body').addClass('first-screen');
                } else {
                    $('body').removeClass('first-screen');
                }

                if (currentTop < 280) {
                    setNavPoint(1);
                }
                if (currentTop >= 280 && currentTop < 3000) {
                    setNavPoint(2);
                }
                if (currentTop >= 3000 && currentTop < 7250) {
                    setNavPoint(3);
                }
                if (currentTop >= 7250 && currentTop < 10000) {
                    setNavPoint(4);
                }
                if (currentTop >= 10000 && currentTop < 16000) {
                    setNavPoint(5);
                }
                if (currentTop >= 16000) {
                    setNavPoint(6);
                }
                if (currentTop < 1500 && currentCount !== 0) {
                    setCounter(0);
                }
                if (currentTop >= 1500 && currentTop < 2000 && currentCount !== 2500000) {
                    setCounter(2500000, 150);
                }
                if (currentTop >= 1500 && currentTop < 5250 && currentCount !== 2500000) {
                    setCounter(2500000);
                }
                if (currentTop >= 5250 && currentTop < 5750 && currentCount !== 4500000) {
                    setCounter(4500000);
                }
                if (currentTop >= 5750 && currentTop < 8750 && currentCount !== 4500000) {
                    setCounter(4500000);
                }
                if (currentTop >= 8750 && currentCount !== 13500000) {
                    setCounter(13500000);
                }

                if (currentTop > 11000) {
                    $('.header').css('z-index', '911');
                    $('.header').removeClass('header-death');
                } else if (currentTop > 10000 && currentTop <= 11000) {
                    $('.header').css('z-index', '909');
                    $('.header').addClass('header-death');
                }
            }
        });
    });
} else {
    window.viewportUnitsBuggyfill.init({ force: true });
    $('body').removeClass('first-screen');
    $(document).ready(function () {
        var mySwiper = new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });

        mySwiper.on('slideChange', function () {
            if (mySwiper.activeIndex === 0) {
                $('body').addClass('slider-first-slide').removeClass('slider-not-first-slide');
            } else {
                $('body').removeClass('slider-first-slide').addClass('slider-not-first-slide');;
            }
            if (mySwiper.activeIndex === 7) {
                $('body').addClass('slider-done');
            } else {
                $('body').removeClass('slider-done');
            }
        });
        // mySwiper.slideTo(25, 0, true);

        $('.swiper-slide').on('click', function () {
            mySwiper && mySwiper.slideNext();
        });
    });
}

var isActive = 'is-active';

var escapeCheck = function escapeCheck(element, cb) {
    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 && (element.classList.contains(isActive) || cb)) {
            element.classList.remove(isActive);
            if (cb) cb();
        }
    });
};

function elementToggle(element) {
    var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isActive;

    element.classList.toggle(className);
}

var elementClassListToggle = function elementClassListToggle(element) {
    elementToggle(element);
    escapeCheck(element);
};

var toggleIsActive = function toggleIsActive(element) {
    var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isActive;

    document.querySelector(element).classList.toggle(className);
    escapeCheck(document.querySelector(element));
};

function toggleSidebar(trigger, element) {
    elementClassListToggle(trigger);
    toggleIsActive(element);
};

$('.js-subscribe').click(function (e) {
    e.preventDefault();
    $('.l-popup-subscribe').addClass('is-active');
});

$('.popup-subscribe__close').click(function () {
    $('.l-popup-subscribe').removeClass('is-active');
});

$('.header .social-likes__widget_facebook').click(function () {
    ga('send', 'event', 'Share', 'IG to Facebook', window.location.pathname);
    console.log('Шеринг инфографики ' + window.location.pathname + ' в ФБ');
});
$('.header .social-likes__widget_vkontakte').click(function () {
    ga('send', 'event', 'Share', 'IG to VK', window.location.pathname);
    console.log('Шеринг инфографики ' + window.location.pathname + ' в ВК');
});
$('.header .social-likes__widget_telegram').click(function () {
    ga('send', 'event', 'Share', 'IG to Telegram', window.location.pathname);
    console.log('Шеринг инфографики ' + window.location.pathname + ' в ТГ');
});
$('.js-subscribe').click(function () {
    ga('send', 'event', 'Subscribe', 'Subscription Start', window.location.pathname);
    console.log('Вызов формы подписки в инфографике');
});