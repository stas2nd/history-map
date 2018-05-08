'use strict';

$('.js-subscribe').click(function (e) {
    e.preventDefault();
    $('.l-popup-subscribe').addClass('is-active');
});

$('.popup-subscribe__close').click(function () {
    $('.l-popup-subscribe').removeClass('is-active');
});