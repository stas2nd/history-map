'use strict';

function additionEvent(callback) {
    var items = document.querySelectorAll('[id *= "-19"], rect[id *= Rectangle], .anim-opacity');

    for (var i = 0; i < items.length; i++) {
        items[i].onmouseenter = items[i].onmouseleave = callback;
    }
}

function receivingParent(target, desiredTarget, iterations) {
    var counter = 0;

    while (!target.classList.contains(desiredTarget)) {
        counter++;

        if (iterations && counter >= iterations) break;

        target = target.parentNode;
    }

    return target;
}

function showElement(event) {
    var elementAttr = event.target.id || event.target.getAttribute('pointer');

    if (event.type === 'mouseenter') {
        Object.assign(document.querySelector('.' + elementAttr).style, {
            display: 'block',
            left: parseInt(event.target.getAttribute('coordinates').split(',')[0]) + 'px',
            top: parseInt(event.target.getAttribute('coordinates').split(',')[1]) + receivingParent(event.target, 'section__map-wrapper').offsetTop + 'px'
        });
    } else if (event.type === 'mouseleave') {
        var parent = receivingParent(event.relatedTarget, 'section__popup', 4);

        if (typeof parent !== 'undefined' && parent.classList.contains('section__popup')) {
            parent.onmouseleave = function () {

                Object.assign(parent.style, { display: 'none', left: '0', top: '0' });
            };
        } else {
            Object.assign(document.querySelector('.' + elementAttr).style, { display: 'none', left: '0', top: '0' });
        }
    }
}

additionEvent(showElement);

function isPartiallyVisible(block) {
    if (block.parentNode.getBoundingClientRect().top + block.parentNode.clientHeight >= 0 && block.parentNode.clientHeight + window.innerHeight >= block.parentNode.getBoundingClientRect().bottom) return true;else return false;
}

function showTxt() {
    var blocks = document.querySelectorAll('.animate');

    for (var i = 0; i < blocks.length; i++) {
        if (isPartiallyVisible(blocks[i])) blocks[i].classList.add('animate-text');else blocks[i].classList.remove('animate-text');
    }
}

document.addEventListener('scroll', showTxt);