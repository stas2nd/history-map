'use strict';

window.viewportUnitsBuggyfill.init({
    force: true
});

var NEXT_STEP_TIMEOUT = 2000;
var START_CARD_TIMEOUT = 750;
var NEXT_CARD_TIMEOUT = 4000;

var debug = location.host.indexOf('localhost') !== -1;

var panZoomTiger;
var cardWidth = 220;
var cardGap = 20;
var cardFW = cardWidth + cardGap;

var autoPlay = true;
var currentCardIndex = 0;
var currentPinsZoom = 1;

var currentStateIndex;

var nextStateTimeout;
var nextCardTimeout;

var firstRun = true;

var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() || false;

var cards = {
    1: [{
        title: '14 сентября 1917',
        city: 'Петроград',
        text: 'Временное правительство провозглашает Российскую республику.',
        selector: 'pin-01-02',
        icon: '02'
    }, {
        title: '7-8 ноября 1917',
        city: 'Петроград',
        text: 'Октябрьская революция. Всероссийский съезд Советов провозглашает Российскую Советскую Республику.',
        selector: 'pin-01-02',
        icon: '03'
    }],
    2: [{
        title: '15 ноября 1917',
        city: 'Москва',
        text: 'Большевики захватывают Москву.',
        selector: 'pin-02-01',
        icon: '04'
    }],
    3: [{
        title: '15 декабря 1917',
        city: 'Брест-Литовск',
        text: 'Советская делегация заключает перемирие с Германией и ее союзниками',
        selector: 'pin-03-05',
        icon: '05'
    }, {
        title: '7 января 1918',
        city: 'Новочеркасск',
        text: 'На Дону возникает антибольшевистская Добровольческая армия.',
        selector: 'pin-03-06',
        icon: '06'
    }],
    4: [{
        title: '3 марта 1918',
        city: 'Брест-Литовск',
        text: 'Советская делегация подписывает мирный договор с Германией и ее союзниками.',
        selector: 'pin-04-07',
        icon: '07'
    }, {
        title: '6 марта 1918',
        city: 'Мурманск',
        text: 'Начало интервенции: английские войска высаживаются в Мурманске.',
        selector: 'pin-04-08',
        icon: '08'
    }],
    5: [{
        title: '25 мая 1918',
        city: 'Челябинск — Иркутск',
        text: 'Чехословацкий корпус начинает вооруженное выступление против большевиков.',
        selector: 'pin-05-09',
        icon: '09'
    }],
    6: [{
        title: '8 июня 1918',
        city: 'Самара',
        text: 'Часть членов Учредительного собрания создают антибольшевистское правительство — Комитет членов Учредительного собрания.',
        selector: 'pin-06-10',
        icon: '10'
    }, {
        title: '30 июня 1918',
        city: 'Омск',
        text: 'Антибольшевистские силы образуют Временное Сибирское правительство, его председатель — Петр Вологодский.',
        selector: 'pin-06-11',
        icon: '11'
    }, {
        title: '6 июля 1918',
        city: 'Владивосток',
        text: 'Чехословацкий корпус занимает Владивосток.',
        selector: 'pin-06-12',
        icon: '12'
    }, {
        title: '5-11 июля 1918',
        city: 'Москва',
        text: 'Левые эсеры поднимают восстание, оно заканчивается объявлением партии вне закона.',
        selector: 'pin-06-13',
        icon: '13'
    }, {
        title: '10-11 июля 1918',
        city: 'Ярославль',
        text: 'Главком Восточного фронта Красной армии, левый эсер Михаил Муравьёв, поднимает восстание против большевиков. Его убивают.',
        selector: 'pin-06-14',
        icon: '14'
    }, {
        title: '17 июля 1918',
        city: 'Екатеринбург',
        text: 'По решению большевиков расстреливают царскую семью и ее свиту.',
        selector: 'pin-06-15',
        icon: '15'
    }],
    7: [{
        title: '2 августа 1918',
        city: 'Архангельск',
        text: 'Американцы, англичане и французы занимают Архангельск.',
        selector: 'pin-07-16',
        icon: '16'
    }, {
        title: '2 августа 1918',
        city: 'Архангельск',
        text: 'Бывшие депутаты Учредительного собрания под контролем интервентов образуют Северную область.',
        selector: 'pin-07-16',
        icon: '17'
    }, {
        title: '15 августа 1918',
        city: 'Владивосток',
        text: 'Американцы высаживаются во Владивостоке.',
        selector: 'pin-07-18',
        icon: '18'
    }, {
        title: '30 августа 1918',
        city: 'Петроград',
        text: 'Студент Леонид Каннегисер убивает выстрелом из револьвера главу Петроградской ЧК Моисея Урицкого.',
        selector: 'pin-07-19',
        icon: '19'
    }, {
        title: '30 августа 1918',
        city: 'Москва',
        text: 'Симпатизировавшая эсерам Фанни Каплан стреляет во Владимира Ленина.',
        selector: 'pin-07-20',
        icon: '20'
    }, {
        title: '5 сентября 1918',
        city: 'Москва',
        text: 'Совнарком РСФСР выпускает Постановление «О Красном терроре» (предполагал расстрел всех выступающих против большевиков).',
        selector: 'pin-07-20',
        icon: '21'
    }],
    8: [{
        title: '23 сентября 1918',
        city: 'Уфа',
        text: 'Антибольшевистские силы создают Временное Всероссийское правительство (Уфимскую директорию).',
        selector: 'pin-08-22',
        icon: '22'
    }],
    9: [{
        title: '13 ноября 1918',
        city: 'Москва',
        text: 'ВЦИК РСФСР аннулирует Брестский мирный договор.',
        selector: 'pin-09-23',
        icon: '23'
    }, {
        title: '18 ноября 1918',
        city: 'Омск',
        text: 'Колчак при поддержке сил Антанты свергает Уфимскую директорию и объявляет себя Верховным правителем России.',
        selector: 'pin-09-24',
        icon: '24'
    }, {
        title: '26 ноября 1918',
        city: 'Одесса',
        text: 'Французские войска высаживаются в Одессе.',
        selector: 'pin-09-25',
        icon: '25'
    }],
    10: [{
        title: 'декабрь 1918',
        city: 'Омск',
        text: 'Колчак окончательно ликвидирует Комуч.',
        selector: 'pin-10-26',
        icon: '26'
    }, {
        title: '8 января 1919',
        city: 'Таганрог',
        text: 'Деникин объединяет под своим командованием Добровольческую армию и отряды донских и кубанских казаков.',
        selector: 'pin-10-27',
        icon: '27'
    }],
    11: [{
        title: '5 февраля 1919',
        city: 'Киев',
        text: 'Красная армия занимает Киев.',
        selector: 'pin-11-28',
        icon: '28'
    }, {
        title: '4 марта 1919',
        city: 'Самара',
        text: 'Армия Колчака начинает наступление на силы Красной армии.',
        selector: 'pin-11-29',
        icon: '29'
    }, {
        title: '10 марта 1919',
        city: 'Харьков',
        text: 'На III Всеукраинском съезде Советов провозглашают УССР.',
        selector: 'pin-11-30',
        icon: '30'
    }, {
        title: '6 апреля 1919',
        city: 'Одесса',
        text: 'Красная армия занимает Одессу.',
        selector: 'pin-11-31',
        icon: '31'
    }],
    13: [{
        title: '31 августа 1919',
        city: 'Киев',
        text: 'Войска Деникина занимают Киев.',
        selector: 'pin-13-33',
        icon: '33'
    }, {
        title: '13 сентября 1919',
        city: 'Между Оренбургом и Ташкентом',
        text: 'Красная армия прорывает блокаду Туркестана.',
        selector: 'pin-13-34',
        icon: '34'
    }, {
        title: '20 сентября 1919',
        city: 'Курск',
        text: 'Войска Деникина занимают Курск.',
        selector: 'pin-13-35',
        icon: '35'
    }, {
        title: '28 сентября 1919',
        city: 'Петроград',
        text: 'Красная армия отбивает наступление Северо-Западной армии под Петроградом.',
        selector: 'pin-13-36',
        icon: '36'
    }, {
        title: 'конец сентября 1919',
        city: 'Архангельск',
        text: 'Союзники эвакуируются из Архангельска и Мурманска, интервенция заканчивается.',
        selector: 'pin-13-37',
        icon: '37'
    }, {
        title: '10 октября 1919',
        city: 'Франция и Великобритания',
        text: 'Бывшие союзники России, Франция и Великобритания, начинают экономическую блокаду Советской России.',
        selector: 'pin-13-38',
        icon: '38'
    }, {
        title: '13 октября 1919',
        city: 'Орел',
        text: 'Войска Деникина занимают Орел.',
        selector: 'pin-13-39',
        icon: '39'
    }, {
        title: 'середина октября 1919',
        city: 'Умань',
        text: 'Войска Деникина сталкиваются с силами Махно.',
        selector: 'pin-13-40',
        icon: '40'
    }, {
        title: '20 ноября 1919',
        city: 'Петроград',
        text: 'Юденич пытается взять Петроград.',
        selector: 'pin-13-36',
        icon: '41'
    }],
    14: [{
        title: '14 ноября 1919',
        city: 'Омск',
        text: 'Красная армия занимает Омск.',
        selector: 'pin-14-42',
        icon: '42'
    }, {
        title: '17 ноября 1919',
        city: 'Курск',
        text: 'Красная армия занимает Курск.',
        selector: 'pin-14-43',
        icon: '43'
    }, {
        title: '16 декабря 1919',
        city: 'Киев',
        text: 'Красная армия занимает Киев.',
        selector: 'pin-14-44',
        icon: '44'
    }, {
        title: 'январь 1920',
        city: 'Франция и Великобритания',
        text: 'Бывшие союзники России, Франция и Великобритания, снимают экономическую блокаду в отношении Советской России.',
        selector: 'pin-14-45',
        icon: '45'
    }, {
        title: '3 января 1920',
        city: 'Царицын (Волгоград)',
        text: 'Красная армия занимает Царицын.',
        selector: 'pin-14-46',
        icon: '46'
    }],
    15: [{
        title: '31 января 1920',
        city: 'Владивосток',
        text: 'Антибольшевистские силы покидают Владивосток.',
        selector: 'pin-15-47',
        icon: '47'
    }, {
        title: '7 февраля 1920',
        city: 'Иркутск',
        text: 'Колчак расстрелян по распоряжению большевистского Иркутского военно-революционного комитета.',
        selector: 'pin-15-48',
        icon: '48'
    }, {
        title: '20 февраля 1920',
        city: 'Архангельск',
        text: 'Красная армия занимает Архангельск.',
        selector: 'pin-15-49',
        icon: '49'
    }, {
        title: '27 марта 1920',
        city: 'Новороссийск',
        text: 'Красная армия вступает в Новороссийск.',
        selector: 'pin-15-50',
        icon: '50'
    }],
    16: [{
        title: '4-5 апреля 1920',
        city: 'Николаевск',
        text: 'Под Николаевском Япония напала на Красную армию и силы Дальневосточной республики.',
        selector: 'pin-16-51',
        icon: '51'
    }, {
        title: '6 апреля 1920',
        city: 'Владивосток',
        text: 'Учредительным съездом трудящихся Прибайкалья создается Дальневосточная республика.',
        selector: 'pin-16-52',
        icon: '52'
    }, {
        title: '25 апреля  1920',
        city: 'Граница с Польшей ',
        text: 'Польские войска атакуют позиции Красной армии вдоль границы — начало Советско-польской войны.',
        selector: 'pin-16-53',
        icon: '53'
    }, {
        title: '28 апреля 1920',
        city: 'Азербайджан',
        text: 'Большевики провозглашают Советскую республику вместо независимого Азербайджана.',
        selector: 'pin-16-54',
        icon: '54'
    }, {
        title: '6 мая 1920',
        city: 'Киев',
        text: 'Польские войска занимают Киев.',
        selector: 'pin-16-55',
        icon: '55'
    }],
    17: [{
        title: '12 июня 1920',
        city: 'Киев',
        text: 'Красная армия снова занимает Киев.',
        selector: 'pin-17-56',
        icon: '56'
    }, {
        title: '3 июля 1920',
        city: 'Сахалин',
        text: 'Японцы занимают Северный Сахалин.',
        selector: 'pin-17-57',
        icon: '57'
    }, {
        title: 'август 1920',
        city: 'Тамбов',
        text: 'Начинаются крестьянские выступления в Тамбовской губернии во главе с эсером Антоновым.',
        selector: 'pin-17-58',
        icon: '58'
    }],
    18: [{
        title: '16 августа 1920',
        city: 'Варшава',
        text: '«Чудо на Висле»: польские войска разбивают Красную армию.',
        selector: 'pin-18-59',
        icon: '59'
    }, {
        title: '7-11 ноября 1920',
        city: 'Перекоп',
        text: 'Красная армия занимает Перекоп.',
        selector: 'pin-18-60',
        icon: '60'
    }, {
        title: '15 ноября 1920',
        city: 'Севастополь',
        text: 'Армия Врангеля покидает Севастополь.',
        selector: 'pin-18-61',
        icon: '61'
    }, {
        title: '17 ноября 1920',
        city: 'Севастополь',
        text: 'Красная армия занимает Крым.',
        selector: 'pin-18-61',
        icon: '62'
    }],
    19: [{
        title: '12 февраля 1921',
        city: 'Грузия',
        text: 'Красная армия вторгается в пределы Демократической Республики Грузия.',
        selector: 'pin-19-63',
        icon: '63'
    }, {
        title: '18 февраля  1921',
        city: 'Рига',
        text: 'РСФСР, УССР, БССР и Польша подписывают Рижский мирный договор — окончание Советско-польской войны.',
        selector: 'pin-19-64',
        icon: '64'
    }, {
        title: 'февраль 1921',
        city: 'Монголия',
        text: 'Антибольшевистские силы под командованием барона Унгерна занимают Монголию.',
        selector: 'pin-19-65',
        icon: '65'
    }, {
        title: '1 марта 1921',
        city: 'Кронштадт',
        text: 'Кронштадтские матросы выступают против однопартийной системы в РСФСР.',
        selector: 'pin-19-66',
        icon: '66'
    }, {
        title: '18 марта 1921',
        city: 'Кронштадт',
        text: 'Силы большевиков подавляют Кронштадтское восстание.',
        selector: 'pin-19-66',
        icon: '67'
    }],
    20: [{
        title: 'август 1922',
        city: 'Урга (Монголия), будущий Улан-Батор',
        text: 'Красная армия занимает Ургу, столицу Монголии.',
        selector: 'pin-20-68',
        icon: '68'
    }],
    22: [{
        title: '25 октября 1922',
        city: 'Владивосток',
        text: 'Красная армия выходит к Тихому океану и берет Владивосток.',
        selector: 'pin-22-69',
        icon: '69'
    }, {
        title: '30 декабря 1922',
        city: 'Москва',
        text: 'РСФСР, УССР,  БССР и ЗСФСР объединились в СССР.',
        selector: 'pin-22-70',
        icon: '70'
    }]
};

