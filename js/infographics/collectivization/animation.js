'use strict';

jQuery.fn.reverse = [].reverse;

var controller = new ScrollMagic.Controller();

/* STICKS *************************************************************************************************************/
if (window.innerWidth > 766) {
    new ScrollMagic.Scene({
        triggerElement: '#s2',
        duration: window.innerHeight,
        triggerHook: 'onLeave'
        // offset: -(window.innerHeight * 0.8)
    }).setTween(new TimelineMax().add(TweenMax.to($('.sticks__item'), 1, {
        opacity: 1,
        top: 0
    })))
    // .addIndicators({name: 's2'})
    .addTo(controller);

    var timeline = new TimelineLite();

    $('.d-md-block .sticks__blue .sticks__item').each(function (i, v) {
        if (i > 0) {
            timeline.to($(v), 1, {
                left: parseInt($(v).css('left')) - 10 * i
            }, 0);
        }
    });

    timeline.to($('.sticks-description'), 1, {
        opacity: 1
    }, 0);

    $('.sticks__red .sticks__item').reverse().each(function (i, v) {
        if (i) {
            timeline.to($(v), 1, {
                left: parseInt($(v).css('left')) + 10 * i
            }, 0);
        }
    });

    new ScrollMagic.Scene({ triggerElement: '#s2-1', duration: window.innerHeight }).setTween(timeline)
    // .addIndicators({name: 's2-1'})
    .addTo(controller);
}

/* 100 STICKS *********************************************************************************************************/
var stickDefault = 'img/icon-rustick.svg';
var sticks = {
    '.worker': 'img/icon-worker.svg',
    '.prisoner': 'img/icon-prisoner.svg',
    '.skeleton': 'img/icon-skeleton.svg'
};

function sceneSticks(triggerSelector, tweenSelector, toSelector, descriptionSelector) {

    var stickSelector = 'img' + tweenSelector;

    var tweenLineMax = new TimelineMax();
    tweenLineMax.add(TweenMax.to($(descriptionSelector), 1, { opacity: 0, display: 'none' })).add(TweenMax.to($(triggerSelector + '-description'), 1, { opacity: 1, display: 'block' }));

    if (window.innerWidth > 766) {
        tweenLineMax.add(TweenMax.fromTo(tweenSelector, 2, { left: 0 }, { left: 25 })).add(TweenMax.to('.sticks-100__riot', 1, { opacity: 1 }));
    }

    return new ScrollMagic.Scene({
        triggerElement: triggerSelector,
        duration: $(toSelector).offset().top - $(triggerSelector).offset().top - window.innerHeight
    }).setTween(tweenLineMax).on('enter', function (event) {
        if (sticks[tweenSelector] && 'REVERSE' === event.scrollDirection) {
            $(stickSelector).attr('src', stickDefault);
        }
    }).on('leave', function (event) {
        if (sticks[tweenSelector] && 'FORWARD' === event.scrollDirection) {
            $(stickSelector).attr('src', sticks[tweenSelector]);
        }
    })
    // .addIndicators({name: tweenSelector})
    .addTo(controller);
}

sceneSticks('#s13-1', '.insurgents', '#s13-2');
sceneSticks('#s13-2', '.worker', '#s13-3', '#s13-1-description');
sceneSticks('#s13-3', '.prisoner', '#s13-4', '#s13-2-description');
sceneSticks('#s13-4', '.skeleton', '#s13-5', '#s13-3-description');

/* COLLECTIVIZATION END ***********************************************************************************************/
new ScrollMagic.Scene({
    triggerElement: '#s12-1',
    duration: window.innerHeight * 3
}).setTween(new TimelineMax().add(TweenMax.to($('.collectivization-end .icon-riot'), 2, {
    opacity: 0.8
}), 1).add(TweenMax.to($('.collectivization-end .digit_bunt'), 1, {
    opacity: 1
}), 2).add(TweenMax.to($('.collectivization-end .icon-repres'), 2, {
    opacity: 0.8
}), 3).add(TweenMax.to($('.collectivization-end .digit_repres'), 1, {
    opacity: 1
}), 4).add(TweenMax.to($('.collectivization-end .icon-death'), 2, {
    opacity: 0.8
}), 5).add(TweenMax.to($('.collectivization-end .digit_dead'), 1, {
    opacity: 1
}), 6).add(TweenMax.to($('.collectivization-end .icon-city'), 2, {
    opacity: 0.8
}), 7).add(TweenMax.to($('.collectivization-end .digit_city'), 1, {
    opacity: 1
}), 8))
// .addIndicators({name: '#s12-1'})
.addTo(controller);

/* MAP LINES *********************************************************************************************************/

(function () {
    if (screen.width > 768) {
        var map = document.querySelector('#map-line-wrapper'),
            polygons = map.querySelectorAll('line'),
            tween = new TimelineMax(),
            path;

        for (var i = 0; i < polygons.length; i++) {

            path = SVG('Слой_1').path('M ' + polygons[i].x1.baseVal.value + ',' + polygons[i].y1.baseVal.value + ' L ' + polygons[i].x2.baseVal.value + ',' + polygons[i].y2.baseVal.value);

            polygons[i].setAttribute('stroke-dasharray', path.length());
            polygons[i].setAttribute('stroke-dashoffset', path.length());

            tween.add(TweenMax.to(polygons[i], 1, { strokeDashoffset: 0 }));

            path.remove();
        }

        new ScrollMagic.Scene({
            triggerElement: '#map-line-trigger',
            triggerHook: 'onLeave',
            duration: window.innerHeight * 2.5
        }).setTween(tween)
        // .addIndicators({name: '#map-line-trigger'})
        .addTo(controller);
    }
})();

