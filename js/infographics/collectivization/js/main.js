'use strict';

var obj = {
    isMove: function isMove() {
        if (document.querySelector('html').scrollTop > 0) return true;else return false;
    },

    createImage: function createImage(config, index, slashX, domParent, imageName) {
        setTimeout(function () {
            obj.animateMove(domParent.image(imageName).size(config.width, config.height).move(slashX, -200), slashX, index % 2 === 0 ? 100 : 180);
        }, 100 * index);
    },

    animateMove: function animateMove(element, x, y) {
        element.animate({ ease: '>' }).move(x, y);
    },

    addEvent: function addEvent(callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            document.addEventListener('scroll', callbacks[i]);
        }
    },

    init: function init() {
        if (screen.width > 768) {
            this.addEvent([this.substitution, this.fallAnimation, this.animateMap, this.animateText, this.animateMapLine, this.animateSwitch]);
        }
    }
};

obj.substitution = function () {
    if (this.isMove()) {
        document.querySelector('.header').style.display = 'none';
        document.querySelector('.header-active').style.display = 'block';
    } else {
        document.querySelector('.header-active').style.display = 'none';
        document.querySelector('.header').style.display = 'block';
    }
}.bind(obj);

obj.fallAnimation = function () {
    var configImage = {
        width: 24,
        height: 200,
        imageName: './img/icon-rustick.svg'
    };
    var html = document.querySelector('html');
    var arr = ['animate-block', 'animate-block_2_'],
        slash = 0,
        parent;

    for (var i = 0; i < arr.length; i++) {
        if (document.querySelector('#' + arr[i]).getBoundingClientRect().top + document.querySelector('#' + arr[i]).clientHeight / 3 >= 0 && document.querySelector('#' + arr[i]).clientHeight / 3 + window.innerHeight >= document.querySelector('#' + arr[i]).getBoundingClientRect().bottom) {

            if (document.querySelector('#' + arr[i]).querySelector('svg') == null) {
                parent = SVG(document.querySelector('#' + arr[i]).id).size('100%', '100%');

                for (var g = 0; g < 15; g++) {
                    if (g === 0) {
                        slash = 0;
                    } else {
                        slash += 45;
                    }
                    this.createImage(configImage, g, slash, parent, g < 12 ? './img/icon-rustick.svg' : './img/icon-worker.svg');
                }
            }
        } else {

            if (document.querySelector('#' + arr[i]).querySelector('svg') != null) {
                document.querySelector('#' + arr[i]).querySelector('svg').remove();
            }
        }
    }
}.bind(obj);

obj.animateText = function () {
    var blocks = document.querySelectorAll('.animateText');
    var h = blocks[0].getBoundingClientRect().top + blocks[0].clientHeight;

    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].getBoundingClientRect().top + blocks[i].clientHeight / 3 > 0 && blocks[i].clientHeight / 3 + window.innerHeight > blocks[i].getBoundingClientRect().bottom) {
            if (blocks[i].querySelector('p') != null) {
                blocks[i].querySelector('p').style.display = 'block';
            }
            if (blocks[i].querySelector('h1') != null) {
                blocks[i].querySelector('h1').style.display = 'block';
            }
        } else {
            if (blocks[i].querySelector('p') != null) {
                blocks[i].querySelector('p').style.display = 'none';
            }
            if (blocks[i].querySelector('h1') != null) {
                blocks[i].querySelector('h1').style.display = 'none';
            }
        }
    }
};

var positionScroll = 0;

// obj.animatePin = function() {
// var html = document.querySelector('html');
// var container = document.querySelector('.image-block__imposition');
// var node = container.parentNode;
// var computedStyle = getComputedStyle(node);
// var newComputedStyle = getComputedStyle(container);

// var top = html.scrollTop - node.offsetTop;

// if (html.scrollTop >= node.offsetTop && html.scrollTop <= node.offsetTop + container.clientHeight) {

//     // if (newComputedStyle.transform.match(/\d+/g) != null && parseFloat(newComputedStyle.transform.match(/\d+/g)[5]) < container.clientHeight) {
//         container.style.position = 'fixed';

//     // }


//     container.style.transform = `translate(0, ${600 - top}px)`;


//         var wayScroll = html.scrollTop;
//         if (wayScroll > positionScroll){
//             node.style.paddingTop = container.clientHeight + 'px';
//             node.style.paddingBottom = '0';

//         } else {
//             node.style.paddingBottom = container.clientHeight + 'px';
//             node.style.paddingTop = '0';

//         }
//         positionScroll = wayScroll;
//     } else {

//         container.style.position = 'relative';
// }

// }

window.onload = function () {};

