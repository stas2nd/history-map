'use strict';

var statResult = {
	health: [],
	power: []
};

function toggleQuestion(element) {
	var _element$dataset = element.dataset,
	    ans = _element$dataset.ans,
	    descr = _element$dataset.descr,
	    health = _element$dataset.health,
	    power = _element$dataset.power;

	var block = element.closest('.b-question-block');
	var whichAnswer = element.closest('.b-question-block__answer-block');
	var page = block.closest('.page');

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

	block.classList.toggle(window.utils.isActiveClass);
	whichAnswer.classList.add('js-button-active');

	if (page.classList.contains('page-last')) {
		page.classList.add('page--complete');
	}

	if ($('.header__score-red').html() !== '&nbsp;') {
		$('.header__score-red').show();
	}
	if ($('.header__score-blue').html() !== '&nbsp;') {
		$('.header__score-blue').show();
	}
};