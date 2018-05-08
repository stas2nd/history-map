'use strict';

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.mobile() || false;
if (isMobile === 'iPad') {
  isMobile = false;
}

//эта хрень работает неправильно
//она в неверном порядке проставлет @media с рассчитанными px
//и перекрывает стили, вообще он берет не из того медиа данные
// if (isMobile) {
//     window.viewportUnitsBuggyfill.init({force: true});
// }


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

// $(window).on('scroll', $.throttle(10, function() {
//     if ($(document).scrollTop() > currentPos) {
//       $('.header').addClass('js-toggle-header');
//     } else {
//       $('.header').removeClass('js-toggle-header');
//     }
//     currentPos = $(document).scrollTop();
//   })).trigger('scroll');

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