obj.animateMap = function () {
    var maps = document.querySelectorAll('#map');
    var arr = ['./img/map-1929.svg'];
    var arrP = [];
    var arrPointsY = [135, 141, 147, 147, 141, 153, 153, 153, 159, 159, 159, 159, 165, 165, 165, 165, 165, 177, 177, 177, 177, 177, 147, 171, 171, 171, 183, 183, 183, 189, 189, 189, 189, 189, 201, 201, 201, 201, 207, 207, 219, 219, 201, 213, 213, 225, 213, 195, 195, 195, 195, 282, 288, 288, 288, 300, 300, 300, 294, 294, 282, 282, 306, 306, 306, 293, 299, 299, 299, 311, 311, 311, 305, 305, 305, 305, 305, 293, 317, 317, 396, 402, 402, 402, 414, 414, 414, 408, 408, 396, 396, 420, 150, 150, 150, 162, 168, 162, 162, 168, 156, 156, 144, 168, 122, 128, 128, 128, 140, 134, 134, 122, 260, 266, 266, 266, 266, 272, 272, 272, 260, 260, 306, 312, 312, 312, 312, 318, 318, 324, 318, 306, 300, 306, 268, 268, 268, 268, 274, 268, 280, 280, 280, 280, 280, 274, 262, 200, 200, 200, 200, 206, 200, 212, 212, 212, 212, 212, 206, 206, 218, 224, 224, 224, 224, 224, 218, 218, 140, 146, 146, 152, 152, 152, 158, 158, 176, 176, 164, 164, 164, 170, 170, 170, 170, 170, 188, 188, 182, 182, 182, 182, 182, 200, 200, 194, 194, 194, 194, 194, 212, 212, 218, 218, 206, 206, 212, 224, 224, 230, 230, 224, 236, 206, 206, 206];

    for (var i = 0; i < maps.length; i++) {

        if (maps[i].parentNode.getBoundingClientRect().top + maps[i].parentNode.clientHeight >= 0 && maps[i].parentNode.clientHeight + window.innerHeight >= maps[i].parentNode.getBoundingClientRect().bottom) {
            for (var h = 0; h < arr.length; h++) {
                if (maps[i].src.indexOf(arr[h].substring(1)) == -1) {
                    maps[i].src = arr[h];
                }
            }
        } else {
            for (var h = 0; h < arr.length; h++) {
                if (maps[i].src.indexOf(arr[h].substring(1)) != -1) {
                    maps[i].src = '';
                }
            }
        }
        if (maps[i].getSVGDocument() != null) {
            var getMarkup = maps[i].getSVGDocument();
            var elem = getMarkup.querySelectorAll('.st3');

            for (var g = 0; g < elem.length; g++) {
                SVG.adopt(elem[g]).animate({ ease: '>', delay: '0.' + g + 's' }).y(arrPointsY[g]);

                if (g == elem.length - 1) {
                    var group = getMarkup.querySelectorAll('g');

                    for (var m = 0; m < group.length; m++) {
                        if (m >= 12) {
                            SVG.adopt(group[m]).animate({ delay: '1s' }).style({ opacity: '1' });
                        }
                    }
                }
            }
        }
    }
};

obj.animateMapLine = function () {
    var map = document.querySelector('#map-line');
    var arr = ['./img/map-exile.svg'];

    if (map.parentNode.getBoundingClientRect().top + map.parentNode.clientHeight >= 0 && map.parentNode.clientHeight + window.innerHeight >= map.parentNode.getBoundingClientRect().bottom) {
        for (var h = 0; h < arr.length; h++) {
            if (map.src.indexOf(arr[h].substring(1)) == -1) {
                map.src = arr[h];
            }
        }
    } else {
        for (var h = 0; h < arr.length; h++) {
            if (map.src.indexOf(arr[h].substring(1)) != -1) {
                map.src = '';
            }
        }
    }
    if (map.getSVGDocument() != null) {
        var getMarkup = map.getSVGDocument();
        var elems = getMarkup.querySelector('#lines').querySelectorAll('polygon');

        for (var i = 0; i < elems.length; i++) {

            var element = SVG.adopt(elems[i]);

            var points = element.attr('points');

            var polyPoints = points.split(/[ ,]+/);

            var endPoint = polyPoints[0] + ', ' + polyPoints[1];
            var draw = SVG('map-line');

            var path = draw.path('M' + points + 'z');
            draw.remove();

            element.attr('stroke-dasharray', path.length()).attr('stroke-dashoffset', path.length());
            element.animate({ ease: '<', delay: '' + i + 's' }).attr('stroke-dashoffset', path.length() / 2);
        }
    }
};