$(document).ready(function () {

    function parseQuery(qstr) {
        var query = {};
        var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }

    var qs = parseQuery(location.search);
    var requestedState = parseInt(qs.activeState) || 0;
    if (isNaN(requestedState)) requestedState = 0;
    var requestedAutoplay = qs.autoplay ? qs.autoplay === 'false' ? false : true : true;

    var scene = SVG.get('scene');
    var $scene = $('#scene');
    var timeline = {
        '00': {
            elem: $scene.find('#timeline-00'),
            visible: requestedState === 0
        }
    };
    var tooltip = SVG.select('.tooltip');
    var tooltipText = SVG.select('.tooltip-text');
    var tooltipRect = SVG.select('.tooltip-rect');

    function pad(nubmer) {
        return nubmer < 10 ? "0" + nubmer : nubmer;
    }

    for (var i = 1; i <= 23; i++) {
        var k = pad(i);
        timeline[k] = {
            elem: $scene.find('#timeline-' + k),
            visible: requestedState === i
        };
    }

    var areaCache = {};

    Object.keys(timeline).forEach(function (key) {
        var timelineObject = timeline[key];
        timelineObject.elem.on('mouseover', '.area', function (event) {
            var target = SVG.adopt(event.target);

            var areaTooltipText = target.attr('data-text') || null;
            if (areaTooltipText) {
                tooltipText.native().members[0].node.textContent = areaTooltipText;
                tooltip.translate(target.rbox().cx, target.rbox().cy).addClass('tooltip_visible_yes');
                var textBBox = tooltipText.bbox();
                tooltipRect.attr("width", textBBox.width + 20).attr("height", textBBox.height + 10);
            }
        });

        timelineObject.elem.on('mouseout', '.area', function (event) {
            tooltip.removeClass('tooltip_visible_yes');
        });

        timelineObject.elem.on('mousemove', '.area', function (event) {
            var textBBox = tooltipText.bbox();
            var x = event.clientX - $scene.offset().left - textBBox.width - 30;
            var y = event.clientY - $scene.offset().top - textBBox.height - 20;

            if (event.clientX - textBBox.width - 30 < $scene.offset().left || event.clientY - textBBox.height - 20 < $scene.offset().top) {
                x = event.clientX - $scene.offset().left + 10;
                y = event.clientY - $scene.offset().top + 10;
            }
            tooltip.translate(x, y);
        });

        timelineObject.elem.on('mouseover', '.pin', function (event) {
            if (autoPlay) return;
            SVG.adopt(event.currentTarget).addClass('pin_active_yes').stop().animate(100).scale(currentPinsZoom * 1.5);
            // SVG.adopt(event.currentTarget).scale(currentPinsZoom * 1.5);
        });

        timelineObject.elem.on('mouseout', '.pin', function (event) {
            if (autoPlay) return;
            SVG.adopt(event.currentTarget).removeClass('pin_active_yes').stop().animate(100).scale(currentPinsZoom);
            // SVG.adopt(event.currentTarget).scale(currentPinsZoom);
        });

        timelineObject.elem.on('click', '.pin', function (event) {
            if (autoPlay) return;
            // $('.card_visible_yes').removeClass('card_visible_yes');
            var id = $(event.currentTarget).attr('id');
            var leftOffset = 20;
            Object.keys(cards).forEach(function (key) {
                var cardsList = cards[key];
                if (cardsList.length > 0) {
                    cardsList.forEach(function (card) {
                        if (card.selector && card.selector === id) {
                            card.cardDiv.addClass('card_visible_yes').addClass('card_active_yes');
                            setTimeout(function () {
                                card.cardDiv.removeClass('card_active_yes');
                            }, 2000);
                            // card.cardDiv.css({left: leftOffset});
                            leftOffset = leftOffset + cardFW;
                        }
                    });
                }
            });
        });

        loadCards(parseInt(key));
    });

    function colorizeSelector() {
        if (typeof currentStateIndex !== 'number') return;

        $('.state-date_visible_yes').removeClass('state-date_visible_yes');
        $('#state-date-' + pad(currentStateIndex)).addClass('state-date_visible_yes');

        $('.selector__button').each(function () {
            var newClassList = [];
            $(this).attr('class').split(/\s+/).forEach(function (className) {
                if (className.indexOf('gray') === -1 && className.indexOf('red') === -1) newClassList.push(className);
            });
            $(this).attr('class', newClassList.join(' '));
        });

        var grayStage = 0;
        for (var i = currentStateIndex + 1; i <= 23; i++) {
            if (i <= currentStateIndex + 6) {
                grayStage++;
            }
            $('.selector__button[data-timeline=' + pad(i) + ']').addClass('selector__button_gray_' + grayStage);
        }

        var redStage = 6;
        for (var k = currentStateIndex - 1; k >= 0; k--) {
            if (redStage > 0) {
                redStage--;
            }
            $('.selector__button[data-timeline=' + pad(k) + ']').addClass('selector__button_red_' + redStage);
        }
    }

    function positionCards() {
        if (!isMobile) {
            Object.keys(cards).forEach(function (key) {
                var cardsList = cards[key];
                if (cardsList.length > 0) {

                    var oneCardOffset = ($('body').outerWidth() - cardFW - cardGap * 3) / (cardsList.length - 1);

                    if (oneCardOffset > cardFW) {
                        oneCardOffset = cardFW;
                    }

                    cardsList.forEach(function (card, index) {
                        if (card.cardDiv) {
                            card.cardDiv.css({
                                left: oneCardOffset * index + 60
                            });
                        }
                    });
                }
            });
        }
    }

    function positionSelector() {
        var gap = 150;
        var mobile = $(window).outerWidth() <= 1024;
        if (mobile) {
            gap = 0;
        }
        var oneStateWidth = isMobile ? ($('body').width() - gap) / 23 : parseInt(($('body').width() - gap) / 23);
        $('.selector__button').css({
            width: oneStateWidth
        });
        setTimeout(function () {
            $('.selector__button').each(function (index) {
                var id = $(this).data('timeline');
                if ($('#state-date-' + id).length > 0) {
                    var selectorLeftOffset = oneStateWidth * index;
                    var windowWidth = $(window).outerWidth() - gap;
                    var selectorWidth = $(this).outerWidth();
                    var dateWidth = mobile ? 0 : $('#state-date-' + id).outerWidth();
                    var rightSideEnought = windowWidth - (selectorLeftOffset + selectorWidth) > dateWidth + 20;
                    if (rightSideEnought) {
                        $('#state-date-' + id).css('left', selectorLeftOffset !== 0 ? selectorLeftOffset : 20);
                    } else {
                        $('#state-date-' + id).css('left', selectorLeftOffset + oneStateWidth - dateWidth);
                    }
                }
            });
        }, 0);
    }

    positionSelector();

    function loadCards(currentIndex) {
        if (typeof currentIndex !== 'number') return;
        var currentCards = cards[currentIndex] || [];
        if (currentCards.length === 0) return;
        currentCards.forEach(function (card, index) {
            if (card.selector && !card.pin) {
                card.pin = SVG.select('#' + card.selector);
                card.orginPinBbox = {
                    origWidth: card.pin.bbox().w,
                    origHeight: card.pin.bbox().h
                };
            }
            if (!card.cardDiv) {
                card.cardDiv = $('.cardTemplate').clone();
                card.cardDiv.html(card.cardDiv.html().replace('%text%', card.text).replace('%title%', card.title).replace('%city%', card.city).replace('%icon%', '<img class="card__icon card__icon_num_' + card.icon + '" src="/images/main/map/icon-' + card.icon + '.svg" width="350" height="350">')).attr('class', 'card');
                $('.playground').append(card.cardDiv);
            }
        });

        positionCards();
    }

    function showNextCard(force, backward) {
        debug && console.info('Next card, currentStateIndex', currentStateIndex);
        if (typeof currentStateIndex !== 'number') {
            debug && console.info('currentIndex is undefined');
            return;
        }

        isMobile && $('.pin_active_yes').removeClass('pin_active_yes');

        var currentCards = cards[currentStateIndex] || [];
        if (currentCards.length === 0) {
            debug && console.info('No cards given in current state — next state after 5 sec');
            nextStateTimeout && clearTimeout(nextStateTimeout);
            nextStateTimeout = setTimeout(function () {
                showNextState();
            }, force ? 0 : NEXT_STEP_TIMEOUT);
            return;
        }

        var currentCard = currentCards[currentCardIndex];
        if (!currentCard) {
            debug && console.info('No more cards in current state — next state after 5 sec');
            nextStateTimeout && clearTimeout(nextStateTimeout);
            nextStateTimeout = setTimeout(function () {
                showNextState();
            }, !isMobile ? NEXT_STEP_TIMEOUT : 0);
            return;
        }

        if (isMobile) {
            clearCards();
        }

        if (currentCard.cardDiv) {
            debug && console.info('Active current card (index: ' + currentCardIndex + ')');
            currentCard.cardDiv && currentCard.cardDiv.addClass('card_visible_yes');
            !isMobile && currentCard.cardDiv && currentCard.cardDiv.addClass('card_active_yes');
        }
        if (isMobile) {
            currentCard.pin && currentCard.pin.addClass('pin_active_yes');
        } else {
            currentCard.pin && currentCard.pin.toggleClass('pin_active_yes').stop().animate(200).scale(currentPinsZoom * 1.5);
        }

        currentCardIndex = backward ? currentCardIndex - 1 : currentCardIndex + 1;
        debug && console.info('Incriment card index, newone: ' + currentCardIndex);

        if (!isMobile) {
            nextCardTimeout && clearTimeout(nextCardTimeout);
            nextCardTimeout = setTimeout(function () {
                debug && console.info('Call next card for current state');
                showNextCard();
            }, NEXT_CARD_TIMEOUT);
        }

        // it should be done anyway
        setTimeout(function () {
            debug && console.info('Back pin to normal size');
            !isMobile && currentCard.pin && currentCard.pin.toggleClass('pin_active_yes').stop().animate(200).scale(currentPinsZoom);
            !isMobile && currentCard.cardDiv && currentCard.cardDiv.removeClass('card_active_yes');
        }, NEXT_CARD_TIMEOUT - 200);
    }

    function showNextState() {
        var nextStateIndex = currentStateIndex + 1;

        debug && console.info('showNextState, currentStateIndex:', currentStateIndex);
        debug && console.info('showNextState, nextStateIndex:', nextStateIndex);

        clearCards();

        if (!timeline[pad(nextStateIndex)]) {
            debug && console.info('Autoplay done');
            setTimeout(function () {
                $('body').addClass('intro-opened');
                $('.show-again').addClass('show-again_visible_yes');
            }, NEXT_STEP_TIMEOUT);
            $('.playground').trigger('playback', {
                auto: false
            });

            return;
            // $('.playground').trigger('playback', {auto: false});
            // nextStateIndex = 1;
        }

        timeline[pad(currentStateIndex)].visible = false;
        timeline[pad(nextStateIndex)].visible = true;
        changeStates(true);
    }

    function changeStates(fromStart) {
        Object.keys(timeline).forEach(function (key) {
            var timelineObject = timeline[key];
            if (timelineObject.visible) {
                timelineObject.elem.addClass('timeline_visible_yes');
                timelineObject.elem.removeClass('timeline_visible_no');

                $('.selector__button[data-timeline=' + key + ']').addClass('selector__button_state_active');

                nextCardTimeout && clearTimeout(nextCardTimeout);
                nextStateTimeout && clearTimeout(nextStateTimeout);

                currentStateIndex = parseInt(key);
                fromStart && (currentCardIndex = 0);
                if (!isMobile) {
                    if (autoPlay && currentStateIndex !== 0) {
                        nextCardTimeout = setTimeout(function () {
                            debug && console.info('Start next card for current state');
                            showNextCard();
                        }, START_CARD_TIMEOUT);
                    } else if (autoPlay && currentStateIndex === 0) {
                        $('.auto-play').hide();
                        $('body').removeClass('intro-opened');
                        if (!firstRun) {
                            nextCardTimeout = setTimeout(function () {
                                debug && console.info('Start next card for current state');
                                showNextCard();
                            }, START_CARD_TIMEOUT);
                        }
                    }
                } else {
                    if (currentStateIndex !== 0) {
                        showNextCard();
                    } else {
                        $('.auto-play').hide();
                        $('body').removeClass('intro-opened');
                    }
                }
            } else {
                timelineObject.elem.addClass('timeline_visible_no');
                timelineObject.elem.removeClass('timeline_visible_yes');
                $('.selector__button[data-timeline=' + key + ']').removeClass('selector__button_state_active');
            }
        });

        if (currentStateIndex > 0) {
            $('.auto-play').hide();
            $('body').removeClass('intro-opened');
        } else if (firstRun === true) {
            $('.auto-play').show();
            $('body').addClass('intro-opened');
        }

        firstRun = false;

        colorizeSelector();
        changePlaybackModes();
        changeLegend();

        history.pushState({}, null, location.pathname + '?activeState=' + currentStateIndex + '&autoplay=' + autoPlay);
    }

    var legends = {
        0: [20, 21, 22, 23],
        1: [1, 3, 17, 18, 19, 20, 21, 22, 23],
        2: [1, 2, 3, 4, 17, 18, 19, 20, 21, 22, 23],
        3: [1, 2, 3, 4, 17, 18, 19, 20, 21, 22, 23],
        4: [1, 2, 3, 4, 15, 17, 18, 20, 21, 22, 23],
        5: [1, 2, 3, 4, 15, 16, 17, 18, 20, 21, 22, 23],
        6: [1, 2, 3, 4, 15, 16, 17, 18, 20, 21, 22, 23],
        7: [1, 2, 3, 4, 15, 16, 17, 18, 20, 21, 22, 23],
        8: [1, 2, 3, 4, 5, 15, 16, 17, 18, 20, 21, 22, 23],
        9: [1, 2, 3, 4, 6, 15, 16, 17, 18, 20, 21, 22, 23],
        10: [1, 3, 4, 6, 7, 13, 15, 16, 17, 20, 21, 22, 23],
        11: [1, 3, 4, 6, 7, 12, 13, 15, 16, 17, 20, 21, 22, 23],
        12: [1, 3, 4, 6, 13, 15, 16, 17, 20, 21, 22, 23],
        13: [1, 4, 6, 13, 15, 16, 17, 20, 21, 22, 23],
        14: [1, 6, 12, 13, 15, 16, 17, 20, 21, 22, 23],
        15: [1, 7, 8, 9, 13, 15, 17, 20, 21, 22, 23],
        16: [1, 7, 8, 9, 13, 15, 17, 20, 21, 22, 23],
        17: [1, 7, 8, 9, 13, 14, 15, 17, 18, 20, 21, 22, 23],
        18: [1, 9, 13, 14, 17, 18, 20, 21, 22, 23],
        19: [1, 9, 10, 13, 14, 17, 18, 20, 21, 22, 23],
        20: [1, 10, 11, 14, 17, 18, 20, 21, 22, 23],
        21: [1, 10, 11, 17, 18, 20, 21, 22, 23],
        22: [1, 10, 11, 17, 18, 20, 21, 22, 23],
        23: [1, 21, 22, 23]
    };

    // icons = {
    //     0: [],
    //     1: [1],
    //     2: [2],
    //     3: [1, 3],
    //     4: [4, 5],
    //     5: [6],
    //     6: [1, 2, 6, 7],
    //     7: [5, 1, 8, 9, 10],
    //     8: [1],
    //     9: [1, 11, 5],
    //     10: [1],
    //     11: [2, 13, 1, 2],
    //     12: [],
    //     13: [2, 14, 15, 16, 13],
    //     14: [2, 17],
    //     15: [18, 19, 2],
    //     16: [13, 1, 2],
    //     17: [2, 6],
    //     18: [13, 2, 15],
    //     19: [2, 4, 6, 21],
    //     20: [2],
    //     21: [2],
    //     22: [20]
    // }

    function changeLegend() {
        if (typeof currentStateIndex === 'undefined') return;
        var stateLegend = legends[currentStateIndex];
        // var stateIcons = icons[currentStateIndex];
        if (!stateLegend) return;
        $('.legend__area').each(function () {
            var currentArea = parseInt($(this).data('area'));
            if (stateLegend.indexOf(currentArea) !== -1) {
                if (!$(this).hasClass('legend__area_visible_yes')) {
                    $(this).addClass('legend__area_visible_yes').stop().slideDown();
                }
            } else {
                $(this).removeClass('legend__area_visible_yes').stop().slideUp();
            }
        });
        // $('.legend__event').each(function () {
        //     var currentArea = parseInt($(this).data('icon'));
        //     if (stateIcons.indexOf(currentArea) !== -1) {
        //         if (!$(this).hasClass('legend__event_visible_yes')) {
        //             $(this).addClass('legend__event_visible_yes').stop().slideDown();
        //         }
        //     } else {
        //         $(this).removeClass('legend__event_visible_yes').stop().slideUp();
        //     }
        // });
    }

    function changePlaybackModes() {
        if (currentStateIndex === 23) {
            $('.playback__next').addClass('playback__next_disabled_yes');
            $('.playback-mobile__nextState').addClass('playback-mobile__nextState_disabled_yes');
            $('.playback-mobile__nextCard').addClass('playback-mobile__nextCard_disabled_yes');
        } else {
            $('.playback__next').removeClass('playback__next_disabled_yes');
            $('.playback-mobile__nextState').removeClass('playback-mobile__nextState_disabled_yes');
            $('.playback-mobile__nextCard').removeClass('playback-mobile__nextCard_disabled_yes');
        }
        if (currentStateIndex === 0) {
            $('.playback__prev').addClass('playback__prev_disabled_yes');
            $('.playback-mobile__prevState').addClass('playback-mobile__prevState_disabled_yes');
            $('.playback-mobile__prevCard').addClass('playback-mobile__prevCard_disabled_yes');
        } else {
            $('.playback__prev').removeClass('playback__prev_disabled_yes');
            $('.playback-mobile__prevState').removeClass('playback-mobile__prevState_disabled_yes');
            $('.playback-mobile__prevCard').removeClass('playback-mobile__prevCard_disabled_yes');
        }
    }

    function clearCards() {
        if (cards[parseInt(currentStateIndex)]) {
            cards[parseInt(currentStateIndex)].forEach(function (card) {
                if (card.cardDiv) {
                    card.cardDiv.removeClass('card_visible_yes');
                }
            });
        }
        positionCards();
    }

    $('.auto-play').on('click', function () {
        timeline[pad(currentStateIndex)].visible = false;
        if (isMobile) {
            timeline['01'].visible = true;
        } else {
            timeline['00'].visible = true;
        }
        $('.playground').trigger('playback', {
            auto: true,
            cb: function cb() {
                clearCards();
                changeStates(true);
            }
        });
    });

    $('.show-again').on('click', function () {
        $('body').removeClass('intro-opened');
        $('.show-again').removeClass('show-again_visible_yes');
        timeline[pad(currentStateIndex)].visible = false;
        timeline['00'].visible = true;
        $('.playground').trigger('playback', {
            auto: false,
            cb: function cb() {
                clearCards();
                changeStates(true);
                changePlaybackModes();
            }
        });
    });

    $('.zoom__button_mode_in').on('click', function () {
        panZoomTiger.zoomIn(.1);
    });

    $('.zoom__button_mode_out').on('click', function () {
        panZoomTiger.zoomOut(.1);
    });

    $('.selector__button').on('click', function (event) {
        var timelineId = $(event.target).data('timeline');
        Object.keys(timeline).forEach(function (key) {
            timeline[key].visible = false;
        });
        if (timelineId && timeline[timelineId]) {
            timeline[timelineId].visible = true;
        }

        $('.playground').trigger('playback', {
            auto: false,
            cb: function cb() {
                clearCards();
                changeStates(true);
            }
        });
    });

    $('.playground').on('playback', function (event, data) {
        // clearCards();
        if (data && typeof data.auto !== 'undefined') {
            if (data.auto === true && !isMobile) {
                debug && console.info('Start autoPlay');
                autoPlay = true;
            } else {
                debug && console.info('Stop autoPlay');
                autoPlay = false;

                nextCardTimeout && clearTimeout(nextCardTimeout);
                nextStateTimeout && clearTimeout(nextStateTimeout);
            }
        }
        if (autoPlay) {
            $('.playground').removeClass('playground_autoplay_stop');
            $('.playback__play').addClass('playback__play_state_pause');
        } else {
            $('.playground').addClass('playground_autoplay_stop');
            $('.playback__play').removeClass('playback__play_state_pause');
        }

        history.pushState({}, null, location.pathname + '?activeState=' + currentStateIndex + '&autoplay=' + autoPlay);

        if (data && data.cb && typeof data.cb === 'function') data.cb();
    });

    $('.playground').on('click', '.playback__play', function (event) {
        var wantPlay = !$(event.target).hasClass('playback__play_state_pause');
        if (wantPlay) {
            if (currentStateIndex === 0) {
                timeline[pad(currentStateIndex)].visible = false;
                timeline['01'].visible = true;
            }

            $('.playground').trigger('playback', {
                auto: true,
                cb: function cb() {
                    positionCards();
                    changeStates();
                }
            });
        } else {
            $('.playground').trigger('playback', {
                auto: false
            });
        }
    });

    $('.playground').on('click', '.playback__next', function () {
        if (currentStateIndex > 23) return;
        clearCards();
        timeline[pad(currentStateIndex)].visible = false;
        timeline[pad(currentStateIndex + 1)].visible = true;
        $('.playground').trigger('playback', {
            auto: true,
            cb: function cb() {
                positionCards();
                changeStates(true);
            }
        });
    });

    $('.playground').on('click', '.playback__prev', function () {
        if (currentStateIndex < 1) return;
        clearCards();
        timeline[pad(currentStateIndex)].visible = false;
        timeline[pad(currentStateIndex - 1)].visible = true;
        $('.playground').trigger('playback', {
            auto: currentStateIndex > 1,
            cb: function cb() {
                positionCards();
                changeStates(true);
            }
        });
    });

    $('.playground').on('click', '.card__close', function (event) {
        $(event.target).closest('.card').removeClass('card_visible_yes');
    });

    autoPlay = requestedAutoplay;
    changeStates(true);
    $('.playground').trigger('playback');

    var beforePan = function beforePan(oldPan, newPan) {
        var sizes = this.getSizes();

        var customPan = {};
        customPan.y = newPan.y;
        customPan.x = newPan.x;

        var viewPortWidth = sizes.width;
        var viewPortHeight = sizes.height;

        var panWidth = sizes.viewBox.width * sizes.realZoom;
        var panHeight = sizes.viewBox.height * sizes.realZoom;

        var panLeftBorder = sizes.viewBox.x + newPan.x - 100;
        var panRightBorder = panWidth + sizes.viewBox.x + newPan.x + 100;

        var panTopBorder = sizes.viewBox.y + newPan.y;
        var panBottomBorder = panHeight + sizes.viewBox.y + newPan.y;

        if (panWidth > viewPortWidth) {
            if (panRightBorder <= viewPortWidth) {
                customPan.x = false;
            } else if (panLeftBorder >= 0) {
                customPan.x = false;
            }
        } else {
            customPan.x = (viewPortWidth - panWidth) / 2;
        }

        if (panHeight > viewPortHeight) {
            if (panBottomBorder <= viewPortHeight) {
                customPan.y = false;
            } else if (panTopBorder >= 0) {
                customPan.y = false;
            }
        } else {
            customPan.y = (viewPortHeight - panHeight) / 2;
        }

        return customPan;
    };

    var onZoom = function onZoom(zoom) {
        var sizes = this.getSizes();
        currentPinsZoom = 1.1 / sizes.realZoom;
        Object.keys(cards).forEach(function (key) {
            var cardsList = cards[key];
            cardsList.forEach(function (card) {
                if (card.pin) {
                    card.pin.scale(currentPinsZoom);
                }
            });
        });
    };

    var sizesMap = [{
        from: 0,
        to: 768,
        minZoom: 1,
        maxZoom: 2,
        startZoom: 1.6,
        correctPan: true
    }, {
        from: 768,
        to: 1024,
        maxZoom: 1.4,
        minZoom: 1,
        startZoom: 1.05,
        correctPan: true
    }, {
        from: 1024,
        to: 1440,
        maxZoom: 2.3,
        minZoom: 1.4,
        startZoom: 1.65
    }, {
        from: 1440,
        maxZoom: 2.5,
        minZoom: 1.6,
        startZoom: 1.75
    }];

    function resetSVGOptions() {
        var viewPortWidth = $(window).outerWidth();
        var correctSize;
        sizesMap.forEach(function (item) {
            var moreThatFrom = viewPortWidth >= item.from;
            var lessThatTo;
            if (item.to === undefined) {
                lessThatTo = true;
            } else {
                lessThatTo = viewPortWidth < item.to;
            }

            if (moreThatFrom && lessThatTo) {
                correctSize = item;
            }
        });

        panZoomTiger.setMinZoom(correctSize.minZoom).setMaxZoom(correctSize.maxZoom).zoom(correctSize.startZoom);

        if (isMobile) {
            panZoomTiger.pan({
                x: 0,
                y: 0
            });
        }
    }

    panZoomTiger = svgPanZoom('#scene', {
        viewportSelector: '.svg-pan-zoom_viewport',
        beforePan: beforePan,
        zoomScaleSensitivity: .1,
        fit: false,
        contain: false,
        onZoom: onZoom,
        mouseWheelZoomEnabled: false
    });

    resetSVGOptions();

    var outerWidth = $(window).outerWidth();

    $(window).on('resize', $.debounce(1000, function () {
        if (!isMobile && outerWidth !== $(window).outerWidth()) {
            location.replace(location.pathname + '?activeState=' + currentStateIndex + '&autoplay=' + autoPlay);
        }

        if (isMobile) {
            positionSelector();
        }
    }));

    $('.playback-mobile').on('click', '.playback-mobile__nextCard', function () {
        showNextCard(true); // force
    });
    $('.playback-mobile').on('click', '.playback-mobile__prevCard', function () {
        showNextCard(true, true); // force
    });
    $('.playback-mobile').on('click', '.playback-mobile__prevState', function () {
        if (currentStateIndex < 1) return;
        clearCards();
        timeline[pad(currentStateIndex)].visible = false;
        timeline[pad(currentStateIndex - 1)].visible = true;
        $('.playground').trigger('playback', {
            auto: false,
            cb: function cb() {
                positionCards();
                changeStates(true);
            }
        });
    });
    $('.playback-mobile').on('click', '.playback-mobile__nextState', function () {
        if (currentStateIndex > 23) return;
        clearCards();
        timeline[pad(currentStateIndex)].visible = false;
        timeline[pad(currentStateIndex + 1)].visible = true;
        $('.playground').trigger('playback', {
            auto: false,
            cb: function cb() {
                positionCards();
                changeStates(true);
            }
        });
    });
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