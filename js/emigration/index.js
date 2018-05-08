'use strict';

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.mobile() || false;
if (isMobile === 'iPad') {
    isMobile = false;
}

if (isMobile) {
    window.viewportUnitsBuggyfill.init({
        force: true
    });
}

$(function () {

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
                    $('.scene__counter').text(current.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."));
                    animate(prev, next, step, current);
                });
            }
        };

        var run = function run() {
            $('body').addClass('animated');
            $('body').removeClass('intro-opened');
            setTimeout(function () {
                $('.scene__counter').fadeIn(500);
                setCounter(868000, 400);
                $('.scene').addClass('scene_show_sources');
            }, 1000);
            // }, 10);
            setTimeout(function () {
                $('.scene').addClass('scene_done_yes');
            }, 3000);
            // }, 30);
            setTimeout(function () {
                $('body').addClass('body-fix-footer');
                $('.scene').addClass('scene_ready_to_scroll');
                $('.second_map').show();
                swiper && swiper.update();
                swiper && swiper.navigation.update();
                $('.storie-tab').eq(0).trigger('click');
                setTimeout(function () {
                    storiesFirstSeen = true;
                }, 100);
            }, 6000);
            // }, 60);
        };

        var numbersReposition = function numbersReposition() {
            var svgPinDomElem;
            var svgPinBBox;
            for (var i = 1; i <= 8; i++) {
                svgPinDomElem = $('.scene__map svg #dot_' + i).eq(0)[0];
                svgPinBBox = svgPinDomElem && SVG.adopt(svgPinDomElem).rbox();
                svgPinBBox && $('.scene__number_num_' + i).css({
                    left: svgPinBBox.x,
                    top: svgPinBBox.y - $('.scene__map svg').offset().top
                });
            }
            for (i = 1; i <= 3; i++) {
                svgPinDomElem = $('.scene__map svg #cardDot_' + i).eq(0)[0];
                svgPinBBox = svgPinDomElem && SVG.adopt(svgPinDomElem).rbox();
                svgPinBBox && $('.card_num_' + i).css({
                    left: svgPinBBox.x,
                    top: svgPinBBox.y - $('.scene__map svg').offset().top
                });
            }
        };

        var findWhoIsVisible = function findWhoIsVisible() {
            var last;

            if (storiesFirstSeen && $('.scene').hasClass('scene_ready_to_scroll') && $('.stories').offset().top > $(document).scrollTop() - 400) {
                $('html, body').animate({
                    scrollTop: $('.stories').offset().top - 80
                });
                storiesFirstSeen = false;
            }

            $('.stories__sections .storie-section_visible_yes .story').each(function (index, el) {
                if ($(el).position().top + $(el).outerHeight() / 2 <= $('.stories__sections').outerHeight()) {
                    /*
                    // когда нужно чтобы пины не пропадали
                    if (index > maxIndex) {
                        maxIndex = index;
                        last = $(el).data('pin');
                        newCx = undefined;
                        newCy = undefined;
                    }
                    if ($(el).data('multiply') === 'yes') {
                        $('.map svg .track_visible_yes > g').show();
                    } else {
                        $('.map svg .track_visible_yes g#pin-'+$(el).data('pin')).show();
                    }
                    */
                    if (index > maxIndex) {
                        maxIndex = index;
                        last = $(el).data('pin');
                        newCx = undefined;
                        newCy = undefined;
                        if ($(el).data('multiply') === 'yes') {
                            $('.map svg .track_visible_yes > g').show();
                        } else {
                            $('.map svg .track_visible_yes g[id!=pin-' + $(el).data('pin') + ']').hide();
                            $('.map svg .track_visible_yes g#pin-' + $(el).data('pin')).show();
                        }
                    }
                }
            });

            if (last) {
                var lastStoryPin = draw.select('.track_visible_yes #pin-' + last).first().select('tspan').first();
                var coords = lastStoryPin.rbox();
                if (parseInt(coords.x) !== newCx && parseInt(coords.y) - 72 !== newCy) {
                    $('.avatar').stop();
                    newCx = parseInt(coords.x);
                    newCy = parseInt(coords.y) - 72;
                }
                $('.avatar').animate({
                    left: newCx,
                    top: newCy
                }, 500, function () {
                    $('.avatar').stop().animate({
                        opacity: 1
                    }, 300);
                });
            }
        };

        var currentCount = 0;
        var counterTimer;
        var storiesFirstSeen = false;

        $('body').on('click', '.auto-play', run);
        $(window).on('resize', $.debounce(500, numbersReposition)).trigger('resize');

        var swiper = new Swiper('.stories-swiper', {
            slidesPerView: 'auto',
            freeMode: true,
            freeModeSticky: true,
            spaceBetween: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });

        var draw = SVG.get('pins-map');
        var image;
        var maxIndex = -1;
        var firstMove = true;
        var newCx;
        var newCy;
        var trX = 0;
        var trY = 0;
        var trXFix = 0;

        $('.scene__sources').on('mouseover', function () {
            $('.scene__source').addClass('scene__source_visible_yes');
        });
        $('.scene__sources').on('mouseout', function () {
            $('.scene__source').removeClass('scene__source_visible_yes');
        });

        $('.storie-tab').on('click', function () {
            $('.avatar').stop().css('opacity', 0);
            maxIndex = -1;
            firstMove = true;
            var index = $(this).index();
            swiper && swiper.slideTo(index);
            $('.storie-tab_active_yes').removeClass('storie-tab_active_yes');
            $(this).addClass('storie-tab_active_yes');

            var track = $('#' + $(this).data('id'));
            var storySection = $('.storie-section_id_' + $(this).data('id'));
            var imgUrl = $(this).find('.storie-tab__image').css('background-image');
            imgUrl && $('.avatar').css('background-image', imgUrl);

            trX = storySection.data('translate-x') || 0;
            trY = storySection.data('translate-y') || 0;
            $('.track_visible_yes').removeClass('track_visible_yes');
            $('.map svg').css({
                transform: 'none'
            });
            if (track && storySection) {
                track.addClass('track_visible_yes').find('g[id^="pin"]').hide();
                $('.storie-section_visible_yes').removeClass('storie-section_visible_yes');
                storySection.addClass('storie-section_visible_yes');
                $('.map svg').css({
                    transform: 'translate(' + trX + ', ' + trY + ')'
                });
                $('.stories__sections').animate({
                    scrollTop: 0
                }, 100, function () {
                    findWhoIsVisible();
                });
            }
        });

        $('.stories__sections').on('scroll', $.throttle(10, findWhoIsVisible));
        $(window).on('resize', $.debounce(500, function () {
            $('.storie-tab_active_yes').trigger('click');
        }));

        // $('.auto-play').trigger('click');
        // setTimeout(() => {
        //     $('html, body').animate({scrollTop: 800});
        // }, 0);
    } else {
        // !isMobile
        $('body').removeClass('first-screen');
        $('body').removeClass('intro-opened');
        var mySwiper = new Swiper('.mobile-swiper', {
            pagination: {
                el: '.mobile-swiper-pagination',
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
            if (mySwiper.activeIndex === 5) {
                $('.storie-tab').eq(0).trigger('click');
                $('body').addClass('slider-done');
                swiperPersons && swiperPersons.update();
                swiperPersonsSecond && swiperPersonsSecond.update();
            } else {
                $('body').removeClass('slider-done');
            }
        });
        // mySwiper.slideTo(4, 0, true);

        $('.swiper-slide').on('click', function () {
            mySwiper && mySwiper.slideNext();
        });

        $('.storie-tab').on('click', function () {
            $('.avatar').stop().css('opacity', 0);
            maxIndex = -1;
            firstMove = true;
            var index = $(this).index();
            swiperPersons && swiperPersons.slideTo(index);
            swiperPersonsSecond && swiperPersonsSecond.slideTo(index);
            $('.storie-tab_active_yes').removeClass('storie-tab_active_yes');
            $('.storie-tab[data-id=' + $(this).data('id') + ']').addClass('storie-tab_active_yes');

            var track = $('#' + $(this).data('id'));
            var storySection = $('.storie-section_id_' + $(this).data('id'));
            $('.storie-section_visible_yes').removeClass('storie-section_visible_yes');
            storySection && storySection.addClass('storie-section_visible_yes');
            $('html, body').animate({
                scrollTop: $('.stories__tabs').eq(0).offset().top - 60
            });

            /*
            var imgUrl = $(this).find('.storie-tab__image').css('background-image');
            imgUrl && $('.avatar').css('background-image', imgUrl);
              trX = storySection.data('translate-x') || 0;
            trY = storySection.data('translate-y') || 0;
            $('.track_visible_yes').removeClass('track_visible_yes');
            $('.map svg').css({ transform: 'none' });
            if (track && storySection) {
                track.addClass('track_visible_yes').find('g[id^="pin"]').show();
                  // $('.map svg').css({ transform: 'translate('+trX+', '+trY+')' });
                // $('.stories__sections').animate({scrollTop: 0}, 100, function() {findWhoIsVisible();});
            }
            */
        });

        var swiperPersons = new Swiper('.stories-swiper', {
            slidesPerView: 'auto',
            freeMode: true,
            spaceBetween: 0,
            freeModeSticky: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
        var swiperPersonsSecond = new Swiper('.stories-swiper-second', {
            slidesPerView: 'auto',
            freeMode: true,
            spaceBetween: 0,
            freeModeSticky: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
        swiperPersonsSecond.on('slideChange', function () {
            swiperPersons && swiperPersons.slideTo(swiperPersonsSecond.activeIndex);
        });
        swiperPersons.on('slideChange', function () {
            swiperPersonsSecond && swiperPersonsSecond.slideTo(swiperPersons.activeIndex);
        });
    }
});

$('.js-subscribe').click(function (e) {
    e.preventDefault();
    $('.l-popup-subscribe').addClass('is-active');
});

$('.popup-subscribe__close').click(function () {
    $('.l-popup-subscribe').removeClass('is-active');
});

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

/* показываем или скрываем заголовок/шаринги при скролле */
var currentPos = 0;

$(window).on('scroll', $.throttle(10, function () {
    if ($(document).scrollTop() > currentPos) {
        $('.header').addClass('js-toggle-header');
    } else {
        $('.header').removeClass('js-toggle-header');
    }
    currentPos = $(document).scrollTop();
})).trigger('scroll');

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