var arrY;
obj.animateSwitch = function () {
    var html = document.querySelector('html');
    var container = document.querySelector('.fix-block');
    var map = document.querySelector('#map-switch');
    var node = container.parentNode;
    var computedStyle = getComputedStyle(node);
    var arrPoints1 = [138, 144, 150, 150, 144, 156, 156, 156, 162, 162, 162, 162, 168, 168, 168, 168, 168, 180, 180, 180, 180, 180, 150, 174, 174, 174, 186, 186, 186, 192, 192, 192, 192, 192, 204, 204, 204, 204, 210, 210, 222, 222, 204, 216, 216, 216, 198, 198, 198, 198, 293, 299, 299, 299, 311, 311, 311, 305, 305, 305, 305, 305, 293, 317, 317, 150, 150, 150, 162, 168, 162, 162, 168, 156, 156, 144, 168, 122, 128, 128, 128, 140, 134, 134, 122, 396, 402, 402, 402, 414, 414, 414, 408, 408, 396, 396, 420, 306, 312, 312, 312, 312, 318, 318, 324, 318, 306, 300, 306, 200, 200, 200, 200, 206, 200, 212, 212, 212, 212, 212, 206, 206, 218, 224, 224, 224, 224, 224, 218, 218, 268, 268, 268, 268, 274, 268, 280, 280, 280, 280, 280, 274, 262, 260, 266, 266, 266, 266, 272, 272, 272, 260, 260, 282, 288, 288, 288, 300, 300, 300, 294, 294, 282, 282, 306, 306, 306, 140, 146, 146, 152, 152, 152, 158, 158, 176, 176, 164, 164, 164, 170, 170, 170, 170, 170, 188, 188, 182, 182, 182, 182, 182, 200, 200, 194, 194, 194, 194, 194, 212, 212, 218, 218, 206, 206, 212, 224, 224, 230, 230, 224, 236, 206, 206, 206];
    var arrPoints2 = [141, 147, 153, 153, 147, 159, 159, 159, 165, 165, 165, 165, 171, 171, 171, 171, 171, 183, 183, 183, 183, 183, 153, 177, 177, 177, 189, 189, 189, 195, 195, 195, 195, 195, 207, 207, 207, 207, 213, 213, 207, 219, 219, 219, 201, 201, 201, 201, 293, 299, 299, 299, 311, 311, 311, 305, 305, 305, 305, 305, 293, 317, 150, 150, 150, 162, 168, 162, 162, 168, 156, 156, 144, 122, 128, 128, 128, 140, 134, 134, 122, 399, 405, 405, 405, 417, 417, 417, 411, 411, 399, 399, 309, 315, 315, 315, 315, 321, 321, 321, 309, 303, 309, 200, 200, 200, 200, 206, 200, 212, 212, 212, 212, 212, 206, 206, 218, 224, 224, 224, 224, 218, 218, 268, 268, 268, 268, 274, 268, 280, 280, 280, 280, 280, 274, 262, 260, 266, 266, 266, 266, 272, 272, 260, 260, 282, 288, 288, 288, 300, 300, 300, 294, 294, 282, 282, 306, 306, 306, 143, 149, 149, 155, 155, 155, 161, 161, 179, 179, 167, 167, 167, 173, 173, 173, 173, 173, 191, 191, 185, 185, 185, 185, 185, 203, 203, 197, 197, 197, 197, 197, 215, 215, 221, 221, 209, 209, 215, 227, 227, 233, 233, 227, 209, 209, 209];

    if (html.scrollTop >= node.offsetTop && html.scrollTop <= node.offsetTop + container.clientHeight) {

        container.style.position = 'fixed';
        container.style.left = '50%';
        container.style.marginLeft = '-480px';
        if (html.scrollTop >= node.offsetTop + container.clientHeight / 2) {
            if (map.src.indexOf('./img/map-riots-1931.svg'.substring(1)) == -1) {
                map.src = './img/map-riots-1931.svg';
                arrY = arrPoints2;
            }
        } else {
            if (map.src.indexOf('./img/map-riots-1930.svg'.substring(1)) == -1) {
                map.src = './img/map-riots-1930.svg';
                arrY = arrPoints1;
            }
        }

        var wayScroll = html.scrollTop;
        if (wayScroll > positionScroll) {
            node.style.paddingTop = container.clientHeight + 'px';
            node.style.paddingBottom = '0';
        } else {
            node.style.paddingBottom = container.clientHeight + 'px';
            node.style.paddingTop = '0';
        }
        positionScroll = wayScroll;
    } else {

        container.style.position = 'relative';
        map.src = '';
        container.style.left = '0';
        container.style.marginLeft = '0';
    }
    if (map.getSVGDocument() != null) {
        var getMarkup = map.getSVGDocument();
        var elem = getMarkup.querySelectorAll('.st3, .st4');

        for (var g = 0; g < elem.length; g++) {

            //         arrPoints2.push(SVG.adopt(elem[g]).y());


            //     if (g == elem.length - 1) {
            //         console.log(arrPoints2.join(','));
            //     }

            SVG.adopt(elem[g]).animate({ ease: '>', delay: '0.' + g + 's' }).y(arrY[g]);

            if (g == elem.length - 1) {
                var path = getMarkup.querySelectorAll('path');

                for (var m = 0; m < path.length; m++) {

                    SVG.adopt(path[m]).animate({ delay: '1s' }).style({ opacity: '1' });
                }
            }
        }
    }
};