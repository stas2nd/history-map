'use strict';

var isActive = 'is-active';

var sideBar = {
  'gorky': {
    title: 'Максим Горький. Список Горького',
    descr: 'Писатель, издатель и очень богатый человек, спонсировавший революционеров',
    text: 'Между властью и интеллигенцией — чем в это время занимается писатель и издатель? Проживите это время вместе с ним',
    img: '/images/episodes/0/sidebar/sidebar-gorky.jpg',
    href: '#'
  },
  'dybenko': {
    title: 'Павел Дыбенко',
    descr: 'Матрос, депутат Учредительного собрания, гражданский муж Коллонтай',
    text: 'Дыбенко — гражданский муж Александры Коллонтай. Узнайте, как двое революционеров переживают Гражданскую войну',
    img: '/images/episodes/0/sidebar/sidebar-dybenko.jpg',
    href: '#'
  },
  'kollontai': {
    title: 'Александра Коллонтай',
    descr: 'Соратница Ленина, революционерка, уверена, после революции настанет новая жизнь',
    text: 'О чем в это время беспокоится убежденная революционерка Коллонтай? Принимайте решения вместе с ней, чтобы выжить в хаосе Гражданской войны',
    img: '/images/episodes/0/sidebar/sidebar-dybenko.jpg',
    href: '#'
  },
  'panina': {
    title: 'Графиня Панина. Демократия или смерть',
    descr: 'Графиня, одна из первых феминисток в России, член ЦК партии кадетов, заместитель министра государственного призрения Временного правительства',
    text: 'Чем в это время занята сама Панина, графиня-феминистка и замминистра призрения Временного правительства? Проживите Гражданскую войну вместе с ней',
    img: '/images/episodes/0/sidebar/sidebar-panina.jpg',
    href: '#'
  },
  'boldyrev': {
    title: 'Василий Болдырев. Против диктатуры',
    descr: 'Царский генерал, лишившийся страны, которой он служил',
    text: 'Как живет и о чем беспокоится царский генерал, лишившийся страны, которой он служил? Посмотрите на Гражданскую войну его глазами',
    img: '/images/episodes/0/sidebar/sidebar-panina.jpg',
    href: '#'
  }
};

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

function toggleNav(trigger, element) {
  // eslint-disable-line
  elementClassListToggle(trigger);
  toggleIsActive(element);
};

function toggleSidebar(trigger, element) {
  elementClassListToggle(trigger);
  toggleIsActive(element);
  if (trigger.classList.contains('header__menu')) {
    var body = document.querySelector('body');
    body.style.overflow = 'hidden';
  }
  if (trigger.classList.contains('b-header-overlay__close')) {
    var body = document.querySelector('body');
    body.style.overflow = 'auto';
  }
};

function toggleModal(element, hero) {
  // eslint-disable-line
  toggleIsActive(element);
  if (hero) {
    document.querySelector('.js-hero-title').innerText = sideBar[hero].title;
    document.querySelector('.js-hero-descr').innerText = sideBar[hero].descr;
    document.querySelector('.js-hero-text').innerText = sideBar[hero].text;
    document.querySelector('.js-hero-container').setAttribute('style', 'background-image: url(' + sideBar[hero].img + ')');
  }
};

var statResult = { health: [], power: [] };

function toggleQuestion(element) {
  var _element$dataset = element.dataset,
      ans = _element$dataset.ans,
      descr = _element$dataset.descr,
      health = _element$dataset.health,
      power = _element$dataset.power;

  var block = element.closest('.b-question-block');
  var whichAnswer = element.closest('.b-question-block__answer-block');
  var scrolIcon = block.querySelector('.b-question-block__scroll');
  var card = block.closest('.b-card');

  statResult.health.push(health);
  statResult.power.push(power);

  if (health === '-1' || health === '-10') {
    var _health = block.querySelector('.js-health');
    _health.classList.add('b-stat_health', 'b-stat_minus');
    _health.innerText = '-10';
  } else if (health === '1' || health === '10') {
    var _health2 = block.querySelector('.js-health');
    _health2.classList.add('b-stat_health', 'b-stat_plus');
    _health2.innerText = '+10';
  }

  if (power === '-1' || power === '-10') {
    var _power = block.querySelector('.js-power');
    _power.classList.add('b-stat_power', 'b-stat_minus');
    _power.innerText = '-10';
  } else if (power === '1' || power === '10') {
    var _power2 = block.querySelector('.js-power');
    _power2.classList.add('b-stat_power', 'b-stat_plus');
    _power2.innerText = '+10';
  }

  block.querySelector('.js-answer').innerText = ans;
  block.querySelector('.js-descr').innerText = descr;

  block.classList.toggle(isActive);
  whichAnswer.classList.add('js-button-active');

  if (card.classList.contains('b-card_21')) {
    card.classList.add('b-card_21--complete');
  }

  if ($('.header__score-red').html() !== '&nbsp;') {
    $('.header__score-red').show();
  }
  if ($('.header__score-blue').html() !== '&nbsp;') {
    $('.header__score-blue').show();
  }
};

function playVideo(element) {
  var frame = element.closest('.b-frame');
  var video = frame.querySelector('video');
  // frame.classList.toggle(isActive);
  video.onpause = function () {
    frame.classList.remove(isActive);
  };
  if (video.paused) {
    video.play();
    frame.classList.add(isActive);
  } else {
    video.pause();
    frame.classList.remove(isActive);
  }
};

window.addEventListener('load', function () {
  var videoFrames = document.querySelectorAll('video');

  Array.prototype.map.call(videoFrames, function (video) {
    if (video && video.paused) {
      video.play();
    }
  });
});

window.addEventListener('load', function () {
  var video = document.querySelector('.js-video-3-2');
  if (video) {
    window.addEventListener('scroll', function () {
      if (!video.classList.contains('is-active')) {
        elementToggle(video);
      }
    });
  }
});

function toggleHeader() {
  var header = document.querySelector('.js-header');
  var start = document.querySelector('.js-start');

  if (window.pageYOffset > start.offsetHeight) {
    if (!header.classList.contains(isActive)) {
      header.classList.toggle(isActive);
    }
  } else if (header.classList.contains(isActive)) {
    header.classList.toggle(isActive);
  }
};

function toggleAnswerVideo(element) {
  var video = element.closest('.b-question-block__answer-wrapper').querySelector('.b-frame');
  elementToggle(video);
};

function toggleFinal(element) {
  var final = document.querySelector('.js-final');
  var header = document.querySelector('.js-header');
  if (final) {
    elementToggle(final);
  }
  if (header) {
    elementToggle(header);
  }
  var text = document.querySelector('.js-final-text');
  if (text) {
    text.innerText = 'В первом советском правительстве вы прославились попыткой помочь самым незащищенным слоям населения.';
  }
  var end = document.querySelector('.js-final-end');
  if (end) {
    end.innerText = 'всего 27% игроков смогли на это решиться';
  }
};

window.utils.animateContent();
// window.utils.animateProfile();


$('.js-subscribe').click(function (e) {
  e.preventDefault();
  $('.l-popup-subscribe').addClass('is-active');
});

$('.popup-subscribe__close').click(function () {
  $('.l-popup-subscribe').removeClass('is-active');
});

var introBlock = document.querySelector('.l-intro');
if (introBlock) {
  var playIntroButton = introBlock.querySelector('.intro__button');
  playIntroButton.addEventListener('click', function () {
    introBlock.style.display = 'none';
  });
};

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