/* FALLING ELEMENTS ***************************************************************************************************/

(function () {
    var elements = document.querySelectorAll('.falling-elements'),
        svgelements,
        tween = new TimelineMax();

    for (var g = 0; g < elements.length; g++) {
        svgelements = elements[g].querySelectorAll('.cls-1');

        for (var i = 0; i < svgelements.length; i++) {
            tween.add(TweenMax.fromTo(svgelements[i], 3, { y: 0 }, { y: 120 }));
        }
    }

    new ScrollMagic.Scene({
        triggerElement: '#trigger-falling',
        triggerHook: 'onLeave',
        duration: 1000
    }).setTween(tween)
    // .addIndicators({name: '#trigger-falling'})
    .addTo(controller);
})();

(function () {

    var elements = document.querySelectorAll('.falling-elements-tractor'),
        svgelements,
        tween = new TimelineMax();

    for (var g = 0; g < elements.length; g++) {
        svgelements = elements[g].querySelectorAll('.cls-2');

        for (var i = 0; i < svgelements.length; i++) {
            tween.add(TweenMax.fromTo(svgelements[i], 3, { y: -200 }, { y: 0 }));
        }
    }

    new ScrollMagic.Scene({ triggerElement: '#trigger-falling', triggerHook: 'onLeave', duration: 1000 }).setTween(tween).addTo(controller);
})();

(function () {

    var elements = document.querySelectorAll('.back-falling-elements'),
        svgelements,
        tween = new TimelineMax();

    for (var g = 0; g < elements.length; g++) {
        svgelements = elements[g].querySelectorAll('.cls-1');

        for (var i = 0; i < svgelements.length; i++) {
            if (i === 1) continue;
            tween.add(TweenMax.fromTo(svgelements[i], 3, { y: 0 }, { y: 200 }));
        }
    }

    new ScrollMagic.Scene({ triggerElement: '#back-trigger-falling', triggerHook: 'onLeave', duration: 1000 }).setTween(tween).addTo(controller);
})();

(function () {

    var elements = document.querySelectorAll('.back-falling-elements-tractor'),
        svgelements,
        tween = new TimelineMax();

    for (var g = 0; g < elements.length; g++) {
        svgelements = elements[g].querySelectorAll('.cls-2');

        for (var i = 0; i < svgelements.length; i++) {
            tween.add(TweenMax.fromTo(svgelements[i], 3, { y: -200 }, { y: 0 }));
        }
    }

    new ScrollMagic.Scene({ triggerElement: '#back-trigger-falling', triggerHook: 'onLeave', duration: 1000 }).setTween(tween).addTo(controller);
})();

/* MAPS ***************************************************************************************************************/

function mapAnimation(id) {
    function createScene(svg, n, fastHide) {
        var tweenMax = new TimelineMax();
        var z = 0;

        function addCubes(cubes) {
            for (var g = 0; g < cubes.length; g++) {
                z++;
                var element = SVG.adopt(cubes[g]);
                tweenMax.add(TweenLite.to(element, 1, {
                    y: Math.abs(element.attr('y'))
                }), z);
            }
        }

        addCubes(svg.querySelectorAll('.st3'));
        addCubes(svg.querySelectorAll('.redCube'));

        tweenMax.add(TweenLite.to(svg.querySelectorAll('.anim-opacity'), 200, {
            opacity: 1
        }), Math.round(z * .9));

        new ScrollMagic.Scene({
            triggerElement: '#' + id + '-' + n + '-trigger',
            // triggerHook: 'onLeave',
            duration: $('.scroll-area').height() * 4
            // offset: Math.round($(svg).height() * 0.03)
        }).setTween(tweenMax)
        // .addIndicators({name: '#' + id + '-' + n + '-trigger'})
        .on('enter', function (event) {
            $(svg).show();
            $(svg).animate({ opacity: 1 }, 50, function () {
                if (getComputedStyle(svg).display === 'inline' && id === 'map-4') {
                    if (document.querySelector('.s' + svg.children[3].id.slice(7)) !== null) {
                        document.querySelector('.s' + svg.children[3].id.slice(7)).classList.add('active-switch');
                    }
                } else if (getComputedStyle(svg).display === 'inline') {
                    if (document.querySelector('.s' + svg.children[3].id.slice(7)) !== null) {
                        document.querySelector('.s' + svg.children[3].id.slice(7)).classList.add('active-switch_orange');
                    }
                }
            });
        }).on('leave', function (event) {
            $(svg).animate({ opacity: 0 }, fastHide ? 0 : 1100, function () {
                $(svg).hide();

                if (getComputedStyle(svg).display === 'none' && id === 'map-4') {
                    if (document.querySelector('.s' + svg.children[3].id.slice(7)) !== null) {
                        document.querySelector('.s' + svg.children[3].id.slice(7)).classList.remove('active-switch');
                    }
                } else if (getComputedStyle(svg).display === 'none') {
                    if (document.querySelector('.s' + svg.children[3].id.slice(7)) !== null) {
                        document.querySelector('.s' + svg.children[3].id.slice(7)).classList.remove('active-switch_orange');
                    }
                }
            });
        }).addTo(controller);
    }

    if (window.innerWidth > 414) {
        var maps = document.getElementById(id).querySelectorAll(".map-svg.map-svg_desktop");
    } else {
        var maps = document.getElementById(id).querySelectorAll(".map-svg.map-svg_mobile");
    }

    maps.forEach(function (value, i) {
        var fastHide = maps.length > 1 && i === 0;
        createScene(value, i, fastHide);
    });
}

mapAnimation('map-1');
mapAnimation('map-2');
mapAnimation('map-4');