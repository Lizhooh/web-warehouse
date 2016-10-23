'use strict';

/**
 * 监控滚动条，实现导航位置变化
 */
(function(document, undefined) {

    var start = $$('section.main')
                    .get(0)
                    .offset()
                    .top,

        nav   = $$('header.header > nav')
                    .get(0),

        navch = $$('.nav', nav)
                    .get(0),

        logo  = $$('.logo > a > img', nav)
                    .get(0),

        menu  = $$('.menu-list', nav)
                    .get(0),

        list  = $$('.menu-list > li', nav)
                    .all();


    document.onscroll = function(event) {
        var scrollTop = this.documentElement.scrollTop || this.body.scrollTop;

        if(scrollTop > start + 100) {

            nav.css({
                'position': 'fixed',
                'background-color': 'white',
                'border-bottom': '1px solid #ddd'
            });

            navch.css({'color': '#222'});
            logo.src = 'img/imlogo_b.png';
            menu.addClass('other-color');

            list.forEach(function(item, index, list) {
                item.addClass('other-color');
            });
        }
        else {

            nav.css({
                'position': '',
                'background-color': '',
                'border-bottom': ''
            });

            navch.css({'color': 'white'});
            logo.src = 'img/imlogo.png';
            menu.removeClass('other-color');

            list.forEach(function(item, index, list) {
                item.removeClass('other-color');
            });
        }
    };

})(document, undefined);
