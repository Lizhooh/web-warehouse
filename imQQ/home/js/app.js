'use strict';

/**
 * 监控滚动条，实现导航位置变化
 */
(function(document, undefined) {

    var start = $$('section.main')
                    .get(0)
                    .offset()
                    .top,

        header= $$('header.header')
                    .get(0),

        logo  = $$('.logo > a > img', header)
                    .get(0);


    document.onscroll = function(event) {
        // 获取滚动条-顶端位置
        var scrollTop = this.documentElement.scrollTop || this.body.scrollTop;

        if(scrollTop > start + 100) {
            // 更新状态
            header.addClass('scroll');
            logo.src = 'img/imlogo_b.png';
        }
        else {
            // 还原状态
            header.removeClass('scroll');
            logo.src = 'img/imlogo.png';
        }
    };

})(document, undefined);
