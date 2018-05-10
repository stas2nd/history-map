'use strict';

(function () {
    var toggleHeaderOnScroll = function toggleHeaderOnScroll() {
        var header = document.querySelector('.header');
        var trailer = document.querySelector('.trailer');
        var trailerTopPos = trailer.offsetTop;
        document.addEventListener('scroll', function () {
            if (pageYOffset >= trailerTopPos) {
                header.classList.remove('is-hidden');
            } else {
                header.classList.add('is-hidden');
            }
        });
    };
    var toggleMobileHeaderOnscroll = function toggleMobileHeaderOnscroll() {
        var currentPos = 0;
        $(window).on('scroll', $.throttle(10, function () {
            if ($(document).scrollTop() > currentPos) {
                $('.header').addClass('js-toggle-header');
            } else {
                $('.header').removeClass('js-toggle-header');
            }
            currentPos = $(document).scrollTop();
        })).trigger('scroll');
    };
    
    var showMobileBlockOnScroll = function showMobileBlockOnScroll() {
        var windowBottomPos = window.scrollY + window.outerHeight;
        var loader = document.querySelector('.loader-mobile');
        var loaderTopPos = loader.parentNode.offsetTop;
        var $mobileSection = $('c');
        if (windowBottomPos >= loaderTopPos) {
            setTimeout(function () {
                $mobileSection.fadeIn();
                $mobileSection.removeClass('is-hidden');
                loader.classList.add('is-hidden');
            }, 1500);
        }
    };

    toggleHeaderOnScroll();
    toggleMobileHeaderOnscroll();
    AOS.init();

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

    /* Analytics Events */
    $('body').on('click', '.social-button_type_fb', function (e) {
        ga('send', 'event', 'Share', 'Main to Facebook', 'Frontpage');
        console.log('шара фб на главной');
    });
    $('body').on('click', '.social-button_type_vk', function (e) {
        ga('send', 'event', 'Share', 'Main to VK', 'Frontpage');
        console.log('шара вк на главной');
    });
    $('body').on('click', '.social-button_type_tg', function (e) {
        ga('send', 'event', 'Share', 'Main to Telegram', 'Frontpage');
        console.log('шара тг на главной');
    });
    $('body').on('click', '.video__play', function (e) {
        ga('send', 'event', 'Video', 'Play', 'S1 Trailer');
        console.log('трейлер сезона на главной');
    });
})();